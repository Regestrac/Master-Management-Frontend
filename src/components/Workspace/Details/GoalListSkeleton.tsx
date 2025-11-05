import clsx from 'clsx';

import { useSettingsStore } from 'stores/settingsStore';

import Skeleton from 'components/Shared/Skeleton';

type GoalListSkeletonProps = {
  count?: number;
};

const GoalListSkeleton = ({ count = 8 }: GoalListSkeletonProps) => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  return (
    <div id='tab-panel-goals' role='tabpanel' aria-labelledby='tab-goals'>
      <div className='flex items-center gap-2 mb-3'>
        <h3 className='text-sm font-medium opacity-80'>All goals</h3>
        <Skeleton height={20} width={30} className='rounded' />
        <div className='flex items-center justify-end gap-2 flex-1'>
          <Skeleton height={28} width={60} className='rounded' />
        </div>
      </div>
      <ul className='space-y-3'>
        {Array.from({ length: count }).map((_, index) => (
          <li
            key={index}
            className={clsx(
              'group flex items-center gap-4 rounded-lg border px-4 py-3 shadow-sm',
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50',
            )}
          >
            <div className='flex items-center gap-3 min-w-0 flex-1'>
              {/* Status skeleton */}
              <div className='w-24 shrink-0'>
                <Skeleton height={24} width={80} className='rounded-xl' />
              </div>
              {/* Title skeleton */}
              <Skeleton height={20} width='65%' />
            </div>

            {/* Assignees skeleton */}
            <div className='flex items-center gap-2'>
              <div className='flex items-center -space-x-2'>
                <Skeleton height={32} width={32} radius={16} />
                <Skeleton height={32} width={32} radius={16} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoalListSkeleton;
