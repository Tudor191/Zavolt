import { useEffect, useState, type ReactNode } from 'react';
import { classNames } from '../classNames.ts';
import { prefersReducedMotion } from '../motion.ts';
import styles from './SplashGate.module.css';
import { SplashLoader } from './SplashLoader.tsx';

/**
 * How long the loader stays on screen before the application is revealed.
 *
 * This is the delay the original site used. It is purely presentational:
 * nothing is being loaded during it. Once startup does real work (session
 * restore, key derivation, vault decryption), the gate should wait for that
 * work instead of for a timer.
 */
export const SPLASH_DURATION_MS = 3000;

interface SplashGateProps {
  readonly children: ReactNode;
  /**
   * Whether the current page is one the loading screen belongs to. The public
   * website passes `false`, so its pages appear at once.
   */
  readonly active?: boolean | undefined;
  readonly durationMs?: number | undefined;
}

/**
 * Shows the loader before its children, at most once per page load.
 *
 * Render it above the routes: it then lives as long as the page does, so
 * moving between pages never plays the loader a second time. While `active`
 * is false it stays out of the way, and it plays the first time `active`
 * becomes true.
 *
 * Visitors who ask for reduced motion skip the wait, because for them it
 * would be a static screen with no purpose.
 */
export function SplashGate({
  children,
  active = true,
  durationMs = SPLASH_DURATION_MS,
}: SplashGateProps) {
  const [hasPlayed, setHasPlayed] = useState(() => durationMs <= 0 || prefersReducedMotion());
  const isShowing = active && !hasPlayed;

  useEffect(() => {
    if (!isShowing) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      setHasPlayed(true);
    }, durationMs);
    return () => {
      window.clearTimeout(timer);
    };
  }, [isShowing, durationMs]);

  if (isShowing) {
    // The loading screen is a page of its own to assistive technology, so it
    // gets the landmark and heading every other page has.
    return (
      <main className={styles.splash}>
        <h1 className="visually-hidden">Zavolt</h1>
        <SplashLoader />
      </main>
    );
  }
  // The same element wraps the content whether or not the loader has played,
  // so that switching between the two never remounts the page underneath.
  return <div className={classNames(styles.content, hasPlayed && styles.revealed)}>{children}</div>;
}
