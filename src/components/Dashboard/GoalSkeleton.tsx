import clsx from 'clsx';

import { useSettingsStore } from 'stores/settingsStore';

import Skeleton from 'components/Shared/Skeleton';

const GoalSkeleton = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div
      className={clsx(
        'rounded-xl p-6 border shadow-sm',
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
      )}
    >
      <div className='mb-4'>
        {/* Goal title */}
        <Skeleton height={20} width='75%' className='mb-2' />

        {/* Progress percentage and streak */}
        <div className='flex items-center justify-between text-sm mb-2'>
          <Skeleton height={16} width={80} />
          <Skeleton height={16} width={64} />
        </div>

        {/* Progress bar */}
        <div className={clsx('w-full rounded-full h-2', darkMode ? 'bg-gray-700' : 'bg-gray-200')}>
          <Skeleton height={8} width='50%' radius={9999} />
        </div>
      </div>

      {/* Time and continue button */}
      <div className='flex items-center justify-between text-sm'>
        <Skeleton height={16} width={96} />
        <Skeleton height={16} width={64} />
      </div>
    </div>
  );
};

export default GoalSkeleton;
