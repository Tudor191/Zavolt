import { Outlet } from 'react-router';
import { SiteFooter } from './SiteFooter.tsx';
import { SiteHeader } from './SiteHeader.tsx';
import styles from './SiteLayout.module.css';

/**
 * The frame of every public page: a skip link, the header, the page, the
 * footer. Each page renders its own `<main id="main-content">`.
 */
export function SiteLayout() {
  return (
    <div className={styles.site}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </div>
  );
}
