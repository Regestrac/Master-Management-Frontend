import { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getRecentTasks } from 'services/dashboard';

import TaskCard from 'components/Tasks/TaskCard';
import TaskSkeleton from 'components/Dashboard/TaskSkeleton';

type RecentTaskType = {
  id: number;
  last_accessed_at: string;
  status: 'completed' | 'todo' | 'inprogress' | 'pending' | 'paused';
  time_spend: number;
  title: string;
  streak: number;
  priority: 'high' | 'normal' | 'low';
};

const RecentTasks = () => {
  const [recentTasks, setRecentTasks] = useState<RecentTaskType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const shouldFetchRecentTasksRef = useRef(true);

  const handleViewAllTask = () => {
    navigate('/tasks');
  };

  useEffect(() => {
    if (shouldFetchRecentTasksRef.current) {
      setIsLoading(true);
      getRecentTasks().then((res) => {
        setRecentTasks(res?.data || []);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch recent tasks');
      }).finally(() => {
        setIsLoading(false);
      });
      shouldFetchRecentTasksRef.current = false;
    }
  }, []);

  return (
    <div className='lg:col-span-2 mb-8'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-xl font-bold'>Recent Tasks</h3>
        {/* <button className='flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'>
          <Plus className='w-4 h-4' />
          <span>Add Task</span>
        </button> */}
        <button className='text-primary-500 hover:text-primary-600 text-sm font-medium' onClick={handleViewAllTask}>View All</button>
      </div>

      <div className='space-y-4'>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TaskSkeleton key={index} />
          ))
        ) : (
          recentTasks.map((task) => (
            <TaskCard key={task.id} task={task as any} />
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTasks;