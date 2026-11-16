import { Link } from 'react-router';
import { Icon } from '../components/Icon.tsx';
import { DASHBOARD_SECTIONS } from '../sections.ts';
import styles from './DashboardPage.module.css';

/**
 * The dashboard a signed-in user lands on.
 *
 * Authentication does not exist yet, so nothing here may assume that the
 * visitor has been identified. See docs/ARCHITECTURE.md.
 */
export function DashboardPage() {
  return (
    <main className={styles.page}>
      <title>Dashboard · Zavolt</title>
      <h1 className="visually-hidden" tabIndex={-1}>
        Dashboard
      </h1>
      <nav aria-label="Sections">
        <ul className={styles.menu}>
          {DASHBOARD_SECTIONS.map((section) => (
            <li key={section.id} data-accent={section.accent}>
              <Link className={styles.link} to={section.path}>
                <span className={styles.base} />
                <span className={styles.title}>{section.title}</span>
                <span className={styles.icon}>
                  <Icon name={section.icon} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
