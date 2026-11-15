import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { stubMatchMedia } from './matchMedia.ts';

beforeEach(() => {
  // By default no media query matches, i.e. the visitor has no motion preference.
  stubMatchMedia();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
