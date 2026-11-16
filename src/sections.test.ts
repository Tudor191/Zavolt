import { describe, expect, it } from 'vitest';
import { isApplicationPath } from './sections.ts';

describe('isApplicationPath', () => {
  it.each(['/app', '/vault', '/account', '/cart', '/shop'])(
    'treats %s as the application',
    (path) => {
      expect(isApplicationPath(path)).toBe(true);
    },
  );

  it.each(['/', '/contact', '/login', '/register', '/privacy', '/terms', '/index.html', '/nope'])(
    'treats %s as the public site',
    (path) => {
      expect(isApplicationPath(path)).toBe(false);
    },
  );

  it('ignores letter case and a trailing slash, as the router does', () => {
    expect(isApplicationPath('/APP/')).toBe(true);
    expect(isApplicationPath('/Vault')).toBe(true);
    expect(isApplicationPath('//')).toBe(false);
  });
});
