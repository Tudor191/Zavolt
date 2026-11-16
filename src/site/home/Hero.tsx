import { classNames } from '../../classNames.ts';
import { REGISTER_PATH } from '../../sections.ts';
import { ButtonLink } from '../ButtonLink.tsx';
import ui from '../ui.module.css';
import styles from './Hero.module.css';
import { OrbitVisual } from './OrbitVisual.tsx';

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={classNames(ui.container, styles.layout)}>
        <div className={styles.copy}>
          <p className={styles.status}>
            <span className={styles.statusDot} aria-hidden="true" />
            In development · Not yet available
          </p>
          <h1 id="hero-title" className={styles.title} tabIndex={-1}>
            <span className={styles.line}>Your passwords.</span>{' '}
            <span className={classNames(styles.line, styles.accent)}>Your control.</span>
          </h1>
          <p className={styles.lead}>
            Zavolt is a password manager in early development, designed to keep your passwords
            organized and protected across all your devices, in a vault that only you can open.
          </p>
          <div className={styles.actions}>
            <ButtonLink to={REGISTER_PATH} withArrow>
              Get started
            </ButtonLink>
            <ButtonLink to="/#security" variant="secondary">
              Explore security
            </ButtonLink>
          </div>
          <p className={styles.note}>Accounts are not open yet.</p>
        </div>
        <div className={styles.visual}>
          <OrbitVisual />
        </div>
      </div>
    </section>
  );
}
