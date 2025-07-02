import { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Clock, Flame, Plus } from 'lucide-react';
import { useThemeStore } from 'stores/themeStore';

import { getRecentTasks } from 'src/services/tasks';

type RecentTaskType = {
  id: number;
  last_accessed_at: string;
  status: 'completed' | 'todo' | 'inprogress' | 'pending' | 'paused';
  time_spend: number;
  title: string;
  streak: number;
  priority: 'high' | 'normal' | 'low';
};

const getPriorityColor = (priority: RecentTaskType['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'normal':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusColor = (status: RecentTaskType['status']) => {
  switch (status) {
    case 'completed':
      return 'text-green-400 bg-green-400/10';
    case 'todo':
      return 'text-blue-400 bg-blue-400/10';
    case 'inprogress':
      return 'text-blue-400 bg-blue-400/10';
    case 'pending':
      return 'text-gray-400 bg-gray-400/10';
    case 'paused':
      return 'text-yellow-400 bg-yellow-400/10';
    default:
      return 'text-gray-400 bg-gray-400/10';
  }
};

const RecentTasks = () => {
  const [recentTasks, setRecentTasks] = useState<RecentTaskType[]>([]);

  // const recentTasks = useTaskStore((state) => state.recentTasks);
  // const updateRecentTask = useTaskStore((state) => state.updateRecentTask);
  // const updateStartTimer = useTaskStore((state) => state.updateStartTimer);
  const darkMode = useThemeStore((state) => state.theme) === 'dark';

  const navigate = useNavigate();

  const shouldFetchRecentTasksRef = useRef(true);

  const handleOnTaskClick = (taskId: number) => {
    navigate(`/tasks/${taskId}`);
  };

  // const onResumeTaskClick = (taskId: number) => {
  //   handleOnTaskClick(taskId);
  //   updateStartTimer(true);
  // };

  useEffect(() => {
    if (shouldFetchRecentTasksRef.current) {
      getRecentTasks().then((res) => {
        setRecentTasks(res?.data || []);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch recent tasks');
      });
      shouldFetchRecentTasksRef.current = false;
    }
  }, []);

  return (
    <div className='lg:col-span-2 mb-8'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-xl font-bold'>Recent Tasks</h3>
        <button className='flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'>
          <Plus className='w-4 h-4' />
          <span>Add Task</span>
        </button>
      </div>

      <div className='space-y-4'>
        {recentTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => handleOnTaskClick(task.id)}
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                <div>
                  <h4 className='font-semibold'>{task.title}</h4>
                  <div className='flex items-center space-x-4 mt-2'>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm flex items-center`}>
                      <Clock className='w-4 h-4 mr-1' />
                      {task.time_spend > 0 ? task.time_spend : 'Not Started'}
                    </span>
                    {task.streak > 0 && (
                      <span className='text-orange-500 text-sm flex items-center'>
                        <Flame className='w-4 h-4 mr-1' />
                        {task.streak}
                        {' '}
                        day streak
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* <button
                onClick={() => toggleTimer(task.id)}
                className={`p-3 rounded-lg transition-colors ${activeTimer === task.id
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'}`}
              >
                {activeTimer === task.id ? <Pause className='w-5 h-5' /> : <Play className='w-5 h-5' />}
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTasks;