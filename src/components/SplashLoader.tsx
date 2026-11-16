import styles from './SplashLoader.module.css';

const CART_BODY_POINTS = '4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80';

/**
 * The animated loader shown while the application starts.
 *
 * The artwork is decorative; assistive technology is told about the loading
 * state through the status role and the visible text.
 */
export function SplashLoader() {
  return (
    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- <output> is for the result of a calculation or user action, not for a loading state.
    <div className={styles.loader} role="status">
      <svg
        className={styles.cart}
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 128 128"
        width="128"
        height="128"
      >
        <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8">
          <g className={styles.cartTrack}>
            <polyline points={CART_BODY_POINTS} />
            <circle cx="43" cy="111" r="13" />
            <circle cx="102" cy="111" r="13" />
          </g>
          <g className={styles.cartLines}>
            <polyline
              className={styles.cartTop}
              points={CART_BODY_POINTS}
              strokeDasharray="338 338"
              strokeDashoffset="-338"
            />
            <g className={styles.cartWheel1} transform="rotate(-90,43,111)">
              <circle
                className={styles.cartWheelStroke}
                cx="43"
                cy="111"
                r="13"
                strokeDasharray="81.68 81.68"
                strokeDashoffset="81.68"
              />
            </g>
            <g className={styles.cartWheel2} transform="rotate(90,102,111)">
              <circle
                className={styles.cartWheelStroke}
                cx="102"
                cy="111"
                r="13"
                strokeDasharray="81.68 81.68"
                strokeDashoffset="81.68"
              />
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
