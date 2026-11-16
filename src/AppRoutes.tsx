import { useEffect, useRef } from 'react';
import {
  Navigate,
  NavigationType,
  Route,
  Routes,
  useLocation,
  useNavigationType,
} from 'react-router';
import { MessagePage } from './components/MessagePage.tsx';
import { SplashGate } from './components/SplashGate.tsx';
import { prefersReducedMotion } from './motion.ts';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { SectionPlaceholderPage } from './pages/SectionPlaceholderPage.tsx';
import {
  BACK_TO_HOME,
  DASHBOARD_PATH,
  HOME_PATH,
  LEGACY_REDIRECTS,
  SECTIONS,
  SITE_PLACEHOLDERS,
  isApplicationPath,
} from './sections.ts';
import { SiteLayout } from './site/SiteLayout.tsx';

/** Reads the element id from a location hash, or returns null if there is none. */
function targetIdFromHash(hash: string): string | null {
  if (hash.length <= 1) {
    return null;
  }
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    // A malformed escape sequence cannot name an element.
    return null;
  }
}

function focusWithoutScrolling(element: Element | null): void {
  if (element instanceof HTMLElement) {
    element.focus({ preventScroll: true });
  }
}

/**
 * Handles what a browser would do on a full page load, which client-side
 * routing otherwise skips:
 *
 * - A link to `#section` scrolls that section into view and moves focus to its
 *   heading, so the move is announced.
 * - A link to another page starts it at the top and moves focus to its main
 *   heading. Without this, focus stays on a link that no longer exists, and
 *   the change of page goes unannounced.
 * - Back and forward keep the browser's own scroll position.
 * - The first page shown keeps the browser's default focus.
 */
function useNavigationFocusAndScroll(): void {
  // A new location object is created for every navigation, including one to
  // the page that is already showing, so it is the effect's trigger.
  const location = useLocation();
  const navigationType = useNavigationType();
  const isInitialRender = useRef(true);

  useEffect(() => {
    const isInitial = isInitialRender.current;
    isInitialRender.current = false;

    const targetId = targetIdFromHash(location.hash);
    const target = targetId === null ? null : document.getElementById(targetId);
    if (target !== null) {
      target.scrollIntoView({
        behavior: isInitial || prefersReducedMotion() ? 'instant' : 'smooth',
        block: 'start',
      });
      focusWithoutScrolling(target.matches('[tabindex]') ? target : target.querySelector('h1, h2'));
      return;
    }
    if (isInitial) {
      return;
    }
    if (navigationType !== NavigationType.Pop) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    focusWithoutScrolling(document.querySelector('main h1'));
  }, [location, navigationType]);
}

/**
 * The route table. It must be rendered inside a router.
 *
 * Public pages share the site header and footer. Application pages keep the
 * original full-screen look, and the loading screen plays the first time one
 * is opened. None of them is authenticated: see SECURITY.md.
 */
export function AppRoutes() {
  const { pathname } = useLocation();
  useNavigationFocusAndScroll();

  return (
    <SplashGate active={isApplicationPath(pathname)}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path={HOME_PATH} element={<HomePage />} />
          <Route
            path={SECTIONS.contact.path}
            element={<SectionPlaceholderPage section={SECTIONS.contact} />}
          />
          {SITE_PLACEHOLDERS.map((page) => (
            <Route
              key={page.path}
              path={page.path}
              element={
                <MessagePage
                  title={page.title}
                  message={page.message}
                  icon={page.icon}
                  back={BACK_TO_HOME}
                />
              }
            />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path={DASHBOARD_PATH} element={<DashboardPage />} />
        {Object.values(SECTIONS)
          .filter((section) => section.area === 'application')
          .map((section) => (
            <Route
              key={section.id}
              path={section.path}
              element={<SectionPlaceholderPage section={section} />}
            />
          ))}

        {LEGACY_REDIRECTS.map(({ from, to }) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}
      </Routes>
    </SplashGate>
  );
}
