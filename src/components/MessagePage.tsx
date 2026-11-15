import { Link } from 'react-router';
import { DASHBOARD_PATH, type Accent } from '../sections.ts';
import { Icon, type IconName } from './Icon.tsx';
import styles from './MessagePage.module.css';

interface MessagePageProps {
  readonly title: string;
  readonly message: string;
  readonly icon?: IconName | undefined;
  readonly accent?: Accent | undefined;
}

/** A full page that states one thing and links back to the dashboard. */
export function MessagePage({ title, message, icon, accent }: MessagePageProps) {
  return (
    <main className={styles.page} data-accent={accent}>
      <title>{`${title} · Zavolt`}</title>
      {icon === undefined ? null : (
        <span className={styles.icon}>
          <Icon name={icon} />
        </span>
      )}
      <h1 className={styles.title} tabIndex={-1}>
        {title}
      </h1>
      <p className={styles.message}>{message}</p>
      <Link className={styles.back} to={DASHBOARD_PATH}>
        Back to dashboard
      </Link>
    </main>
  );
}
