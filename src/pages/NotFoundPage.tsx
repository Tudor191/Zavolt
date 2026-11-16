import { MessagePage } from '../components/MessagePage.tsx';
import { BACK_TO_HOME } from '../sections.ts';

export function NotFoundPage() {
  return (
    <MessagePage
      title="Page not found"
      message="There is nothing at this address."
      back={BACK_TO_HOME}
    />
  );
}
