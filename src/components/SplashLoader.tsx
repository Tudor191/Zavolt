import { useId } from 'react';
import styles from './SplashLoader.module.css';

/**
 * The loader shown while the application starts: a key slides into a padlock,
 * turns, and the padlock opens.
 *
 * It is a picture, nothing more. Nothing is unlocked, checked or decrypted
 * while it plays, so the artwork is hidden from assistive technology, which is
 * only told that the application is loading, through the status role and the
 * visible text.
 *
 * The whole sequence is CSS, in the module next to this file. The drawing's
 * resting state is the open padlock, so it is what remains when animations are
 * turned off.
 */
export function SplashLoader() {
  // Everything left of the keyhole's centre is clipped from the key, so the
  // part of the key that has gone into the lock disappears.
  const keyholeClipId = useId();

  return (
    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- <output> is for the result of a calculation or user action, not for a loading state.
    <div className={styles.loader} role="status">
      <svg
        className={styles.art}
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 128 128"
        width="128"
        height="128"
      >
        <defs>
          <clipPath id={keyholeClipId}>
            <rect x="64" y="0" width="96" height="160" />
          </clipPath>
        </defs>
        <g className={styles.padlock} data-part="padlock">
          {/* The left leg is the longer one, so it stays in the body when the shackle rises. */}
          <path className={styles.shackle} data-part="shackle" d="M44 88V48a20 20 0 0 1 40 0v22" />
          <rect
            className={styles.body}
            data-part="body"
            x="28"
            y="64"
            width="72"
            height="50"
            rx="12"
          />
          <g className={styles.keyhole} data-part="keyhole">
            <circle cx="64" cy="84" r="6" />
            <path d="M61.75 87h4.5l1.6 10.4a1.4 1.4 0 0 1-1.4 1.6h-4.9a1.4 1.4 0 0 1-1.4-1.6z" />
          </g>
        </g>
        <g clipPath={`url(#${keyholeClipId})`}>
          {/* Drawn where it ends up inside the lock: its tip is 14.5 units past the keyhole's centre. */}
          <g className={styles.key} data-part="key">
            <g className={styles.keyTurn}>
              <path
                className={styles.keyBlade}
                d="M53 80.5h24v7H53a3.5 3.5 0 0 1 0-7zM54.5 87.5H59v5h-4.5zM60 87.5h3V91h-3z"
              />
              <circle className={styles.keyBow} cx="85" cy="84" r="8.5" />
            </g>
          </g>
        </g>
      </svg>
      <div className={styles.text}>
        <p className={styles.message}>Loading...</p>
      </div>
    </div>
  );
}
