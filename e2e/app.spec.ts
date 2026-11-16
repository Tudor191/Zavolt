import { AxeBuilder } from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures.ts';

// The application's dashboard; the public homepage is at `/` (see site.spec.ts).
const DASHBOARD = '/app';

const BACK_TO_DASHBOARD = { name: 'Back to dashboard', to: DASHBOARD } as const;
const BACK_TO_HOME = { name: 'Back to home', to: '/' } as const;

// Contact is public, so it leads back to the homepage; the others belong to the application.
const DASHBOARD_SECTIONS = [
  { name: 'Contact us', path: '/contact', back: BACK_TO_HOME },
  { name: 'Vault', path: '/vault', back: BACK_TO_DASHBOARD },
  { name: 'Account', path: '/account', back: BACK_TO_DASHBOARD },
] as const;

const ALL_SECTIONS = [
  ...DASHBOARD_SECTIONS,
  { name: 'Cart', path: '/cart' },
  { name: 'Shop', path: '/shop' },
] as const;

const menu = (page: Page) => page.getByRole('navigation', { name: 'Sections' });
const pageHeading = (page: Page, name: string) => page.getByRole('heading', { level: 1, name });

/** Runs the axe-core rules against the page and returns one line per violation. */
async function accessibilityViolations(page: Page): Promise<string[]> {
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations.map((violation) => `${violation.id}: ${violation.help}`);
}

/** How long the loading screen stays up: `SPLASH_DURATION_MS` in the application. */
const SPLASH_DURATION_MS = 3000;

const loaderArtwork = (page: Page) => page.getByRole('status').locator('svg');

/** Opens the dashboard with the page's clock stopped, so the loading screen stays up. */
async function openLoadingScreen(page: Page): Promise<void> {
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto(DASHBOARD);
  await expect(page.getByRole('status')).toBeVisible();
}

/** What the loader's drawing shows at one moment. */
interface LoaderFrame {
  /** The key's opacity: 0 when it is not there. */
  readonly keyOpacity: number;
  /** The key lies level with the keyhole. */
  readonly keyLevel: boolean;
  /** The tip of the key is past the centre of the keyhole: it is in the lock. */
  readonly keyInside: boolean;
  /** How tall the key looks against its full height: 1 seen flat, near 0 edge-on. */
  readonly keyFacing: number;
  /** The free end of the shackle has come out of the padlock's body. */
  readonly open: boolean;
}

/**
 * Seeks the drawing's animations, if any are running, to each of `times` in
 * turn and measures the drawing there. Seeking, rather than waiting, makes every
 * measurement exact: nothing depends on how fast the browser renders frames.
 */
function loaderFrames(page: Page, times: readonly number[]): Promise<LoaderFrame[]> {
  return loaderArtwork(page).evaluate((artwork, moments) => {
    if (!(artwork instanceof SVGSVGElement)) {
      throw new Error('The loader has no artwork.');
    }
    const svg = artwork;
    const part = (name: string): SVGGraphicsElement => {
      const element = svg.querySelector(`[data-part="${name}"]`);
      if (!(element instanceof SVGGraphicsElement)) {
        throw new Error(`The artwork has no ${name}.`);
      }
      return element;
    };
    const shackle = part('shackle');
    const body = part('body');
    const key = part('key');
    const keyholeRound = part('keyhole').querySelector('circle');
    const keyBow = key.querySelector('circle');
    if (!(shackle instanceof SVGGeometryElement) || keyholeRound === null || keyBow === null) {
      throw new Error('The artwork is not drawn as this test expects.');
    }
    // How much an element is stretched vertically, against the drawing as a whole.
    const stretch = (element: SVGGraphicsElement) => {
      const own = element.getScreenCTM();
      const drawing = svg.getScreenCTM();
      if (own === null || drawing === null) {
        throw new Error('The artwork is not rendered.');
      }
      return Math.hypot(own.b, own.d) / Math.hypot(drawing.b, drawing.d);
    };
    const animations = svg.getAnimations({ subtree: true });

    return moments.map((time) => {
      for (const animation of animations) {
        animation.pause();
        animation.currentTime = time;
      }
      const keyBox = key.getBoundingClientRect();
      const hole = keyholeRound.getBoundingClientRect();
      // The shackle's path ends at its free end, which carries a round cap.
      const shackleMatrix = shackle.getScreenCTM();
      if (shackleMatrix === null) {
        throw new Error('The artwork is not rendered.');
      }
      const freeEnd = shackle
        .getPointAtLength(shackle.getTotalLength())
        .matrixTransform(shackleMatrix);
      const capRadius =
        (Number.parseFloat(getComputedStyle(shackle).strokeWidth) / 2) *
        Math.hypot(shackleMatrix.b, shackleMatrix.d);
      return {
        keyOpacity: Number(getComputedStyle(key).opacity),
        keyLevel: Math.abs(keyBox.top + keyBox.height / 2 - (hole.top + hole.height / 2)) < 0.5,
        keyInside: keyBox.left < hole.left + hole.width / 2,
        keyFacing: stretch(keyBow),
        open: freeEnd.y + capRadius < body.getBoundingClientRect().top,
      };
    });
  }, times);
}

// Asking for reduced motion makes the application skip its three-second splash
// and stop animating, which keeps this suite fast and deterministic. The splash
// itself is covered by its own test, with motion enabled.
test.use({ reducedMotion: 'reduce' });

test.describe('splash', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('shows an accessible loader for three seconds, then reveals the dashboard', async ({
    page,
  }) => {
    // Freeze the page's clock before it loads, so the three seconds are stepped
    // through exactly instead of being raced against.
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(1000);
    await page.goto(DASHBOARD);

    // What assistive technology is told while loading. (The axe scan used for
    // the other pages needs timers, so it cannot run while the clock is frozen.)
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - main:
        - heading "Zavolt" [level=1]
        - status:
          - paragraph: Loading...
    `);
    await expect(menu(page)).toBeHidden();

    await page.clock.runFor(2999);
    await expect(page.getByRole('status')).toBeVisible();
    await expect(menu(page)).toBeHidden();

    await page.clock.runFor(1);
    await expect(menu(page)).toBeVisible();
    await expect(page.getByRole('status')).toBeHidden();
  });

  test('plays one unlocking sequence, which is over before the loading screen closes', async ({
    page,
  }) => {
    await openLoadingScreen(page);

    const timings = await loaderArtwork(page).evaluate((svg) =>
      svg.getAnimations({ subtree: true }).map((animation) => {
        const effect = animation.effect;
        const timing = effect?.getComputedTiming();
        const target = effect instanceof KeyframeEffect ? effect.target : null;
        return {
          part: target?.closest('[data-part]')?.getAttribute('data-part'),
          iterations: timing?.iterations,
          delay: timing?.delay,
          fill: timing?.fill,
          duration: Number(timing?.duration),
          endTime: Number(timing?.endTime),
        };
      }),
    );

    // The padlock, its shackle and the key all move...
    expect(new Set(timings.map((timing) => timing.part))).toEqual(
      new Set(['padlock', 'shackle', 'key']),
    );
    // ...as one sequence: played once, starting together, ending together, and
    // holding their last frame.
    const duration = timings[0]?.duration ?? Number.NaN;
    for (const timing of timings) {
      expect(timing).toMatchObject({
        iterations: 1,
        delay: 0,
        fill: 'both',
        duration,
        endTime: duration,
      });
    }
    expect(duration).toBeGreaterThanOrEqual(2600);
    expect(duration).toBeLessThanOrEqual(2800);
    expect(duration).toBeLessThan(SPLASH_DURATION_MS);
  });

  test('the key goes into the keyhole and turns, then the padlock opens and stays open', async ({
    page,
  }) => {
    await openLoadingScreen(page);

    // Every 25ms of the loading screen's life, including after the sequence ends.
    const times = Array.from({ length: SPLASH_DURATION_MS / 25 }, (_, step) => step * 25);
    times.push(SPLASH_DURATION_MS - 1);
    const frames = await loaderFrames(page, times);
    const at = (index: number) => `at ${String(times[index])}ms`;

    // At first the padlock is closed and there is no key.
    expect(frames[0]).toMatchObject({ open: false, keyOpacity: 0 });

    const inside = frames.findIndex((frame) => frame.keyInside);
    const turned = frames.findIndex((frame) => frame.keyFacing < 0.5);
    const opened = frames.findIndex((frame) => frame.open);
    const gone = frames.findIndex((frame, index) => index > opened && frame.keyOpacity === 0);

    // The key comes into view and lines up with the keyhole before going in.
    expect(inside).toBeGreaterThan(0);
    expect(frames.slice(0, inside).some((frame) => frame.keyOpacity === 1 && frame.keyLevel)).toBe(
      true,
    );

    // It turns once it is in, and the padlock opens once it has turned: never
    // before, and with the key still in the lock.
    expect(turned).toBeGreaterThan(inside);
    expect(opened).toBeGreaterThanOrEqual(turned);
    frames.slice(0, opened).forEach((frame, index) => {
      expect(frame.open, `closed ${at(index)}`).toBe(false);
    });
    frames.slice(inside, opened + 1).forEach((frame, index) => {
      expect(frame, `key in the lock ${at(inside + index)}`).toMatchObject({
        keyOpacity: 1,
        keyLevel: true,
        keyInside: true,
      });
    });

    // Then the key is drawn out of the keyhole, in full view, and fades away.
    expect(gone).toBeGreaterThan(opened);
    expect(
      frames.slice(opened, gone).some((frame) => !frame.keyInside && frame.keyOpacity === 1),
    ).toBe(true);

    // From then until the loading screen closes, the padlock stays open.
    frames.slice(opened).forEach((frame, index) => {
      expect(frame.open, `open ${at(opened + index)}`).toBe(true);
    });
    frames.slice(gone).forEach((frame, index) => {
      expect(frame.keyOpacity, `no key ${at(gone + index)}`).toBe(0);
    });
  });

  test('at rest, the drawing is its last frame: the open padlock', async ({ page }) => {
    await openLoadingScreen(page);
    const [lastFrame] = await loaderFrames(page, [SPLASH_DURATION_MS - 1]);
    expect(lastFrame).toMatchObject({ open: true, keyOpacity: 0 });

    // What shows wherever the animation does not run.
    await loaderArtwork(page).evaluate((svg) => {
      for (const animation of svg.getAnimations({ subtree: true })) {
        animation.cancel();
      }
    });
    expect(await loaderFrames(page, [0])).toEqual([lastFrame]);
  });

  test('stands still and open for a visitor who asks for reduced motion', async ({ page }) => {
    // The loading screen is skipped for such visitors. Should the preference
    // change while it shows, the drawing stops on the open padlock.
    await openLoadingScreen(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await expect
      .poll(() =>
        loaderArtwork(page).evaluate((svg) => svg.getAnimations({ subtree: true }).length),
      )
      .toBe(0);
    expect(await loaderFrames(page, [0])).toEqual([
      { keyOpacity: 0, keyLevel: true, keyInside: false, keyFacing: 1, open: true },
    ]);
  });

  test('plays once per page load, however the visitor moves around', async ({ page }) => {
    await openLoadingScreen(page);
    await page.clock.runFor(SPLASH_DURATION_MS);
    await expect(menu(page)).toBeVisible();
    // The page's clock stays stopped from here on: a loading screen that
    // played again would never close, and the pages below would never appear.

    // Around the application...
    await menu(page).getByRole('link', { name: 'Vault' }).click();
    await expect(pageHeading(page, 'Vault')).toBeVisible();
    await expect(page.getByRole('status')).toHaveCount(0);
    await page.getByRole('link', { name: 'Back to dashboard' }).click();
    await expect(menu(page)).toBeVisible();
    await expect(page.getByRole('status')).toHaveCount(0);

    // ...out to the public site and back again.
    await menu(page).getByRole('link', { name: 'Contact us' }).click();
    await expect(pageHeading(page, 'Contact us')).toBeVisible();
    await page.goBack();
    await expect(menu(page)).toBeVisible();
    await expect(page.getByRole('status')).toHaveCount(0);

    // Loading the page again starts afresh.
    await page.reload();
    await expect(page.getByRole('status')).toBeVisible();
    await expect(menu(page)).toBeHidden();
  });

  test('stays centred, and on screen, from start to finish at every width', async ({ page }) => {
    await openLoadingScreen(page);

    for (const width of [320, 390, 1280, 1920]) {
      await page.setViewportSize({ width, height: 800 });
      const extent = await loaderArtwork(page).evaluate((svg, lifetime) => {
        const part = (name: string) => {
          const element = svg.querySelector(`[data-part="${name}"]`);
          if (element === null) {
            throw new Error(`The artwork has no ${name}.`);
          }
          return element;
        };
        const animations = svg.getAnimations({ subtree: true });
        const result = { left: Infinity, right: -Infinity, offCentre: 0, sideways: 0 };
        for (let time = 0; time < lifetime; time += 50) {
          for (const animation of animations) {
            animation.pause();
            animation.currentTime = time;
          }
          // Only what can be seen: the padlock fades in and the key fades out.
          for (const name of ['padlock', 'key']) {
            const element = part(name);
            if (Number(getComputedStyle(element).opacity) > 0) {
              const box = element.getBoundingClientRect();
              result.left = Math.min(result.left, box.left);
              result.right = Math.max(result.right, box.right);
            }
          }
          const body = part('body').getBoundingClientRect();
          result.offCentre = Math.max(
            result.offCentre,
            Math.abs(body.left + body.width / 2 - window.innerWidth / 2),
          );
          result.sideways = Math.max(
            result.sideways,
            document.documentElement.scrollWidth - document.documentElement.clientWidth,
          );
        }
        return result;
      }, SPLASH_DURATION_MS);

      expect(extent.left, `left edge at ${width}px`).toBeGreaterThanOrEqual(0);
      expect(extent.right, `right edge at ${width}px`).toBeLessThanOrEqual(width);
      expect(extent.offCentre, `distance from the centre at ${width}px`).toBeLessThan(1);
      expect(extent.sideways, `sideways overflow at ${width}px`).toBe(0);
    }
  });
});

test.describe('dashboard', () => {
  test('every item leads to its section, and every section leads back', async ({ page }) => {
    for (const section of DASHBOARD_SECTIONS) {
      await page.goto(DASHBOARD);
      await menu(page).getByRole('link', { name: section.name }).click();

      await expect(page).toHaveURL(section.path);
      await expect(page).toHaveTitle(`${section.name} · Zavolt`);
      await expect(pageHeading(page, section.name)).toBeFocused();
      await expect(page.getByText('This section is not available yet.')).toBeVisible();

      await page.getByRole('main').getByRole('link', { name: section.back.name }).click();

      await expect(page).toHaveURL(section.back.to);
    }

    // Back from an application section lands on the dashboard, focused.
    await page.goto('/vault');
    await page.getByRole('link', { name: 'Back to dashboard' }).click();
    await expect(page).toHaveTitle('Dashboard · Zavolt');
    await expect(pageHeading(page, 'Dashboard')).toBeFocused();
  });

  test('can be used with the keyboard alone, and shows the focused item', async ({ page }) => {
    await page.goto(DASHBOARD);
    await expect(menu(page)).toBeVisible();

    await page.keyboard.press('Tab');
    const contact = menu(page).getByRole('link', { name: 'Contact us' });
    await expect(contact).toBeFocused();
    await expect(contact.getByText('Contact us')).toHaveCSS('opacity', '1');

    await page.keyboard.press('Tab');
    await expect(menu(page).getByRole('link', { name: 'Vault' })).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL('/vault');
    await expect(pageHeading(page, 'Vault')).toBeFocused();
  });

  test('with a mouse, a label appears while its ring is hovered', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Hover does not exist on touch screens.');
    await page.goto(DASHBOARD);
    const vault = menu(page).getByRole('link', { name: 'Vault' });
    const label = vault.getByText('Vault');

    await expect(label).toHaveCSS('opacity', '0');
    await vault.hover();
    await expect(label).toHaveCSS('opacity', '1');
  });

  test('on a touch screen, labels are always visible and can be tapped', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'Covers devices without hover.');
    await page.goto(DASHBOARD);
    expect(await page.evaluate(() => window.matchMedia('(hover: none)').matches)).toBe(true);

    for (const section of DASHBOARD_SECTIONS) {
      const link = menu(page).getByRole('link', { name: section.name });
      await expect(link.getByText(section.name)).toHaveCSS('opacity', '1');
    }

    await menu(page).getByRole('link', { name: 'Account' }).getByText('Account').tap();
    await expect(page).toHaveURL('/account');
  });

  test('fits every screen width without sideways scrolling', async ({ page }) => {
    await page.goto(DASHBOARD);
    await expect(menu(page)).toBeVisible();
    const links = await menu(page).getByRole('link').all();
    expect(links).toHaveLength(3);

    // From a small phone to a desktop, including the widths just above the
    // point where the items switch from a column to a row.
    for (const width of [320, 412, 720, 721, 768, 844, 1280]) {
      await page.setViewportSize({ width, height: 800 });

      for (const link of links) {
        const box = await link.boundingBox();
        expect(box?.x, `left edge at ${width}px`).toBeGreaterThanOrEqual(0);
        expect((box?.x ?? 0) + (box?.width ?? 0), `right edge at ${width}px`).toBeLessThanOrEqual(
          width,
        );
      }
      const sidewaysOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(sidewaysOverflow, `sideways overflow at ${width}px`).toBe(0);
    }
  });
});

test.describe('addresses', () => {
  test('every section can be opened directly', async ({ page }) => {
    for (const section of ALL_SECTIONS) {
      await page.goto(section.path);
      await expect(pageHeading(page, section.name)).toBeVisible();
    }
  });

  test('addresses of the original static site still work', async ({ page }) => {
    const legacyAddresses = [
      { from: '/index.html', to: DASHBOARD, heading: 'Dashboard' },
      { from: '/account.html', to: '/account', heading: 'Account' },
      { from: '/cart.html', to: '/cart', heading: 'Cart' },
      { from: '/shop.html', to: '/shop', heading: 'Shop' },
    ];
    for (const address of legacyAddresses) {
      await page.goto(address.from);
      await expect(page).toHaveURL(address.to);
      await expect(pageHeading(page, address.heading)).toBeAttached();
    }
  });

  test('an unknown address shows a not-found page with a way back', async ({ page }) => {
    await page.goto('/no-such-page');

    await expect(pageHeading(page, 'Page not found')).toBeVisible();
    await page.getByRole('link', { name: 'Back to home' }).click();
    await expect(page).toHaveURL('/');
    await expect(pageHeading(page, 'Your passwords. Your control.')).toBeVisible();
  });

  test('the logo is still served from its original address', async ({ request }) => {
    const response = await request.get('/images/logo.png');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('image/png');
  });
});

test.describe('security', () => {
  test('ships exactly the intended Content-Security-Policy', async ({ page }) => {
    await page.goto('/');

    const content = await page
      .locator('meta[http-equiv="Content-Security-Policy"]')
      .getAttribute('content');
    const directives = (content ?? '')
      .split(';')
      .map((directive) => directive.trim().replaceAll(/\s+/g, ' '))
      .filter((directive) => directive !== '');

    // Loosening this policy is a security decision. Change this list only
    // together with a review of the reason.
    expect(directives).toEqual([
      "default-src 'none'",
      "script-src 'self'",
      "style-src 'self'",
      "img-src 'self'",
      "font-src 'self'",
      "connect-src 'self'",
      "base-uri 'none'",
      "form-action 'self'",
      "require-trusted-types-for 'script'",
      "trusted-types 'none'",
    ]);
  });

  test('the browser enforces the policy against script injection', async ({ page, problems }) => {
    await page.goto('/');
    await expect(pageHeading(page, 'Your passwords. Your control.')).toBeVisible();

    // Each attempt would set a marker on <body> if its injected code ran.
    //
    // The attempts run from a timer, as ordinary page script would. Code that
    // the test harness evaluates directly is exempt from the policy's eval
    // restriction, so probing from there would prove nothing.
    const executed = await page.evaluate(
      () =>
        new Promise<Record<'htmlString' | 'inlineHandler' | 'evaluatedString', boolean>>(
          (resolve) => {
            window.setTimeout(() => {
              // 1. Markup built from a string, the classic DOM XSS sink.
              try {
                const container = document.createElement('div');
                // oxlint-disable-next-line no-restricted-properties -- deliberately attacking the page to prove the policy stops it.
                container.innerHTML =
                  '<img src="x" onerror="document.body.dataset.fromHtml = \'yes\'">';
                document.body.append(container);
              } catch {
                // Trusted Types rejects the assignment.
              }

              // 2. An inline event handler.
              try {
                const button = document.createElement('button');
                button.setAttribute('onclick', "document.body.dataset.fromHandler = 'yes'");
                document.body.append(button);
                button.click();
                button.remove();
              } catch {
                // Trusted Types rejects the attribute.
              }

              // 3. Code evaluated from a string.
              try {
                // oxlint-disable-next-line no-eval -- deliberately attacking the page to prove the policy stops it.
                window.eval("document.body.dataset.fromEval = 'yes'");
              } catch {
                // The policy does not allow 'unsafe-eval'.
              }

              const markers = document.body.dataset;
              resolve({
                htmlString: markers['fromHtml'] === 'yes',
                inlineHandler: markers['fromHandler'] === 'yes',
                evaluatedString: markers['fromEval'] === 'yes',
              });
            }, 0);
          },
        ),
    );

    expect(executed).toEqual({
      htmlString: false,
      inlineHandler: false,
      evaluatedString: false,
    });

    // The browser reports each refusal; those reports are expected here.
    expect(problems.length).toBeGreaterThan(0);
    problems.length = 0;
  });

  test('refuses to start inside a frame on another site', async ({ page, problems, baseURL }) => {
    await page.setContent(
      `<iframe title="Framed application" src="${baseURL ?? ''}/" width="800" height="600"></iframe>`,
    );

    await expect.poll(() => problems).toContain('uncaught: Zavolt does not run inside a frame.');
    await expect(page.frameLocator('iframe').locator('#root')).toBeEmpty();
    problems.length = 0;
  });

  test('loads nothing from any other origin', async ({ page, baseURL }) => {
    const origins = new Set<string>();
    page.on('request', (request) => origins.add(new URL(request.url()).origin));

    // The public site and the application, including fonts, icons and navigation.
    await page.goto('/');
    await page.getByRole('link', { name: 'Explore security' }).first().click();
    await expect(page.getByRole('heading', { level: 2, name: /only you can read/ })).toBeFocused();
    await page.goto(DASHBOARD);
    await menu(page).getByRole('link', { name: 'Vault' }).click();
    await expect(pageHeading(page, 'Vault')).toBeVisible();

    expect([...origins]).toEqual([new URL(baseURL ?? '').origin]);
  });
});

test.describe('accessibility', () => {
  for (const path of [
    '/',
    DASHBOARD,
    '/vault',
    '/cart',
    '/contact',
    '/login',
    '/register',
    '/privacy',
    '/terms',
    '/no-such-page',
  ]) {
    test(`${path} has no detectable accessibility violations`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('main h1')).toBeAttached();

      expect(await accessibilityViolations(page)).toEqual([]);
    });
  }
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('explains that JavaScript is required', async ({ page }) => {
    await page.goto('/');

    // Located by element because text queries skip <noscript> content.
    const message = page.locator('noscript p');
    await expect(message).toBeVisible();
    await expect(message).toContainText('Zavolt needs JavaScript to run.');
  });
});
