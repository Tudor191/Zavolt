import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { SiteHeader } from './SiteHeader.tsx';

function renderHeader() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <SiteHeader />
              <p>Page content</p>
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

const menuButton = () => screen.getByRole('button', { name: 'Menu' });
const navigation = () => screen.getByRole('navigation', { name: 'Main', hidden: true });

describe('SiteHeader', () => {
  it('links the brand to the homepage', () => {
    renderHeader();

    expect(screen.getByRole('link', { name: 'Zavolt home' })).toHaveAttribute('href', '/');
  });

  it('has a menu button that says which navigation it controls and that it is closed', () => {
    renderHeader();

    expect(menuButton()).toHaveAttribute('aria-controls', 'site-navigation');
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
    expect(navigation()).toHaveAttribute('id', 'site-navigation');
    expect(navigation()).toHaveAttribute('data-open', 'false');
  });

  it('opens and closes the menu with the button', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(menuButton());
    expect(menuButton()).toHaveAttribute('aria-expanded', 'true');
    expect(navigation()).toHaveAttribute('data-open', 'true');

    await user.click(menuButton());
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('works from the keyboard and closes on Escape, returning focus to the button', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.tab();
    await user.tab();
    expect(menuButton()).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(menuButton()).toHaveAttribute('aria-expanded', 'true');

    await user.tab();
    expect(within(navigation()).getByRole('link', { name: 'Product' })).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
    expect(menuButton()).toHaveFocus();
  });

  it('closes when a link in it is followed', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(menuButton());
    await user.click(within(navigation()).getByRole('link', { name: 'Sign in' }));

    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes when a link to a section of the current page is followed', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(menuButton());
    await user.click(within(navigation()).getByRole('link', { name: 'Security' }));

    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes when the page outside the header is touched', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(menuButton());
    await user.click(screen.getByText('Page content'));

    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('offers sign-in and registration only as links to their placeholder pages', () => {
    renderHeader();

    expect(within(navigation()).getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/login',
    );
    expect(within(navigation()).getByRole('link', { name: 'Get started' })).toHaveAttribute(
      'href',
      '/register',
    );
  });
});
