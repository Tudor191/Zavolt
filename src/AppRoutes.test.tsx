import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppRoutes } from './AppRoutes.tsx';
import { SPLASH_DURATION_MS } from './components/SplashGate.tsx';
import { LEGACY_REDIRECTS, SECTIONS, SITE_PLACEHOLDERS } from './sections.ts';
import { REDUCED_MOTION_QUERY, stubMatchMedia } from './test/matchMedia.ts';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

function pageHeading(name: string) {
  return screen.getByRole('heading', { level: 1, name });
}

function sectionById(id: string): HTMLElement {
  const section = document.getElementById(id);
  if (section === null) {
    throw new Error(`There is no element with the id "${id}".`);
  }
  return section;
}

const APPLICATION_SECTIONS = Object.values(SECTIONS).filter(
  (section) => section.area === 'application',
);

describe('routes', () => {
  // Reduced motion skips the application's loading screen, so every page
  // renders at once. The loading screen has its own tests below.
  beforeEach(() => {
    stubMatchMedia([REDUCED_MOTION_QUERY]);
  });

  describe('the public homepage at /', () => {
    it('is the homepage, not the dashboard', () => {
      renderAt('/');

      expect(pageHeading('Your passwords. Your control.')).toBeInTheDocument();
      expect(document.title).toBe('Zavolt · Your passwords. Your control.');
      expect(screen.queryByRole('navigation', { name: 'Sections' })).not.toBeInTheDocument();
    });

    it('has the site header, the main navigation and the footer', () => {
      renderAt('/');

      const main = screen.getByRole('navigation', { name: 'Main' });
      expect(
        within(main)
          .getAllByRole('link')
          .map((link) => [link.textContent, link.getAttribute('href')]),
      ).toEqual([
        ['Product', '/#product'],
        ['Security', '/#security'],
        ['About', '/#about'],
        ['Sign in', '/login'],
        ['Get started', '/register'],
      ]);
      expect(screen.getByRole('navigation', { name: 'Footer' })).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toHaveTextContent('Zavolt is not available yet');
    });

    it('has the sections the navigation points to', () => {
      renderAt('/');

      for (const [id, heading] of [
        ['product', 'Every sign-in, in one place.'],
        ['security', 'Designed so that only you can read your vault.'],
        ['platforms', 'One vault, wherever you sign in.'],
        ['about', 'Security first. Then everything else.'],
      ] as const) {
        expect(within(sectionById(id)).getByRole('heading', { level: 2 })).toHaveTextContent(
          heading,
        );
      }
    });

    it('says plainly that Zavolt is in development', () => {
      renderAt('/');

      expect(screen.getByText('In development · Not yet available')).toBeInTheDocument();
      expect(screen.getByText('Accounts are not open yet.')).toBeInTheDocument();
      expect(
        screen.getByText(/The encryption described here has not been built yet/),
      ).toBeInTheDocument();
    });

    it('labels every feature and platform with its status, and nothing as available', () => {
      renderAt('/');

      const badges = [...document.querySelectorAll('span[data-status]')].map(
        (badge) => badge.textContent,
      );
      expect(badges.length).toBeGreaterThan(0);
      for (const badge of badges) {
        expect(badge).toMatch(/^Status: (Done|In development|Planned)$/);
      }
      expect(screen.queryByText(/available now/i)).not.toBeInTheDocument();

      const features = within(sectionById('product')).getAllByRole('heading', { level: 3 });
      expect(features).toHaveLength(5);
      for (const feature of features) {
        expect(feature.closest('li')).toHaveTextContent('Status: Planned');
      }
    });

    it('sends both calls to action to the registration placeholder and the security section', () => {
      renderAt('/');

      const hero = screen.getByRole('region', { name: 'Your passwords. Your control.' });
      expect(within(hero).getByRole('link', { name: 'Get started' })).toHaveAttribute(
        'href',
        '/register',
      );
      expect(within(hero).getByRole('link', { name: 'Explore security' })).toHaveAttribute(
        'href',
        '/#security',
      );
    });
  });

  describe('the dashboard at /app', () => {
    it('links to the contact, vault and account sections, in that order', () => {
      renderAt('/app');

      const menu = screen.getByRole('navigation', { name: 'Sections' });
      const links = within(menu).getAllByRole('link');

      expect(links.map((link) => [link.textContent, link.getAttribute('href')])).toEqual([
        ['Contact us', '/contact'],
        ['Vault', '/vault'],
        ['Account', '/account'],
      ]);
    });

    it('has a page heading and a document title, and no site header', () => {
      renderAt('/app');

      expect(pageHeading('Dashboard')).toBeInTheDocument();
      expect(document.title).toBe('Dashboard · Zavolt');
      expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    });
  });

  describe('application sections', () => {
    it.each(APPLICATION_SECTIONS)(
      '$path says plainly that the section is not available and links back to the dashboard',
      (section) => {
        renderAt(section.path);

        expect(pageHeading(section.title)).toBeInTheDocument();
        expect(screen.getByText('This section is not available yet.')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Back to dashboard' })).toHaveAttribute(
          'href',
          '/app',
        );
        expect(document.title).toBe(`${section.title} · Zavolt`);
      },
    );
  });

  describe('public placeholder pages', () => {
    it('/contact is public: it has the site header and leads back home', () => {
      renderAt('/contact');

      expect(pageHeading('Contact us')).toBeInTheDocument();
      expect(screen.getByText('This section is not available yet.')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
    });

    it.each(SITE_PLACEHOLDERS)('$path states its limitation and leads back home', (page) => {
      renderAt(page.path);

      expect(pageHeading(page.title)).toBeInTheDocument();
      expect(screen.getByText(page.message)).toBeInTheDocument();
      expect(screen.getByRole('main')).toContainElement(
        screen.getByRole('link', { name: 'Back to home' }),
      );
      expect(document.title).toBe(`${page.title} · Zavolt`);
    });

    it('/login says that signing in is not available', () => {
      renderAt('/login');

      expect(screen.getByText(/Signing in is not available yet/)).toBeInTheDocument();
    });

    it('/register says that registration is not open', () => {
      renderAt('/register');

      expect(screen.getByText(/Registration is not open yet/)).toBeInTheDocument();
    });
  });

  describe('nothing pretends to work', () => {
    const everyPath = [
      '/',
      '/app',
      ...Object.values(SECTIONS).map((section) => section.path),
      ...SITE_PLACEHOLDERS.map((page) => page.path),
      '/no-such-page',
    ];

    it.each(everyPath)('%s has no form, no input and no password field', (path) => {
      const { container } = renderAt(path);

      expect(container.querySelector('form, input, textarea, select')).toBeNull();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it.each(everyPath)('%s has no button other than the site menu toggle', (path) => {
      renderAt(path);

      const buttons = screen.queryAllByRole('button');
      expect(buttons.map((button) => button.textContent)).toEqual(
        buttons.length === 0 ? [] : ['Menu'],
      );
    });
  });

  describe('addresses of the original static site', () => {
    it.each([
      { from: '/index.html', heading: 'Dashboard' },
      { from: '/account.html', heading: 'Account' },
      { from: '/cart.html', heading: 'Cart' },
      { from: '/shop.html', heading: 'Shop' },
    ])('$from shows the page that replaced it', ({ from, heading }) => {
      renderAt(from);

      expect(pageHeading(heading)).toBeInTheDocument();
    });

    it('sends /index.html, the original dashboard, to /app', () => {
      expect(LEGACY_REDIRECTS).toContainEqual({ from: '/index.html', to: '/app' });
    });

    it('covers every document the original site had', () => {
      expect(LEGACY_REDIRECTS.map((redirect) => redirect.from)).toEqual([
        '/index.html',
        '/account.html',
        '/cart.html',
        '/shop.html',
      ]);
    });
  });

  describe('unknown addresses', () => {
    it('show a public not-found page with a way back home', () => {
      renderAt('/does-not-exist');

      expect(pageHeading('Page not found')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
      expect(document.title).toBe('Page not found · Zavolt');
    });
  });

  describe('navigation', () => {
    it('goes from the dashboard to a section and back, moving focus to each new heading', async () => {
      const user = userEvent.setup();
      renderAt('/app');

      await user.click(screen.getByRole('link', { name: 'Vault' }));
      expect(pageHeading('Vault')).toHaveFocus();
      expect(document.title).toBe('Vault · Zavolt');

      await user.click(screen.getByRole('link', { name: 'Back to dashboard' }));
      expect(pageHeading('Dashboard')).toHaveFocus();
      expect(document.title).toBe('Dashboard · Zavolt');
    });

    it('can drive the dashboard from the keyboard alone', async () => {
      const user = userEvent.setup();
      renderAt('/app');

      await user.tab();
      expect(screen.getByRole('link', { name: 'Contact us' })).toHaveFocus();
      await user.tab();
      await user.tab();
      expect(screen.getByRole('link', { name: 'Account' })).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(pageHeading('Account')).toHaveFocus();
    });

    it('opens a public page at the top and focuses its heading', async () => {
      const scrollTo = vi.spyOn(window, 'scrollTo');
      const user = userEvent.setup();
      renderAt('/');

      await user.click(
        within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', {
          name: 'Sign in',
        }),
      );

      expect(pageHeading('Sign in')).toHaveFocus();
      expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });
    });

    it('scrolls to a section and focuses its heading when an in-page link is followed', async () => {
      const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView');
      const user = userEvent.setup();
      renderAt('/login');

      await user.click(
        within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', {
          name: 'Security',
        }),
      );

      const heading = screen.getByRole('heading', {
        level: 2,
        name: 'Designed so that only you can read your vault.',
      });
      expect(heading).toHaveFocus();
      expect(scrollIntoView.mock.contexts).toContain(sectionById('security'));
    });

    it('scrolls to the section named in the address when the page is first opened', () => {
      renderAt('/#platforms');

      expect(
        screen.getByRole('heading', { level: 2, name: 'One vault, wherever you sign in.' }),
      ).toHaveFocus();
    });

    it('ignores an address fragment that names nothing', () => {
      renderAt('/#%E0%A4%A');

      expect(document.body).toHaveFocus();
    });

    it('leaves focus alone on the first page shown', () => {
      renderAt(SECTIONS.vault.path);

      expect(pageHeading('Vault')).not.toHaveFocus();
      expect(document.body).toHaveFocus();
    });
  });
});

describe('the loading screen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('plays before the dashboard', () => {
    renderAt('/app');

    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
    expect(screen.queryByRole('navigation', { name: 'Sections' })).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(SPLASH_DURATION_MS);
    });

    expect(pageHeading('Dashboard')).toBeInTheDocument();
  });

  it('plays before an application section opened directly', () => {
    renderAt('/vault');

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('plays after the redirect from the original dashboard address', () => {
    renderAt('/index.html');

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it.each(['/', '/login', '/register', '/contact', '/privacy', '/terms', '/no-such-page'])(
    'never delays the public page %s',
    (path) => {
      renderAt(path);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument();
    },
  );
});
