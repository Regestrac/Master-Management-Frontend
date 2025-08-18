import { memo } from 'react';

import clsx from 'clsx';

interface StatusBadgeProps {
  status: string;
  variant?: 'task' | 'goal';
  className?: string;
}

export const StatusBadge = memo(({ status, variant = 'task', className = '' }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    if (variant === 'task') {
      switch (status) {
        case 'Done':
          return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
        case 'In Progress':
          return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
        default:
          return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
      }
    } else {
      switch (status) {
        case 'Achieved':
          return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
        case 'In Progress':
          return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
        default:
          return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
      }
    }
  };

  return (
    <span
      className={clsx(
        'inline-block max-w-full truncate text-xs px-2 py-1 rounded transition',
        getStatusStyles(),
        className,
      )}
    >
      {status}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';
