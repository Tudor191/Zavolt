import { classNames } from '../classNames.ts';
import styles from './Brand.module.css';

interface BrandMarkProps {
  readonly className?: string | undefined;
}

/**
 * The Zavolt mark: the dashboard's ring, with its gap and its dot, around a
 * Z. `public/favicon.svg` is the same drawing; keep the two in step.
 *
 * Colours are SVG presentation attributes, not inline styles, so the
 * Content-Security-Policy allows them.
 */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      width="32"
      height="32"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" rx="8" fill="#9e04d1" />
      <circle
        cx="16"
        cy="16"
        r="10"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="47.12 15.71"
        transform="rotate(-135 16 16)"
      />
      <circle cx="8.93" cy="8.93" r="2.4" fill="#fff" />
      <path fill="#fff" d="M12.1 11.4h7.8v2.2l-4.9 4.8h4.9v2.2h-7.8v-2.2l4.9-4.8h-4.9z" />
    </svg>
  );
}

interface WordmarkProps {
  readonly className?: string | undefined;
}

/** The mark followed by the name. */
export function Wordmark({ className }: WordmarkProps) {
  return (
    <span className={classNames(styles.wordmark, className)}>
      <BrandMark className={styles.mark} />
      <span>Zavolt</span>
    </span>
  );
}
