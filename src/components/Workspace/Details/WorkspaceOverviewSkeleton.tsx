import { useSettingsStore } from 'stores/settingsStore';

import Skeleton from 'components/Shared/Skeleton';

const WorkspaceOverviewSkeleton = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <section className={`rounded-xl border p-6 ${darkMode ? 'border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900' : 'border-gray-200 bg-gradient-to-b from-white to-gray-50'}`}>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
        <div className='min-w-0 flex-1'>
          {/* Active status skeleton */}
          <div className='inline-flex items-center gap-1 mb-2'>
            <Skeleton height={6} width={6} radius={3} />
            <Skeleton height={16} width={50} />
          </div>

          {/* Workspace title skeleton */}
          <Skeleton height={32} width='70%' className='mb-2' />

          {/* Workspace ID skeleton */}
          <div className='flex items-center gap-1'>
            <Skeleton height={16} width={150} />
          </div>
        </div>

        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0'>
          {/* Members section skeleton */}
          <div className='flex flex-col gap-2'>
            <Skeleton height={16} width={60} />
            <div className='flex items-center -space-x-2'>
              <Skeleton height={32} width={32} radius={16} />
              <Skeleton height={32} width={32} radius={16} />
              <Skeleton height={32} width={32} radius={16} />
            </div>
          </div>

          {/* Invite section skeleton */}
          <div className='flex flex-col gap-2'>
            <Skeleton height={16} width={80} />
            <div className='flex gap-2'>
              <Skeleton height={32} width={144} className='rounded' />
              <Skeleton height={32} width={55} className='rounded' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkspaceOverviewSkeleton;
