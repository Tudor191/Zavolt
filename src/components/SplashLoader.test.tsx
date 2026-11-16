import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SplashLoader } from './SplashLoader.tsx';

/** The loader's drawing, inside the given status element. */
function artworkIn(status: HTMLElement): SVGSVGElement {
  const svg = status.querySelector('svg');
  if (svg === null) {
    throw new Error('The loader has no artwork.');
  }
  return svg;
}

function part(svg: SVGSVGElement, name: string): SVGElement {
  const element = svg.querySelector<SVGElement>(`[data-part="${name}"]`);
  if (element === null) {
    throw new Error(`The artwork has no ${name}.`);
  }
  return element;
}

/** The `<clipPath>` that the group holding the key refers to. */
function keyClipPath(svg: SVGSVGElement): HTMLElement | null {
  const reference = part(svg, 'key').parentElement?.getAttribute('clip-path') ?? '';
  const id = /^url\(#(.+)\)$/.exec(reference)?.[1];
  return id === undefined ? null : document.getElementById(id);
}

describe('SplashLoader', () => {
  it('tells assistive technology only that the application is loading', () => {
    render(<SplashLoader />);

    const status = screen.getByRole('status');
    // Nothing about unlocking: the drawing is a picture, not an operation.
    expect(status).toHaveTextContent(/^Loading\.\.\.$/);

    const svg = artworkIn(status);
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg.querySelector('title, desc, text')).toBeNull();
  });

  it('draws a padlock and a key, not the shopping cart of the original template', () => {
    render(<SplashLoader />);

    const svg = artworkIn(screen.getByRole('status'));
    expect(
      Array.from(
        svg.querySelectorAll<SVGElement>('[data-part]'),
        (element) => element.dataset['part'],
      ),
    ).toEqual(['padlock', 'shackle', 'body', 'keyhole', 'key']);

    const padlock = part(svg, 'padlock');
    for (const name of ['shackle', 'body', 'keyhole']) {
      expect(padlock).toContainElement(part(svg, name));
    }
    expect(padlock).not.toContainElement(part(svg, 'key'));

    // The cart was drawn as an outline with two wheels.
    expect(svg.querySelector('polyline')).toBeNull();
  });

  it('hides whatever part of the key has gone into the keyhole', () => {
    render(<SplashLoader />);

    const svg = artworkIn(screen.getByRole('status'));
    const clipPath = keyClipPath(svg);
    expect(clipPath?.tagName).toBe('clipPath');
    expect(svg).toContainElement(clipPath);

    // The clip keeps only what lies right of the keyhole's centre.
    const keyholeCentre = part(svg, 'keyhole').querySelector('circle')?.getAttribute('cx');
    expect(clipPath?.querySelector('rect')?.getAttribute('x')).toBe(keyholeCentre);
  });

  it('gives every loader a clip path of its own', () => {
    render(
      <>
        <SplashLoader />
        <SplashLoader />
      </>,
    );

    const clipPaths = screen.getAllByRole('status').map((status) => keyClipPath(artworkIn(status)));
    expect(clipPaths).toHaveLength(2);
    expect(clipPaths).not.toContain(null);
    expect(new Set(clipPaths).size).toBe(2);
  });
});
