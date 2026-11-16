import { MessagePage } from '../components/MessagePage.tsx';
import { BACK_TO_DASHBOARD, BACK_TO_HOME, type Section } from '../sections.ts';

interface SectionPlaceholderPageProps {
  readonly section: Section;
}

/**
 * Stands in for a section that has no functionality yet, and says so plainly
 * instead of presenting controls that do nothing. It leads back to wherever the
 * section belongs: the dashboard for application sections, the homepage for
 * public ones.
 */
export function SectionPlaceholderPage({ section }: SectionPlaceholderPageProps) {
  return (
    <MessagePage
      title={section.title}
      message="This section is not available yet."
      icon={section.icon}
      accent={section.accent}
      back={section.area === 'application' ? BACK_TO_DASHBOARD : BACK_TO_HOME}
    />
  );
}
