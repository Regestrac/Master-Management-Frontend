import clsx from 'clsx';
import { Target } from 'lucide-react';

import { Goal } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';

import { StatusBadge } from 'components/Workspace/Details/StatusBadge';

import { CreateForm } from './CreateForm';

type GoalListProps = {
  goals: Goal[];
  onGoalAdd: (_title: string) => void;
};

const GoalList = ({ goals, onGoalAdd }: GoalListProps) => {
  const darkMode = useProfileStore((s) => s.data.theme) === 'dark';

  if (goals.length === 0) {
    return (
      <p className='text-gray-400 dark:text-gray-600'>No goals yet.</p>
    );
  }

  return (
    <div id='tab-panel-goals' role='tabpanel' aria-labelledby='tab-goals'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-sm font-medium opacity-80'>All goals</h3>
        <div className='flex items-center gap-2'>
          <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
            {goals.length}
          </span>
          <CreateForm
            type='goal'
            onSubmit={onGoalAdd}
            placeholder='Goal title'
          />
        </div>
      </div>
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
    </div>
  );
};

export default GoalList;
