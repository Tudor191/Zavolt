import { REGISTER_PATH } from '../../sections.ts';
import { ButtonLink } from '../ButtonLink.tsx';
import ui from '../ui.module.css';
import styles from './ClosingSection.module.css';

export function ClosingSection() {
  return (
    <section aria-labelledby="closing-title" className={styles.section}>
      <div className={ui.container}>
        <div className={styles.panel}>
          <div className={styles.ring} aria-hidden="true" />
          <h2 id="closing-title" className={styles.title} tabIndex={-1}>
            Take back control of your passwords.
          </h2>
          <p className={styles.text}>Zavolt is in development, and accounts are not open yet.</p>
          <div className={styles.actions}>
            <ButtonLink to={REGISTER_PATH} withArrow>
              Get started
            </ButtonLink>
            <ButtonLink to="/#security" variant="secondary">
              Explore security
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
