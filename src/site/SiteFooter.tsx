import { Link } from 'react-router';
import { classNames } from '../classNames.ts';
import { HOME_PATH, PRIVACY_PATH, SECTIONS, TERMS_PATH } from '../sections.ts';
import { Wordmark } from './Brand.tsx';
import styles from './SiteFooter.module.css';
import ui from './ui.module.css';

const FOOTER_GROUPS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/#product' },
      { label: 'Platforms', to: '/#platforms' },
      { label: 'Security', to: '/#security' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/#about' },
      { label: 'Contact', to: SECTIONS.contact.path },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy policy', to: PRIVACY_PATH },
      { label: 'Terms of service', to: TERMS_PATH },
    ],
  },
] as const;

// Read once when the page loads: rendering must not depend on the clock.
const CURRENT_YEAR = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={classNames(ui.container, styles.top)}>
        <div className={styles.about}>
          <Link to={HOME_PATH} className={styles.brand} aria-label="Zavolt home">
            <Wordmark />
          </Link>
          <p className={styles.tagline}>
            A password manager in development, designed around zero-knowledge encryption.
          </p>
          <p className={styles.status}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span>
              <strong>In development.</strong> Zavolt is not available yet: no accounts can be
              created and no data is stored.
            </span>
          </p>
        </div>
        <nav aria-label="Footer" className={styles.groups}>
          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className={styles.groupTitle}>{group.title}</h2>
              <ul className={styles.list}>
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className={classNames(ui.container, styles.bottom)}>
        <p>© {CURRENT_YEAR} Zavolt</p>
        <p>This site loads no trackers and no third-party scripts.</p>
      </div>
    </footer>
  );
}
