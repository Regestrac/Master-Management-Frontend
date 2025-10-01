import clsx from 'clsx';

import { useSettingsStore } from 'stores/settingsStore';

import Skeleton from 'components/Shared/Skeleton';

const GoalStatsSkeleton = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8'>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
            'rounded-lg shadow-sm border',
          )}
        >
          <Skeleton height={142} className='rounded-lg' />
        </div>
      ))}
    </div>
  );
};

export default GoalStatsSkeleton;
