import { classNames } from '../../classNames.ts';
import { BrandMark } from '../Brand.tsx';
import styles from './OrbitVisual.module.css';

/**
 * The hero illustration: the dashboard's three neon rings, in its three
 * colours, orbiting the Zavolt mark. It is decoration, so it is hidden from
 * assistive technology, and it stands still for visitors who ask for reduced
 * motion.
 */
export function OrbitVisual() {
  return (
    <div className={styles.orbit} aria-hidden="true">
      <div className={styles.halo} />
      <div className={classNames(styles.ring, styles.outer)} data-accent="contact" />
      <div className={classNames(styles.ring, styles.middle)} data-accent="vault" />
      <div className={classNames(styles.ring, styles.inner)} data-accent="account" />
      <BrandMark className={styles.core} />
    </div>
  );
}
