import { Icon, type IconName } from '../../components/Icon.tsx';
import { SectionHeader } from '../SectionHeader.tsx';
import { StatusBadge } from '../StatusBadge.tsx';
import ui from '../ui.module.css';
import styles from './SecuritySection.module.css';

interface Step {
  readonly icon: IconName;
  readonly place: string;
  readonly title: string;
  readonly description: string;
}

/** How zero-knowledge encryption is meant to work, in three steps. */
const STEPS = [
  {
    icon: 'key',
    place: 'On your device',
    title: 'You unlock it',
    description:
      'Your master password unlocks Zavolt on your own device. It is never sent to Zavolt.',
  },
  {
    icon: 'lock-closed',
    place: 'Still on your device',
    title: 'Your vault is encrypted',
    description:
      'Everything in your vault is encrypted with a key that only your master password can produce, before any of it leaves.',
  },
  {
    icon: 'server',
    place: "On Zavolt's servers",
    title: 'Only ciphertext is stored',
    description:
      'The servers keep encrypted data they cannot read. Without your master password, nobody can turn it back into your passwords.',
  },
] as const satisfies readonly Step[];

/** The commitments the design is built around. */
const PRINCIPLES = [
  {
    title: 'Your master password stays with you',
    description: 'It is never sent or stored in any form that could be used to recover it.',
  },
  {
    title: 'Everything is encrypted, not just passwords',
    description: 'Names, usernames, notes and web addresses are meant to be encrypted too.',
  },
  {
    title: 'Signing in never unlocks your vault',
    description:
      'Proving who you are and decrypting your data use separate keys, so a sign-in alone reveals nothing.',
  },
  {
    title: 'Proven cryptography only',
    description:
      'Established, peer-reviewed algorithms, never homemade ones, and a design reviewed by specialists before it is built.',
  },
  {
    title: 'Recovery without a back door',
    description:
      'If account recovery is offered, it will never give Zavolt a way to decrypt your vault.',
  },
  {
    title: 'No trackers, no third-party code',
    description:
      'Zavolt is designed without advertising or tracking code. This website already loads none.',
  },
] as const;

/** Protections that exist today, on this website. */
const IN_PLACE = [
  'No third-party code: no analytics, no trackers, and no scripts or fonts loaded from other sites.',
  'A strict Content-Security-Policy that blocks injected scripts in modern browsers.',
  'Automated checks on every change, including a dependency vulnerability audit.',
] as const;

const NOT_BUILT = [
  'Accounts, sign-in and multi-factor authentication',
  'Encryption and the vault',
  'Sync, the browser extension and the desktop app',
  'Account recovery',
  'An independent security audit',
] as const;

export function SecuritySection() {
  return (
    <section id="security" aria-labelledby="security-title" className={ui.section}>
      <div className={ui.container}>
        <div className={styles.panel}>
          <SectionHeader
            headingId="security-title"
            eyebrow="Security"
            title="Designed so that only you can read your vault."
          >
            Zavolt is designed around a zero-knowledge architecture: your passwords are meant to be
            locked on your device, with a key that only your master password can produce, before
            anything is stored or synced.
          </SectionHeader>

          <p className={styles.notice}>
            <Icon name="information-circle" className={styles.noticeIcon} />
            <span>
              <strong>Zavolt is in development.</strong> The encryption described here has not been
              built yet, and nothing has been independently audited. These are the principles the
              product is being designed around.
            </span>
          </p>

          <div className={styles.block}>
            <div className={styles.blockHeader}>
              <h3 className={styles.blockTitle}>How it is designed to work</h3>
              <StatusBadge status="planned" />
            </div>
            <ol className={styles.steps}>
              {STEPS.map((step, index) => (
                <li key={step.title} className={styles.step}>
                  <div className={styles.stepTop}>
                    <span className={ui.iconTile}>
                      <Icon name={step.icon} />
                    </span>
                    <span className={styles.stepNumber} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className={styles.stepPlace}>{step.place}</p>
                  <h4 className={styles.stepTitle}>{step.title}</h4>
                  <p className={styles.stepText}>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>Design principles</h3>
            <ul className={styles.principles}>
              {PRINCIPLES.map((principle) => (
                <li key={principle.title} className={styles.principle}>
                  <h4 className={styles.principleTitle}>{principle.title}</h4>
                  <p className={styles.principleText}>{principle.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.block}>
            <h3 className={styles.blockTitle}>Where things stand</h3>
            <div className={styles.ledger}>
              <div className={styles.ledgerColumn}>
                <h4 className={styles.ledgerTitle}>
                  <Icon name="shield-checkmark" className={styles.ledgerIconDone} />
                  In place today
                </h4>
                <ul className={styles.ledgerList}>
                  {IN_PLACE.map((item) => (
                    <li key={item} className={styles.ledgerItem} data-state="done">
                      <Icon name="checkmark" className={styles.ledgerMark} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.ledgerColumn}>
                <h4 className={styles.ledgerTitle}>
                  <span className={styles.ledgerIconPlanned} aria-hidden="true" />
                  Not built yet
                </h4>
                <ul className={styles.ledgerList}>
                  {NOT_BUILT.map((item) => (
                    <li key={item} className={styles.ledgerItem} data-state="planned">
                      <span className={styles.ledgerHollow} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
