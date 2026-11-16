import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { classNames } from '../classNames.ts';
import { Icon } from '../components/Icon.tsx';
import { HOME_PATH, REGISTER_PATH, SIGN_IN_PATH } from '../sections.ts';
import { Wordmark } from './Brand.tsx';
import { ButtonLink } from './ButtonLink.tsx';
import styles from './SiteHeader.module.css';
import ui from './ui.module.css';

/** Sections of the homepage that the main navigation links to. */
const MAIN_NAVIGATION = [
  { label: 'Product', to: '/#product' },
  { label: 'Security', to: '/#security' },
  { label: 'About', to: '/#about' },
] as const;

/**
 * The public site's header. On narrow screens the navigation collapses behind
 * a menu button (a disclosure): the button says whether the menu is open, and
 * Escape, a click elsewhere or following any link closes it again.
 */
export function SiteHeader() {
  const location = useLocation();
  // The menu belongs to the page it was opened on: it is open only while the
  // location it was opened at is still the current one, so any navigation,
  // including to a section of the same page, closes it.
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null);
  const isMenuOpen = menuOpenedAt === location.key;
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpenedAt(null);
        menuButtonRef.current?.focus();
      }
    }
    function closeOnOutsidePointer(event: PointerEvent) {
      if (event.target instanceof Node && headerRef.current?.contains(event.target) !== true) {
        setMenuOpenedAt(null);
      }
    }
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
    };
  }, [isMenuOpen]);

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={classNames(ui.container, styles.bar)}>
        <Link to={HOME_PATH} className={styles.brand} aria-label="Zavolt home">
          <Wordmark />
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={isMenuOpen}
          aria-controls="site-navigation"
          onClick={() => {
            setMenuOpenedAt(isMenuOpen ? null : location.key);
          }}
        >
          <Icon name={isMenuOpen ? 'close' : 'menu'} />
          <span className="visually-hidden">Menu</span>
        </button>
        <nav id="site-navigation" aria-label="Main" className={styles.nav} data-open={isMenuOpen}>
          <ul className={styles.links}>
            {MAIN_NAVIGATION.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.actions}>
            <Link to={SIGN_IN_PATH} className={styles.signIn}>
              Sign in
            </Link>
            <ButtonLink to={REGISTER_PATH} size="small">
              Get started
            </ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
