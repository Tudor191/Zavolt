import type { IconName } from './components/Icon.tsx';

/** Accent colours defined in `styles/global.css`. */
export type Accent = 'contact' | 'vault' | 'account';

/**
 * Which part of the product a page belongs to.
 *
 * - `site`: the public website. Pages have the site header and footer.
 * - `application`: the application. Pages keep the original full-screen look,
 *   and the loading screen plays the first time one is opened in a page load.
 *
 * Nothing is authenticated yet, so both areas are open to every visitor.
 */
export type Area = 'site' | 'application';

export type SectionId = 'contact' | 'vault' | 'account' | 'cart' | 'shop';

/** A part of the product that has its own route. */
export interface Section {
  readonly id: SectionId;
  readonly path: `/${string}`;
  /** Display name in sentence case; styling decides the letter case on screen. */
  readonly title: string;
  readonly area: Area;
  readonly icon?: IconName | undefined;
  readonly accent?: Accent | undefined;
}

export const HOME_PATH = '/';
export const DASHBOARD_PATH = '/app';
export const SIGN_IN_PATH = '/login';
export const REGISTER_PATH = '/register';
export const PRIVACY_PATH = '/privacy';
export const TERMS_PATH = '/terms';

/** The links placeholder pages offer back. */
export const BACK_TO_DASHBOARD = { to: DASHBOARD_PATH, label: 'Back to dashboard' } as const;
export const BACK_TO_HOME = { to: HOME_PATH, label: 'Back to home' } as const;

/**
 * Every section is currently a placeholder: none of them has functionality yet.
 *
 * Contact is public, because anyone may need to reach Zavolt. The others belong
 * to the application.
 *
 * `cart` and `shop` are routes inherited from the original static site. They
 * are not linked from anywhere and are kept only so that existing URLs keep
 * working until the product owner decides whether to remove them.
 */
export const SECTIONS = {
  contact: {
    id: 'contact',
    path: '/contact',
    title: 'Contact us',
    area: 'site',
    icon: 'call',
    accent: 'contact',
  },
  vault: {
    id: 'vault',
    path: '/vault',
    title: 'Vault',
    area: 'application',
    icon: 'lock-closed',
    accent: 'vault',
  },
  account: {
    id: 'account',
    path: '/account',
    title: 'Account',
    area: 'application',
    icon: 'person',
    accent: 'account',
  },
  cart: { id: 'cart', path: '/cart', title: 'Cart', area: 'application' },
  shop: { id: 'shop', path: '/shop', title: 'Shop', area: 'application' },
} as const satisfies Record<SectionId, Section>;

/** The sections offered on the dashboard, in display order. */
export const DASHBOARD_SECTIONS = [
  SECTIONS.contact,
  SECTIONS.vault,
  SECTIONS.account,
] as const satisfies readonly Section[];

/** A public page that says plainly that something does not exist yet. */
export interface SitePlaceholder {
  readonly path: `/${string}`;
  readonly title: string;
  readonly message: string;
  readonly icon: IconName;
}

/**
 * Sign-in, registration and the legal documents do not exist yet. Their pages
 * say so instead of showing forms or documents that would pretend otherwise.
 */
export const SITE_PLACEHOLDERS = [
  {
    path: SIGN_IN_PATH,
    title: 'Sign in',
    message: 'Signing in is not available yet. Zavolt is in development, and no accounts exist.',
    icon: 'log-in',
  },
  {
    path: REGISTER_PATH,
    title: 'Create an account',
    message:
      'Registration is not open yet. Zavolt is in development: no accounts can be created and no data is stored.',
    icon: 'person-add',
  },
  {
    path: PRIVACY_PATH,
    title: 'Privacy policy',
    message: 'The privacy policy has not been published yet.',
    icon: 'document-text',
  },
  {
    path: TERMS_PATH,
    title: 'Terms of service',
    message: 'The terms of service have not been published yet.',
    icon: 'document-text',
  },
] as const satisfies readonly SitePlaceholder[];

/**
 * Document URLs of the original multi-page site, mapped to the routes that
 * replaced them so that old links and bookmarks keep working. `index.html` was
 * the dashboard, which now lives at `/app`.
 */
export const LEGACY_REDIRECTS = [
  { from: '/index.html', to: DASHBOARD_PATH },
  { from: '/account.html', to: SECTIONS.account.path },
  { from: '/cart.html', to: SECTIONS.cart.path },
  { from: '/shop.html', to: SECTIONS.shop.path },
] as const;

const APPLICATION_PATHS: ReadonlySet<string> = new Set([
  DASHBOARD_PATH,
  ...Object.values(SECTIONS)
    .filter((section) => section.area === 'application')
    .map((section) => section.path),
]);

/**
 * Whether an address shows an application page. Matching follows the router:
 * letter case and a trailing slash are ignored.
 */
export function isApplicationPath(pathname: string): boolean {
  const normalized = pathname.toLowerCase().replace(/\/+$/, '');
  return APPLICATION_PATHS.has(normalized === '' ? '/' : normalized);
}
