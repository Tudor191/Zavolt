import { classNames } from '../../classNames.ts';
import { Icon, type IconName } from '../../components/Icon.tsx';
import { SectionHeader } from '../SectionHeader.tsx';
import { StatusBadge, type Status } from '../StatusBadge.tsx';
import ui from '../ui.module.css';
import styles from './ProductSection.module.css';

interface Feature {
  readonly icon: IconName;
  readonly title: string;
  readonly description: string;
  readonly status: Status;
}

/** What Zavolt is being built to do. None of it exists yet. */
const FEATURES = [
  {
    icon: 'key',
    title: 'Every credential in one vault',
    description:
      'Usernames, passwords and notes for the websites, apps and game launchers you use, kept together in one encrypted vault.',
    status: 'planned',
  },
  {
    icon: 'folder-open',
    title: 'Organized your way',
    description: 'Group your accounts into folders and find any sign-in in a few keystrokes.',
    status: 'planned',
  },
  {
    icon: 'sync',
    title: 'On all your devices',
    description:
      'The same vault on every device you choose, encrypted on each one before anything is synced.',
    status: 'planned',
  },
  {
    icon: 'extension-puzzle',
    title: 'Autofill in your browser',
    description:
      'A browser extension that recognizes sign-in pages, fills in your details when you ask, and offers to save new accounts.',
    status: 'planned',
  },
  {
    icon: 'game-controller',
    title: 'Desktop apps and game launchers',
    description:
      'A desktop app for the sign-ins you use outside the browser, from everyday software to game launchers.',
    status: 'planned',
  },
] as const satisfies readonly Feature[];

const CREDENTIAL_KINDS = ['Websites', 'Apps', 'Game launchers', 'Online services'] as const;

export function ProductSection() {
  return (
    <section id="product" aria-labelledby="product-title" className={ui.section}>
      <div className={ui.container}>
        <SectionHeader
          headingId="product-title"
          eyebrow="Product"
          title={
            <>
              Every <span className={styles.nowrap}>sign-in,</span> in one place.
            </>
          }
        >
          Zavolt is being built to keep the passwords for everything you use organized, protected
          and close at hand. Everything on this page is planned; none of it is available yet.
        </SectionHeader>
        <ul className={styles.grid}>
          {FEATURES.map((feature, index) => (
            <li
              key={feature.title}
              className={classNames(ui.card, styles.feature, index === 0 && styles.wide)}
            >
              <div className={styles.featureTop}>
                <span className={ui.iconTile}>
                  <Icon name={feature.icon} />
                </span>
                <StatusBadge status={feature.status} />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureText}>{feature.description}</p>
              {index === 0 ? (
                <ul className={styles.kinds} aria-label="Kinds of sign-in">
                  {CREDENTIAL_KINDS.map((kind) => (
                    <li key={kind} className={styles.kind}>
                      {kind}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
