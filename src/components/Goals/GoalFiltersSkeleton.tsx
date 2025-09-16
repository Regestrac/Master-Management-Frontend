import Skeleton from 'components/Shared/Skeleton';

const GoalFiltersSkeleton = () => {
  return (
    <div className='flex flex-1 flex-wrap items-center gap-4'>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className='flex flex-col gap-1 w-[200px]'>
          <Skeleton height={20} width={100} className='mb-1' />
          <Skeleton height={38} width={200} className='rounded-md' />
        </div>
      ))}
      <div className='flex rounded-lg border border-gray-300 overflow-hidden'>
        <Skeleton height={32} width={32} className='p-4' radius={0} />
        <Skeleton height={32} width={32} className='p-4' radius={0} />
      </div>
    </div>
  );
};

export default GoalFiltersSkeleton;
