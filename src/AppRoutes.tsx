import { useEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { SectionPlaceholderPage } from './pages/SectionPlaceholderPage.tsx';
import { DASHBOARD_PATH, LEGACY_REDIRECTS, SECTIONS } from './sections.ts';

/**
 * Moves keyboard and screen-reader focus to the new page's heading after a
 * client-side navigation. Without this, focus stays on the link that was
 * activated, which no longer exists, and the change of page goes unannounced.
 */
function useFocusHeadingOnNavigation(): void {
  const { pathname } = useLocation();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }
    previousPathname.current = pathname;
    document.querySelector<HTMLElement>('main h1')?.focus();
  }, [pathname]);
}

/** The route table. It must be rendered inside a router. */
export function AppRoutes() {
  useFocusHeadingOnNavigation();

  return (
    <Routes>
      <Route path={DASHBOARD_PATH} element={<DashboardPage />} />
      {Object.values(SECTIONS).map((section) => (
        <Route
          key={section.id}
          path={section.path}
          element={<SectionPlaceholderPage section={section} />}
        />
      ))}
      {LEGACY_REDIRECTS.map(({ from, to }) => (
        <Route key={from} path={from} element={<Navigate to={to} replace />} />
      ))}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
