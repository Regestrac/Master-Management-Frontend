import { useEffect, useRef, useState } from 'react';

import { toast } from 'react-toastify';

import { titleCase } from 'helpers/utils';

import { useProfileStore } from 'stores/profileStore';

import { getTasksStats } from 'services/tasks';

const getStatsGradients = (item: string) => {
  switch (item) {
    case 'total':
      return 'from-purple-500 to-pink-600';
    case 'completed':
      return 'from-green-500 to-green-600';
    case 'in_progress':
      return 'from-purple-500 to-purple-600';
    case 'pending':
      return 'from-yellow-500 to-yellow-600';
    case 'overdue':
      return 'from-red-500 to-red-600';
    case 'todo':
      return 'from-blue-500 to-blue-600';
    case 'paused':
      return 'from-gray-500 to-gray-600';
    default:
      return '';
  };
};

const TaskStats = () => {
  const [taskStats, setTaskStats] = useState([] as { status: string; count: number; }[]);

  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';

  const fetchStatsRef = useRef(true);

  useEffect(() => {
    if (fetchStatsRef.current) {
      getTasksStats().then((res) => {
        setTaskStats(res.data);
      }).catch((err) => {
        toast.error(err?.error || 'Error fetching task stats');
      });
      fetchStatsRef.current = false;
    }
  }, []);

  return (
    <div className='grid grid-cols-2 xl:grid-cols-7 lg:grid-cols-5 md:grid-cols-4 gap-4 mb-8'>
      {taskStats.map((stats) => {
        const gradient = getStatsGradients(stats?.status);
        return (
          <div key={stats?.status} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`w-8 h-8 bg-gradient-to-r ${gradient} rounded-lg mb-2`} />
            <p className='text-2xl font-bold'>{stats?.count}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{titleCase(stats?.status)}</p>
          </div>
        );
      })}
    </div>
  );
};

export default TaskStats;