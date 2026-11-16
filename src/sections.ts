import type { IconName } from './components/Icon.tsx';

/** Accent colours defined in `styles/global.css`. */
export type Accent = 'contact' | 'vault' | 'account';

export type SectionId = 'contact' | 'vault' | 'account' | 'cart' | 'shop';

/** A top-level area of the application that has its own route. */
export interface Section {
  readonly id: SectionId;
  readonly path: `/${string}`;
  /** Display name in sentence case; styling decides the letter case on screen. */
  readonly title: string;
  readonly icon?: IconName | undefined;
  readonly accent?: Accent | undefined;
}

export const DASHBOARD_PATH = '/';

/**
 * Every section is currently a placeholder: none of them has functionality yet.
 *
 * `cart` and `shop` are routes inherited from the original static site. They
 * are not linked from the dashboard and are kept only so that existing URLs
 * keep working until the product owner decides whether to remove them.
 */
export const SECTIONS = {
  contact: {
    id: 'contact',
    path: '/contact',
    title: 'Contact us',
    icon: 'call',
    accent: 'contact',
  },
  vault: {
    id: 'vault',
    path: '/vault',
    title: 'Vault',
    icon: 'lock-closed',
    accent: 'vault',
  },
  account: {
    id: 'account',
    path: '/account',
    title: 'Account',
    icon: 'person',
    accent: 'account',
  },
  cart: { id: 'cart', path: '/cart', title: 'Cart' },
  shop: { id: 'shop', path: '/shop', title: 'Shop' },
} as const satisfies Record<SectionId, Section>;

/** The sections offered on the dashboard, in display order. */
export const DASHBOARD_SECTIONS = [
  SECTIONS.contact,
  SECTIONS.vault,
  SECTIONS.account,
] as const satisfies readonly Section[];

/**
 * Document URLs of the original multi-page site, mapped to their routes so
 * that old links and bookmarks keep working.
 */
export const LEGACY_REDIRECTS = [
  { from: '/index.html', to: DASHBOARD_PATH },
  { from: '/account.html', to: SECTIONS.account.path },
  { from: '/cart.html', to: SECTIONS.cart.path },
  { from: '/shop.html', to: SECTIONS.shop.path },
] as const;
