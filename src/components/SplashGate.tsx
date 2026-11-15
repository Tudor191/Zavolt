import { useEffect, useState, type ReactNode } from 'react';
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

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface SplashGateProps {
  readonly children: ReactNode;
  readonly durationMs?: number | undefined;
}

/**
 * Shows the loader once per page load, then reveals its children.
 *
 * Visitors who ask for reduced motion skip the wait, because for them it
 * would be a static screen with no purpose.
 */
export function SplashGate({ children, durationMs = SPLASH_DURATION_MS }: SplashGateProps) {
  const [isRevealed, setIsRevealed] = useState(() => durationMs <= 0 || prefersReducedMotion());

  useEffect(() => {
    if (isRevealed) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      setIsRevealed(true);
    }, durationMs);
    return () => {
      window.clearTimeout(timer);
    };
  }, [isRevealed, durationMs]);

  if (!isRevealed) {
    // The loading screen is a page of its own to assistive technology, so it
    // gets the landmark and heading every other page has.
    return (
      <main className={styles.splash}>
        <h1 className="visually-hidden">Zavolt</h1>
        <SplashLoader />
      </main>
    );
  }
  return <div className={styles.reveal}>{children}</div>;
}
