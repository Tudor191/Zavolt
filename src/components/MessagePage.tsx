import { Link } from 'react-router';
import type { Accent } from '../sections.ts';
import { Icon, type IconName } from './Icon.tsx';
import styles from './MessagePage.module.css';

/** Where the page's single link leads, and what it says. */
export interface BackLink {
  readonly to: string;
  readonly label: string;
}

interface MessagePageProps {
  readonly title: string;
  readonly message: string;
  readonly back: BackLink;
  readonly icon?: IconName | undefined;
  readonly accent?: Accent | undefined;
}

/** A full page that states one thing and offers one way back. */
export function MessagePage({ title, message, back, icon, accent }: MessagePageProps) {
  return (
    <main id="main-content" tabIndex={-1} className={styles.page} data-accent={accent}>
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
      <Link className={styles.back} to={back.to}>
        {back.label}
      </Link>
    </main>
  );
}
