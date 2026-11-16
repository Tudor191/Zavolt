import { MessagePage } from '../components/MessagePage.tsx';
import type { Section } from '../sections.ts';

interface SectionPlaceholderPageProps {
  readonly section: Section;
}

/**
 * Stands in for a section that has no functionality yet, and says so plainly
 * instead of presenting controls that do nothing.
 */
export function SectionPlaceholderPage({ section }: SectionPlaceholderPageProps) {
  return (
    <MessagePage
      title={section.title}
      message="This section is not available yet."
      icon={section.icon}
      accent={section.accent}
    />
  );
}
