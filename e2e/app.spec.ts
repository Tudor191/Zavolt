import { AxeBuilder } from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures.ts';

const DASHBOARD_SECTIONS = [
  { name: 'Contact us', path: '/contact' },
  { name: 'Vault', path: '/vault' },
  { name: 'Account', path: '/account' },
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
    await page.goto('/');

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
});

test.describe('dashboard', () => {
  test('every item leads to its section, and every section leads back', async ({ page }) => {
    for (const section of DASHBOARD_SECTIONS) {
      await page.goto('/');
      await menu(page).getByRole('link', { name: section.name }).click();

      await expect(page).toHaveURL(section.path);
      await expect(page).toHaveTitle(`${section.name} · Zavolt`);
      await expect(pageHeading(page, section.name)).toBeFocused();
      await expect(page.getByText('This section is not available yet.')).toBeVisible();

      await page.getByRole('link', { name: 'Back to dashboard' }).click();

      await expect(page).toHaveURL('/');
      await expect(page).toHaveTitle('Dashboard · Zavolt');
      await expect(pageHeading(page, 'Dashboard')).toBeFocused();
    }
  });

  test('can be used with the keyboard alone, and shows the focused item', async ({ page }) => {
    await page.goto('/');
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
    await page.goto('/');
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
    await page.goto('/');
    expect(await page.evaluate(() => window.matchMedia('(hover: none)').matches)).toBe(true);

    for (const section of DASHBOARD_SECTIONS) {
      const link = menu(page).getByRole('link', { name: section.name });
      await expect(link.getByText(section.name)).toHaveCSS('opacity', '1');
    }

    await menu(page).getByRole('link', { name: 'Account' }).getByText('Account').tap();
    await expect(page).toHaveURL('/account');
  });

  test('fits every screen width without sideways scrolling', async ({ page }) => {
    await page.goto('/');
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
      { from: '/index.html', to: '/', heading: 'Dashboard' },
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
    await page.getByRole('link', { name: 'Back to dashboard' }).click();
    await expect(page).toHaveURL('/');
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
    await expect(menu(page)).toBeVisible();

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

    await page.goto('/');
    await menu(page).getByRole('link', { name: 'Vault' }).click();
    await expect(pageHeading(page, 'Vault')).toBeVisible();

    expect([...origins]).toEqual([new URL(baseURL ?? '').origin]);
  });
});

test.describe('accessibility', () => {
  for (const path of ['/', '/vault', '/cart', '/no-such-page']) {
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
