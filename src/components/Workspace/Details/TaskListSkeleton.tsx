import Skeleton from 'components/Shared/Skeleton';

type TaskListSkeletonProps = {
  count?: number;
};

const TaskListSkeleton = ({ count = 8 }: TaskListSkeletonProps) => {
  return (
    <div id='tab-panel-tasks' role='tabpanel' aria-labelledby='tab-tasks'>
      <div className='flex items-center gap-2 mb-3'>
        <h3 className='text-sm font-medium opacity-80'>All tasks</h3>
        <Skeleton height={20} width={30} className='rounded' />
        <div className='flex items-center justify-end gap-2 flex-1'>
          <Skeleton height={28} width={60} className='rounded' />
        </div>
      </div>
      <ul className='space-y-3'>
        {Array.from({ length: count }).map((_, index) => (
          <li
            key={index}
            className='group flex items-center gap-4 rounded-lg border px-4 py-3 shadow-sm border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
          >
            <div className='flex items-center gap-3 min-w-0 flex-1'>
              {/* Status skeleton */}
              <div className='w-24 shrink-0 flex items-center h-full'>
                <Skeleton height={24} width={80} className='rounded-xl' />
              </div>
              {/* Title skeleton */}
              <Skeleton height={20} width='60%' />
            </div>

            {/* Assignees skeleton */}
            <div className='flex items-center gap-2'>
              <div className='flex items-center -space-x-2'>
                <Skeleton height={32} width={32} radius={16} />
                <Skeleton height={32} width={32} radius={16} />
              </div>
            </div>

            {/* Due date skeleton */}
            <Skeleton height={16} width={50} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskListSkeleton;
