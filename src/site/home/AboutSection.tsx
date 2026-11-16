import { classNames } from '../../classNames.ts';
import { SectionHeader } from '../SectionHeader.tsx';
import { StatusBadge, type Status } from '../StatusBadge.tsx';
import ui from '../ui.module.css';
import styles from './AboutSection.module.css';

interface Milestone {
  readonly title: string;
  readonly description: string;
  readonly status: Status;
}

const ROADMAP = [
  {
    title: 'Foundation',
    description: 'A typed, tested web application with strict browser security.',
    status: 'done',
  },
  {
    title: 'Public website',
    description: 'The site you are reading now.',
    status: 'done',
  },
  {
    title: 'Security design review',
    description:
      'The complete encryption design, written down and reviewed by specialists before any of it is built.',
    status: 'planned',
  },
  {
    title: 'Accounts and the encrypted vault',
    description: 'Registration, sign-in and an encrypted vault in the web app.',
    status: 'planned',
  },
  {
    title: 'Sync across devices',
    description: 'The same vault on every device you choose.',
    status: 'planned',
  },
  {
    title: 'Browser extension and desktop app',
    description: 'Autofill in the browser, and a vault for desktop software and game launchers.',
    status: 'planned',
  },
  {
    title: 'Independent security audit',
    description: 'An external review of the finished product before any public release.',
    status: 'planned',
  },
] as const satisfies readonly Milestone[];

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className={ui.section}>
      <div className={classNames(ui.container, styles.layout)}>
        <div className={styles.intro}>
          <SectionHeader
            headingId="about-title"
            eyebrow="About"
            title="Security first. Then everything else."
          >
            Zavolt is a password manager in early development. The goal is easy to state and hard to
            build: a vault that keeps your passwords close at hand, and that nobody else can open.
          </SectionHeader>
          <p className={styles.text}>
            That is why it is being built in a deliberate order, with the encryption design reviewed
            before any of it is written. This is where things stand today.
          </p>
        </div>
        <div className={styles.roadmap}>
          <h3 className={styles.roadmapTitle}>Roadmap</h3>
          <ol className={styles.milestones}>
            {ROADMAP.map((milestone) => (
              <li key={milestone.title} className={styles.milestone} data-status={milestone.status}>
                <div className={styles.milestoneHeader}>
                  <h4 className={styles.milestoneTitle}>{milestone.title}</h4>
                  <StatusBadge status={milestone.status} />
                </div>
                <p className={styles.milestoneText}>{milestone.description}</p>
              </li>
            ))}
          </ol>
          <p className={styles.footnote}>
            The order may change as the work progresses. There are no release dates yet.
          </p>
        </div>
      </div>
    </section>
  );
}
