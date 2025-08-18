import { memo } from 'react';

import clsx from 'clsx';
import { Target } from 'lucide-react';

import { Goal } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';

import { StatusBadge } from 'components/Workspace/Details/StatusBadge';

type GoalListProps = {
  goals: Goal[];
}

export const GoalList = memo(({ goals }: GoalListProps) => {
  const darkMode = useProfileStore((s) => s.data.theme) === 'dark';
  if (goals.length === 0) {
    return (
      <p className='text-gray-400 dark:text-gray-600'>No goals yet.</p>
    );
  }

  return (
    <ul className='space-y-3'>
      {goals.map((goal) => (
        <li
          key={goal.id}
          className={clsx(
            'group flex items-center rounded-lg border px-4 py-3 shadow-sm hover:shadow transition',
            darkMode ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-gray-50 hover:bg-gray-100',
          )}
        >
          <div className='flex items-center gap-3 min-w-0 flex-1'>
            <div className='w-32 shrink-0'>
              <StatusBadge status={goal.status} variant='goal' />
            </div>
            <div className='flex items-center gap-3 min-w-0'>
              <div className='bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full w-7 h-7 flex items-center justify-center shrink-0'>
                <Target className='w-4 h-4' />
              </div>
              <span className='font-medium truncate'>{goal.title}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
});

GoalList.displayName = 'GoalList';
