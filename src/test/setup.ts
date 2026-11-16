import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { stubMatchMedia } from './matchMedia.ts';

beforeEach(() => {
  // By default no media query matches, i.e. the visitor has no motion preference.
  stubMatchMedia();
  // jsdom does not lay pages out, so it has no scrolling: `scrollIntoView` is
  // missing and `scrollTo` only reports that it is not implemented.
  Element.prototype.scrollIntoView = vi.fn<(options?: boolean | ScrollIntoViewOptions) => void>();
  vi.stubGlobal('scrollTo', vi.fn<(options?: ScrollToOptions) => void>());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
