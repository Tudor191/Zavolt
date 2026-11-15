import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App.tsx';
import { SPLASH_DURATION_MS } from './components/SplashGate.tsx';

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the loader first and then the dashboard at the root address', () => {
    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(SPLASH_DURATION_MS);
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument();
  });
});
