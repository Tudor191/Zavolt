import type { ReactNode } from 'react';
import { classNames } from '../classNames.ts';
import ui from './ui.module.css';

interface SectionHeaderProps {
  /** The heading's id, which the section names itself after with `aria-labelledby`. */
  readonly headingId: string;
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly children?: ReactNode;
  readonly centered?: boolean | undefined;
}

/**
 * The eyebrow, heading and introduction that open a homepage section. The
 * heading can receive focus, so that following an in-page link announces it.
 */
export function SectionHeader({
  headingId,
  eyebrow,
  title,
  children,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div className={classNames(ui.sectionHeader, centered && ui.centered)}>
      <p className={ui.eyebrow}>{eyebrow}</p>
      <h2 id={headingId} className={ui.sectionTitle} tabIndex={-1}>
        {title}
      </h2>
      {children === undefined ? null : <p className={ui.lead}>{children}</p>}
    </div>
  );
}
