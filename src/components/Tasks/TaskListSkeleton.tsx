import clsx from 'clsx';

import { useProfileStore } from 'stores/profileStore';

import Skeleton from 'components/Shared/Skeleton';

const TaskListSkeleton = () => {
  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';

  return (
    <div className='space-y-4'>
      {Array.from({ length: 8 })?.map((_, index) => (
        <div
          key={index}
          className={clsx(
            'rounded-xl border shadow-sm',
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
          )}
        >
          <div className='py-4 px-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4 flex-1'>
                {/* Priority dot */}
                <Skeleton height={12} width={12} radius={9999} />

                <div className='flex-1'>
                  {/* Task title */}
                  <div className='flex items-center gap-3 mb-2'>
                    <Skeleton height={22} width='75%' />
                  </div>
                  {/* Task metadata row */}
                  <div className='flex flex-wrap items-center gap-4 text-sm'>
                    <Skeleton height={24} width={80} radius={9999} />
                    {/* Category */}
                    <Skeleton height={20} width={60} radius={4} />
                    {/* Time */}
                    <Skeleton height={16} width={80} />
                    {/* Due date */}
                    <Skeleton height={16} width={70} />
                    {/* Streak */}
                    <Skeleton height={16} width={90} />
                  </div>
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                {/* Play/Pause button */}
                <Skeleton height={48} width={48} radius={8} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskListSkeleton;
