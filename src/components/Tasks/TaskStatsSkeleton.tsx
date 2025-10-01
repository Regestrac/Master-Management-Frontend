import clsx from 'clsx';

import { useSettingsStore } from 'stores/settingsStore';

import Skeleton from 'components/Shared/Skeleton';

const TaskStatsSkeleton = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div className='grid grid-cols-2 xl:grid-cols-7 lg:grid-cols-5 md:grid-cols-4 gap-4 mb-8'>
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
            'rounded-lg shadow-sm border',
          )}
        >
          <Skeleton height={126} className='rounded-lg' />
        </div>
      ))}
    </div>
  );
};

export default TaskStatsSkeleton;
