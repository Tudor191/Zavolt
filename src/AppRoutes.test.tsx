import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from './AppRoutes.tsx';
import { LEGACY_REDIRECTS, SECTIONS } from './sections.ts';

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

describe('dashboard', () => {
  it('links to the contact, vault and account sections, in that order', () => {
    renderAt('/');

    const menu = screen.getByRole('navigation', { name: 'Sections' });
    const links = within(menu).getAllByRole('link');

    expect(links.map((link) => [link.textContent, link.getAttribute('href')])).toEqual([
      ['Contact us', '/contact'],
      ['Vault', '/vault'],
      ['Account', '/account'],
    ]);
  });

  it('has a page heading and a document title', () => {
    renderAt('/');

    expect(pageHeading('Dashboard')).toBeInTheDocument();
    expect(document.title).toBe('Dashboard · Zavolt');
  });
});

describe('sections', () => {
  it.each(Object.values(SECTIONS))(
    '$path says plainly that the section is not available and links back',
    (section) => {
      renderAt(section.path);

      expect(pageHeading(section.title)).toBeInTheDocument();
      expect(screen.getByText('This section is not available yet.')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Back to dashboard' })).toHaveAttribute('href', '/');
      expect(document.title).toBe(`${section.title} · Zavolt`);
    },
  );

  it('offers no controls that would suggest working functionality', () => {
    renderAt(SECTIONS.vault.path);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(1);
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
  it('shows a not-found page with a way back', () => {
    renderAt('/does-not-exist');

    expect(pageHeading('Page not found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to dashboard' })).toHaveAttribute('href', '/');
    expect(document.title).toBe('Page not found · Zavolt');
  });
});

describe('navigation', () => {
  it('goes from the dashboard to a section and back, moving focus to each new heading', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(screen.getByRole('link', { name: 'Vault' }));
    expect(pageHeading('Vault')).toHaveFocus();
    expect(document.title).toBe('Vault · Zavolt');

    await user.click(screen.getByRole('link', { name: 'Back to dashboard' }));
    expect(pageHeading('Dashboard')).toHaveFocus();
    expect(document.title).toBe('Dashboard · Zavolt');
  });

  it('can be driven from the keyboard alone', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.tab();
    expect(screen.getByRole('link', { name: 'Contact us' })).toHaveFocus();
    await user.tab();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Account' })).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(pageHeading('Account')).toHaveFocus();
  });

  it('leaves focus alone on the first page shown', () => {
    renderAt(SECTIONS.vault.path);

    expect(pageHeading('Vault')).not.toHaveFocus();
    expect(document.body).toHaveFocus();
  });
});
