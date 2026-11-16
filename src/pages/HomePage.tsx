import { AboutSection } from '../site/home/AboutSection.tsx';
import { ClosingSection } from '../site/home/ClosingSection.tsx';
import { Hero } from '../site/home/Hero.tsx';
import { PlatformsSection } from '../site/home/PlatformsSection.tsx';
import { ProductSection } from '../site/home/ProductSection.tsx';
import { SecuritySection } from '../site/home/SecuritySection.tsx';
import styles from './HomePage.module.css';

/**
 * The public homepage. It describes what Zavolt is being built to be, and
 * marks every feature with its status: nothing on it claims that a planned
 * feature exists.
 */
export function HomePage() {
  return (
    <main id="main-content" tabIndex={-1} className={styles.page}>
      <title>Zavolt · Your passwords. Your control.</title>
      <Hero />
      <ProductSection />
      <SecuritySection />
      <PlatformsSection />
      <AboutSection />
      <ClosingSection />
    </main>
  );
}
