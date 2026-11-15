import { vi } from 'vitest';

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * jsdom does not implement `matchMedia`. This installs one that reports the
 * given media queries as matching, so a test can simulate user preferences.
 * The stub is removed again after each test (see `setup.ts`).
 */
export function stubMatchMedia(matchingQueries: readonly string[] = []): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: matchingQueries.includes(query),
    media: query,
  }));
}
