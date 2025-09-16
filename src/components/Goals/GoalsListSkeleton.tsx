import clsx from 'clsx';

import { useProfileStore } from 'stores/profileStore';

import Skeleton from 'components/Shared/Skeleton';

type GoalsListSkeletonPropsType = {
  view: 'grid' | 'list';
};

const GoalsListSkeleton = ({ view }: GoalsListSkeletonPropsType) => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  const bgColor = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  if (view === 'list') {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            className={clsx('rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer', bgColor)}
            key={`list-${index}`}
          >
            <div className='p-6 flex justify-between items-start'>
              <div className='flex items-center space-x-4 flex-1'>
                <div className='flex-1'>
                  <Skeleton height={28} width='75%' />
                  <div className='flex gap-4 items-center mt-2'>
                    <Skeleton height={28} width={120} radius={14} />
                    <Skeleton height={20} width={120} />
                    <Skeleton height={20} width={120} />
                    <Skeleton height={20} width={120} />
                  </div>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <Skeleton height={8} width={80} className='me-8' />
                <Skeleton height={20} width={30} />
                <Skeleton height={32} width={32} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          className={clsx('rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer', bgColor)}
          key={`grid-${index}`}
        >
          <div className='p-6'>

            <Skeleton height={28} width='75%' />
            <div className='flex justify-between items-center mt-4'>
              <Skeleton height={28} width={100} radius={14} />
              <Skeleton height={28} width={100} />
            </div>

            <div className='flex justify-center items-center'>
              <Skeleton height={96} width={96} radius='50%' />
            </div>

            {/* Stats */}
            <div className='flex justify-between items-center mb-6 mx-6'>
              <div className='text-center'>
                <div className='flex justify-center items-center text-orange-500 mb-1'>
                  <Skeleton height={20} width={30} />
                </div>
                <Skeleton height={16} width={60} />
              </div>
              <div className='text-center'>
                <div className='flex justify-center items-center mb-1'>
                  <Skeleton height={20} width={60} />
                </div>
                <Skeleton height={16} width={60} />
              </div>
            </div>

            {/* Weekly Progress */}
            <div className='mb-4'>
              <div className='flex justify-between text-sm mb-1'>
                <Skeleton height={20} width={65} />
                <Skeleton height={20} width={50} />
              </div>
              <Skeleton height={8} width='100%' />
            </div>

            {/* Tags */}
            <div className='flex flex-wrap gap-1 mb-4'>
              <Skeleton height={24} width={60} />
              <Skeleton height={24} width={60} />
              <Skeleton height={24} width={60} />
            </div>

            {/* Action Buttons */}
            <div className='flex gap-2 mt-4'>
              <Skeleton height={40} width='100%' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoalsListSkeleton;
