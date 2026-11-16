import { BrowserRouter } from 'react-router';
import { AppRoutes } from './AppRoutes.tsx';

/**
 * Application root.
 *
 * Routing is client-side so that state held only in memory survives moving
 * between pages. That matters once the vault exists: an unlocked key must
 * never be written to browser storage just to outlive a page load.
 */
export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
