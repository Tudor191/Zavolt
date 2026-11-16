import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REDUCED_MOTION_QUERY, stubMatchMedia } from '../test/matchMedia.ts';
import { SplashGate } from './SplashGate.tsx';

function renderGate() {
  return render(
    <SplashGate>
      <p>Application content</p>
    </SplashGate>,
  );
}

describe('SplashGate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('announces a loading state and hides the application at first', () => {
    renderGate();

    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
    expect(screen.queryByText('Application content')).not.toBeInTheDocument();
  });

  it('gives the loading screen a main landmark and a heading', () => {
    renderGate();

    const main = screen.getByRole('main');
    expect(main).toContainElement(screen.getByRole('status'));
    expect(main).toContainElement(screen.getByRole('heading', { level: 1, name: 'Zavolt' }));
  });

  it('keeps the loader for three seconds, as the original site did, then reveals the application', () => {
    renderGate();

    // Literal on purpose: this pins the timing carried over from the original site.
    act(() => {
      vi.advanceTimersByTime(2999);
    });
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Application content')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Application content')).toBeInTheDocument();
  });

  it('skips the wait for visitors who ask for reduced motion', () => {
    stubMatchMedia([REDUCED_MOTION_QUERY]);

    renderGate();

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Application content')).toBeInTheDocument();
  });

  it('cancels its timer when it is removed before the splash ends', () => {
    const { unmount } = renderGate();
    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
