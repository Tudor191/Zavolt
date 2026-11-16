import { AxeBuilder } from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures.ts';

const HERO_HEADING = 'Your passwords. Your control.';

const mainNavigation = (page: Page) => page.getByRole('navigation', { name: 'Main' });
const menuButton = (page: Page) => page.getByRole('button', { name: 'Menu' });
const pageHeading = (page: Page, name: string | RegExp) =>
  page.getByRole('heading', { level: 1, name });

/** The homepage sections the main navigation links to, and their headings. */
const SECTIONS = [
  { link: 'Product', hash: '#product', heading: 'Every sign-in, in one place.' },
  {
    link: 'Security',
    hash: '#security',
    heading: 'Designed so that only you can read your vault.',
  },
  { link: 'About', hash: '#about', heading: 'Security first. Then everything else.' },
] as const;

async function sidewaysOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

// Reduced motion keeps the suite deterministic; motion has its own tests below.
test.use({ reducedMotion: 'reduce' });

test.describe('homepage', () => {
  test('is the public homepage, not the application', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('Zavolt · Your passwords. Your control.');
    await expect(pageHeading(page, HERO_HEADING)).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Sections' })).toHaveCount(0);
    await expect(page.getByRole('status')).toHaveCount(0);
  });

  test('says plainly that Zavolt is in development and not available', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('In development · Not yet available')).toBeVisible();
    await expect(page.getByText('Accounts are not open yet.', { exact: true })).toBeVisible();
    await expect(
      page.getByText(/The encryption described here has not been built yet/),
    ).toBeVisible();
    await expect(page.getByRole('contentinfo')).toContainText('Zavolt is not available yet');
  });

  test('has every section, each with its heading', async ({ page }) => {
    await page.goto('/');

    for (const section of [
      ...SECTIONS,
      { hash: '#platforms', heading: 'One vault, wherever you sign in.' },
    ]) {
      await expect(
        page.locator(section.hash).getByRole('heading', { level: 2, name: section.heading }),
      ).toBeAttached();
    }
    await expect(
      page.getByRole('heading', { level: 2, name: 'Take back control of your passwords.' }),
    ).toBeAttached();
  });

  test('labels everything planned as planned, and offers no downloads', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#product li h3')).toHaveCount(5);
    for (const feature of await page.locator('#product > div > ul > li').all()) {
      await expect(feature).toContainText('Planned');
    }
    await expect(page.locator('#platforms')).toContainText('Desktop app');
    await expect(page.getByRole('link', { name: /download/i })).toHaveCount(0);
    const downloadMentions = page.getByText(/download/i);
    await expect(downloadMentions).toHaveCount(1);
    await expect(downloadMentions).toContainText('None of them can be downloaded or used yet.');
  });
});

test.describe('navigation', () => {
  test('the main navigation scrolls to each section and focuses its heading', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'On phones the navigation is behind the menu button; tested below.');
    await page.goto('/');

    for (const section of SECTIONS) {
      await mainNavigation(page).getByRole('link', { name: section.link }).click();

      await expect(page).toHaveURL(`/${section.hash}`);
      const heading = page.getByRole('heading', { level: 2, name: section.heading });
      await expect(heading).toBeFocused();
      await expect(heading).toBeInViewport();
    }
  });

  test('sign-in and registration lead to pages that state their limits', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'On phones the navigation is behind the menu button; tested below.');
    await page.goto('/');

    await mainNavigation(page).getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/login');
    await expect(pageHeading(page, 'Sign in')).toBeFocused();
    await expect(page.getByText(/Signing in is not available yet/)).toBeVisible();

    await mainNavigation(page).getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL('/register');
    await expect(pageHeading(page, 'Create an account')).toBeFocused();
    await expect(page.getByText(/Registration is not open yet/)).toBeVisible();

    await page.getByRole('link', { name: 'Zavolt home' }).first().click();
    await expect(page).toHaveURL('/');
    await expect(pageHeading(page, HERO_HEADING)).toBeFocused();
  });

  test('a section link from another page opens the homepage at that section', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'On phones the navigation is behind the menu button; tested below.');
    await page.goto('/login');

    await mainNavigation(page).getByRole('link', { name: 'Security' }).click();

    await expect(page).toHaveURL('/#security');
    await expect(
      page.getByRole('heading', { level: 2, name: SECTIONS[1].heading }),
    ).toBeInViewport();
  });

  test('opening an address with a section in it starts at that section', async ({ page }) => {
    await page.goto('/#about');

    await expect(
      page.getByRole('heading', { level: 2, name: SECTIONS[2].heading }),
    ).toBeInViewport();
  });

  test('the calls to action lead where they say', async ({ page }) => {
    await page.goto('/');
    const hero = page.getByRole('region', { name: HERO_HEADING });

    await hero.getByRole('link', { name: 'Explore security' }).click();
    await expect(page.getByRole('heading', { level: 2, name: SECTIONS[1].heading })).toBeFocused();

    await hero.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL('/register');
  });

  test('every footer link works', async ({ page }) => {
    const links = [
      { name: 'Features', url: '/#product' },
      { name: 'Platforms', url: '/#platforms' },
      { name: 'Security', url: '/#security' },
      { name: 'About', url: '/#about' },
      { name: 'Contact', url: '/contact', heading: 'Contact us' },
      { name: 'Privacy policy', url: '/privacy', heading: 'Privacy policy' },
      { name: 'Terms of service', url: '/terms', heading: 'Terms of service' },
    ];
    for (const link of links) {
      await page.goto('/');
      await page
        .getByRole('navigation', { name: 'Footer' })
        .getByRole('link', { name: link.name })
        .click();

      await expect(page).toHaveURL(link.url);
      if (link.heading !== undefined) {
        await expect(pageHeading(page, link.heading)).toBeFocused();
      }
    }
  });

  test('the legal pages say that no document has been published', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.getByText('The privacy policy has not been published yet.')).toBeVisible();

    await page.goto('/terms');
    await expect(page.getByText('The terms of service have not been published yet.')).toBeVisible();
  });

  test('the skip link is the first stop for the keyboard and jumps to the content', async ({
    page,
  }) => {
    await page.goto('/login');
    await expect(pageHeading(page, 'Sign in')).toBeVisible();

    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeInViewport();

    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
  });
});

test.describe('mobile menu', () => {
  test('opens and closes by touch, and following a link closes it', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'The menu button only exists on narrow screens.');
    await page.goto('/');
    await expect(mainNavigation(page)).toBeHidden();

    await menuButton(page).tap();
    await expect(menuButton(page)).toHaveAttribute('aria-expanded', 'true');
    await expect(mainNavigation(page)).toBeVisible();

    await mainNavigation(page).getByRole('link', { name: 'Security' }).tap();
    await expect(menuButton(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(mainNavigation(page)).toBeHidden();
    await expect(
      page.getByRole('heading', { level: 2, name: SECTIONS[1].heading }),
    ).toBeInViewport();

    await menuButton(page).tap();
    await mainNavigation(page).getByRole('link', { name: 'Get started' }).tap();
    await expect(page).toHaveURL('/register');
    await expect(mainNavigation(page)).toBeHidden();
  });

  test('tapping outside the menu closes it', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'The menu button only exists on narrow screens.');
    await page.goto('/');

    await menuButton(page).tap();
    await expect(mainNavigation(page)).toBeVisible();
    // A line of text below the open panel.
    await page.getByText('Accounts are not open yet.', { exact: true }).tap();

    await expect(mainNavigation(page)).toBeHidden();
  });

  test('works with the keyboard alone', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'The menu button only exists on narrow screens.');
    await page.goto('/');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(menuButton(page)).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(menuButton(page)).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Tab');
    await expect(mainNavigation(page).getByRole('link', { name: 'Product' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(mainNavigation(page)).toBeHidden();
    await expect(menuButton(page)).toBeFocused();

    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/#security');
    await expect(page.getByRole('heading', { level: 2, name: SECTIONS[1].heading })).toBeFocused();
  });

  test('has no accessibility violations while open', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'The menu button only exists on narrow screens.');
    await page.goto('/');
    await menuButton(page).tap();
    await expect(mainNavigation(page)).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([]);
  });
});

test.describe('layout', () => {
  test('the homepage fits every required width without sideways scrolling', async ({ page }) => {
    await page.goto('/');

    for (const width of [320, 390, 768, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });

      expect(await sidewaysOverflow(page), `sideways overflow at ${width}px`).toBe(0);

      const heading = await pageHeading(page, HERO_HEADING).boundingBox();
      expect(heading?.x, `heading left edge at ${width}px`).toBeGreaterThanOrEqual(0);
      expect(
        (heading?.x ?? 0) + (heading?.width ?? 0),
        `heading right edge at ${width}px`,
      ).toBeLessThanOrEqual(width);

      // Nothing, decoration included, may sit on top of a call to action.
      for (const link of await page
        .getByRole('region', { name: HERO_HEADING })
        .getByRole('link')
        .all()) {
        const box = await link.boundingBox();
        const isOnTop = await link.evaluate(
          (element, point) => element.contains(document.elementFromPoint(point.x, point.y)),
          { x: (box?.x ?? 0) + (box?.width ?? 0) / 2, y: (box?.y ?? 0) + (box?.height ?? 0) - 4 },
        );
        expect(isOnTop, `${await link.textContent()} is reachable at ${width}px`).toBe(true);
      }

      if (width < 900) {
        await expect(menuButton(page), `menu button at ${width}px`).toBeVisible();
        await expect(mainNavigation(page), `collapsed navigation at ${width}px`).toBeHidden();
      } else {
        await expect(menuButton(page), `menu button at ${width}px`).toBeHidden();
        await expect(
          mainNavigation(page).getByRole('link', { name: 'Get started' }),
          `header call to action at ${width}px`,
        ).toBeVisible();
      }
    }
  });

  test('every public page fits a small phone without sideways scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });

    for (const path of ['/', '/login', '/register', '/contact', '/privacy', '/terms', '/nope']) {
      await page.goto(path);
      await expect(page.locator('main h1')).toBeVisible();
      expect(await sidewaysOverflow(page), `sideways overflow on ${path}`).toBe(0);
    }
  });
});

test.describe('motion', () => {
  test('nothing moves for visitors who ask for reduced motion', async ({ page }) => {
    await page.goto('/');
    await expect(pageHeading(page, HERO_HEADING)).toBeVisible();

    const running = await page.evaluate(
      () =>
        document.getAnimations().filter((animation) => animation.playState === 'running').length,
    );
    expect(running).toBe(0);
  });

  test.describe('without a motion preference', () => {
    test.use({ reducedMotion: 'no-preference' });

    test('the hero orbit turns and the page has no layout shift from it', async ({ page }) => {
      await page.goto('/');
      await expect(pageHeading(page, HERO_HEADING)).toBeVisible();

      const endless = await page.evaluate(
        () =>
          document
            .getAnimations()
            .filter((animation) => animation.effect?.getTiming().iterations === Infinity).length,
      );
      expect(endless).toBe(3);
      expect(await sidewaysOverflow(page)).toBe(0);
    });

    test('public pages appear at once: the loading screen belongs to the application', async ({
      page,
    }) => {
      for (const path of ['/', '/login', '/register', '/contact']) {
        await page.goto(path);
        await expect(page.locator('main h1')).toBeVisible();
        await expect(page.getByRole('status')).toHaveCount(0);
      }
    });
  });
});

test.describe('honesty', () => {
  const everyPage = [
    '/',
    '/login',
    '/register',
    '/contact',
    '/privacy',
    '/terms',
    '/app',
    '/vault',
    '/account',
    '/cart',
    '/shop',
    '/no-such-page',
  ];

  test('no page has a form, a text field or a password field', async ({ page }) => {
    for (const path of everyPage) {
      await page.goto(path);
      await expect(page.locator('main h1')).toBeAttached();

      await expect(page.locator('form, input, textarea, select'), path).toHaveCount(0);
      await expect(page.getByRole('textbox'), path).toHaveCount(0);
    }
  });

  test('the only button anywhere is the site menu toggle', async ({ page }) => {
    for (const path of everyPage) {
      await page.goto(path);
      await expect(page.locator('main h1')).toBeAttached();

      // Read from the DOM: on wide screens the menu button exists but is not displayed.
      const buttons = await page
        .locator('button')
        .evaluateAll((elements) =>
          elements.map((element) => [element.textContent, element.getAttribute('aria-controls')]),
        );
      expect(buttons.length, path).toBeLessThanOrEqual(1);
      for (const button of buttons) {
        expect(button, path).toEqual(['Menu', 'site-navigation']);
      }
    }
  });
});
