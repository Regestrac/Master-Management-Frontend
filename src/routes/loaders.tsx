import { ArrowLeft, PlusCircle, Users } from 'lucide-react';

import DashboardGoalSkeleton from 'components/Dashboard/GoalSkeleton';
import DashboardTaskSkeleton from 'components/Dashboard/TaskSkeleton';
import GoalFiltersSkeleton from 'components/Goals/GoalFiltersSkeleton';
import GoalsListSkeleton from 'components/Goals/GoalsListSkeleton';
import GoalStatsSkeleton from 'components/Goals/GoalStatsSkeleton';
import Skeleton from 'components/Shared/Skeleton';
import TaskFiltersSkeleton from 'components/Tasks/TaskFiltersSkeleton';
import TaskListSkeleton from 'components/Tasks/TaskListSkeleton';
import TaskStatsSkeleton from 'components/Tasks/TaskStatsSkeleton';
import WorkspaceSkeletonLoader from 'components/Workspace/WorkspaceSkeleton';
import WorkspaceOverviewSkeleton from 'components/Workspace/Details/WorkspaceOverviewSkeleton';
import WorkspaceTabs from 'components/Workspace/Details/WorkspaceTabs';
import WSGoalsListSkeleton from 'components/Workspace/Details/GoalListSkeleton';
import WSTaskListSkeleton from 'components/Workspace/Details/TaskListSkeleton';

export const DashboardSkeleton = () => (
  <>
    <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
      {[1, 2, 3, 4].map((i) => <Skeleton key={i} className='rounded-xl' height={106} />)}
    </div>
    <div className='space-y-4 mb-8'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-xl font-bold'>Recent Tasks</h3>
        <div className='text-primary-300 hover:text-primary-400 text-sm font-medium'>View All</div>
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <DashboardTaskSkeleton key={index} />
      ))}
    </div>
    <div className='space-y-4 mb-4'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-xl font-bold'>Active Goals</h3>
        <div className='text-primary-300 hover:text-primary-400 text-sm font-medium'>View All</div>
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <DashboardGoalSkeleton key={index} />
      ))}
    </div>
  </>
);

export const TaskSkeleton = () => (
  <>
    <TaskStatsSkeleton />
    <TaskFiltersSkeleton />
    <div className='h-4 w-full mt-2' />
    <TaskListSkeleton />
  </>
);

export const GoalSkeleton = () => (
  <>
    <GoalStatsSkeleton />
    <GoalFiltersSkeleton />
    <div className='h-4 w-full mt-2' />
    <GoalsListSkeleton view='grid' />
  </>
);

export const WorkspaceSkeleton = () => (
  <div className='p-8 space-y-8 h-[calc(100vh-165px)]'>
    <header className='flex items-center justify-between'>
      <h1 className='text-2xl font-bold flex items-center gap-2'>
        <Users className='w-6 h-6' />
        Workspaces
      </h1>
      <div className='flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500/70 text-white'>
        <PlusCircle className='w-5 h-5' />
        <span>Create / Join</span>
      </div>
    </header>
    <WorkspaceSkeletonLoader />
  </div>
);

export const WorkspaceDetailSkeleton = () => (
  <div className='space-y-8 min-h-[calc(100vh-165px)]'>
    <div className='flex items-center gap-2 text-sm text-gray-600 cursor-pointer'>
      <ArrowLeft className='w-4 h-4' />
      Back To Workspaces
    </div>
    <WorkspaceOverviewSkeleton />
    <WorkspaceTabs goalList={<WSGoalsListSkeleton />} taskList={<WSTaskListSkeleton />} />
  </div>
);
