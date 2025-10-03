import Skeleton from 'components/Shared/Skeleton';

type WorkspaceSkeletonPropsType = {
  count?: number;
};

const WorkspaceSkeleton = ({ count = 6 }: WorkspaceSkeletonPropsType) => {
  return (
    <ul className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className='p-6 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse'
        >
          <Skeleton height={22} width='50%' />
          <Skeleton height={18} width='70%' className='mt-2' />
        </li>
      ))}
    </ul>
  );
};

export default WorkspaceSkeleton;
