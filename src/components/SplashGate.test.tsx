import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REDUCED_MOTION_QUERY, stubMatchMedia } from '../test/matchMedia.ts';
import { SplashGate } from './SplashGate.tsx';

function gate(active?: boolean) {
  return (
    <SplashGate active={active}>
      <p>Application content</p>
    </SplashGate>
  );
}

function renderGate(active?: boolean) {
  return render(gate(active));
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

  it('stays out of the way while inactive', () => {
    renderGate(false);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Application content')).toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('plays the first time it becomes active, then never again', () => {
    const { rerender } = renderGate(false);

    rerender(gate(true));
    expect(screen.getByRole('status')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('Application content')).toBeInTheDocument();

    rerender(gate(false));
    rerender(gate(true));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Application content')).toBeInTheDocument();
  });

  it('keeps the content mounted when it stops being active, so the page underneath survives', () => {
    stubMatchMedia([REDUCED_MOTION_QUERY]);
    const { rerender } = renderGate(true);
    const content = screen.getByText('Application content');

    rerender(gate(false));

    expect(screen.getByText('Application content')).toBe(content);
  });
});
