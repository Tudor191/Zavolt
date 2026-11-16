import { classNames } from '../../classNames.ts';
import { Icon, type IconName } from '../../components/Icon.tsx';
import { SectionHeader } from '../SectionHeader.tsx';
import { StatusBadge, type Status } from '../StatusBadge.tsx';
import ui from '../ui.module.css';
import styles from './PlatformsSection.module.css';

interface Platform {
  readonly icon: IconName;
  readonly name: string;
  readonly shortName: string;
  readonly status: Status;
  readonly description: string;
}

const PLATFORMS = [
  {
    icon: 'browsers',
    name: 'Web app',
    shortName: 'Web',
    status: 'in-development',
    description:
      'Your vault, your account and your security settings in any modern browser. It is the first part being built.',
  },
  {
    icon: 'desktop',
    name: 'Desktop app',
    shortName: 'Desktop',
    status: 'planned',
    description:
      'A vault on your computer for the sign-ins that desktop software and game launchers ask for.',
  },
  {
    icon: 'extension-puzzle',
    name: 'Browser extension',
    shortName: 'Extension',
    status: 'planned',
    description:
      'Suggests your saved sign-ins on the pages that need them, fills them in when you ask, and offers to save new ones.',
  },
] as const satisfies readonly Platform[];

export function PlatformsSection() {
  return (
    <section id="platforms" aria-labelledby="platforms-title" className={ui.section}>
      <div className={ui.container}>
        <SectionHeader
          headingId="platforms-title"
          eyebrow="Platforms"
          title="One vault, wherever you sign in."
        >
          Zavolt is planned as three apps that share one encrypted vault. None of them can be
          downloaded or used yet.
        </SectionHeader>

        <ul className={styles.platforms}>
          {PLATFORMS.map((platform) => (
            <li key={platform.name} className={classNames(ui.card, styles.platform)}>
              <div className={styles.platformTop}>
                <span className={ui.iconTile}>
                  <Icon name={platform.icon} />
                </span>
                <StatusBadge status={platform.status} />
              </div>
              <h3 className={styles.platformName}>{platform.name}</h3>
              <p className={styles.platformText}>{platform.description}</p>
            </li>
          ))}
        </ul>

        <div className={classNames(ui.card, styles.together)}>
          <div className={styles.togetherCopy}>
            <div className={styles.togetherHeader}>
              <h3 className={styles.togetherTitle}>How they will fit together</h3>
              <StatusBadge status="planned" />
            </div>
            <p className={styles.togetherText}>
              Save a sign-in in one app and it will be ready in the others. Each app encrypts your
              vault on your device before it syncs, so the copy that travels between them stays
              unreadable on the way.
            </p>
          </div>
          <div className={styles.diagram} aria-hidden="true">
            <div className={styles.nodes}>
              {PLATFORMS.map((platform) => (
                <span key={platform.name} className={styles.node}>
                  <Icon name={platform.icon} />
                  {platform.shortName}
                </span>
              ))}
            </div>
            <div className={styles.bus} />
            <span className={styles.vault}>
              <Icon name="lock-closed" />
              Your encrypted vault
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
