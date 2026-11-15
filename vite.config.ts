import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

const CSP_META_TAG = /[ \t]*<meta\s+http-equiv="Content-Security-Policy"[^>]*>\r?\n?/i;

/**
 * `index.html` ships a strict Content-Security-Policy so that the secure
 * policy is the source of truth and every production build carries it.
 *
 * The Vite dev server cannot run under that policy: hot module replacement
 * relies on an inline bootstrap script, injected `<style>` elements and a
 * WebSocket. This plugin therefore removes the policy from the page served by
 * the dev server only. `vite build` output, and therefore `vite preview` and
 * the end-to-end tests, keep the policy untouched.
 *
 * It fails loudly if the tag is missing, so the policy cannot be dropped from
 * `index.html` without someone noticing.
 */
function removeCspFromDevServer(): Plugin {
  return {
    name: 'zavolt:remove-csp-from-dev-server',
    apply: 'serve',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (!CSP_META_TAG.test(html)) {
          throw new Error(
            'index.html must declare a Content-Security-Policy <meta> tag. See docs/ARCHITECTURE.md.',
          );
        }
        return html.replace(CSP_META_TAG, '');
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), removeCspFromDevServer()],
  build: {
    // Never inline assets as data: URIs, so the CSP can forbid data: sources.
    assetsInlineLimit: 0,
    license: { fileName: 'THIRD-PARTY-LICENSES.md' },
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
    restoreMocks: true,
  },
});
