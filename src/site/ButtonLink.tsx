import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { classNames } from '../classNames.ts';
import { Icon } from '../components/Icon.tsx';
import ui from './ui.module.css';

interface ButtonLinkProps {
  readonly to: string;
  readonly children: ReactNode;
  readonly variant?: 'primary' | 'secondary' | undefined;
  readonly size?: 'medium' | 'small' | undefined;
  readonly withArrow?: boolean | undefined;
}

/**
 * A link styled as a button. The public site has no buttons that act on
 * anything: every call to action navigates somewhere.
 */
export function ButtonLink({
  to,
  children,
  variant = 'primary',
  size = 'medium',
  withArrow = false,
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      className={classNames(
        ui.button,
        variant === 'primary' ? ui.primary : ui.secondary,
        size === 'small' && ui.small,
      )}
    >
      {children}
      {withArrow ? <Icon name="arrow-forward" className={ui.arrow} /> : null}
    </Link>
  );
}
