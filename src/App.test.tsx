import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App.tsx';
import { SPLASH_DURATION_MS } from './components/SplashGate.tsx';

function openAt(path: string) {
  window.history.replaceState(null, '', path);
  return render(<App />);
}

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    window.history.replaceState(null, '', '/');
  });

  it('shows the public homepage at the root address at once', () => {
    openAt('/');

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Your passwords. Your control.' }),
    ).toBeInTheDocument();
  });

  it('shows the loader first and then the dashboard at /app', () => {
    openAt('/app');

    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
    expect(screen.queryByRole('navigation', { name: 'Sections' })).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(SPLASH_DURATION_MS);
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument();
  });
});
