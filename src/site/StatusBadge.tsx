import styles from './StatusBadge.module.css';

/**
 * How far along something is. Every feature and platform on the public site
 * carries one, so that nothing planned can be mistaken for something that
 * exists.
 */
export type Status = 'done' | 'in-development' | 'planned';

const STATUS_LABELS = {
  done: 'Done',
  'in-development': 'In development',
  planned: 'Planned',
} as const satisfies Record<Status, string>;

interface StatusBadgeProps {
  readonly status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={styles.badge} data-status={status}>
      <span className="visually-hidden">Status: </span>
      {STATUS_LABELS[status]}
    </span>
  );
}
