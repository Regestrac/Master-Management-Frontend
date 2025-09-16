import { useEffect, useRef, useState } from 'react';

import { BarChart3, Flame, Pause, Play, Target, Trophy } from 'lucide-react';
import { toast } from 'react-toastify';

import { titleCase } from 'helpers/utils';

import { useProfileStore } from 'stores/profileStore';

import { getGoalStats } from 'services/goals';

import GoalStatsSkeleton from 'components/Goals/GoalStatsSkeleton';

const getStatsColor = (stat: string) => {
  switch (stat) {
    case 'total':
      return 'from-blue-500 to-blue-600';
    case 'active':
      return 'from-green-500 to-green-600';
    case 'completed':
      return 'from-purple-500 to-purple-600';
    case 'paused':
      return 'from-yellow-500 to-yellow-600';
    case 'high_priority':
      return 'from-red-500 to-red-600';
    case 'average_progress':
      return 'from-indigo-500 to-indigo-600';
    default:
      return '';
  }
};

const getStatsIcons = (stat: string) => {
  switch (stat) {
    case 'total':
      return Target;
    case 'active':
      return Play;
    case 'completed':
      return Trophy;
    case 'paused':
      return Pause;
    case 'high_priority':
      return Flame;
    case 'average_progress':
      return BarChart3;
    default:
      return null;
  }
};

const GoalStats = () => {
  const [stats, setStats] = useState<{ count: number; status: string; }[]>([]);
  const [loading, setLoading] = useState(true);

  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  const shouldFetchStatsRef = useRef(true);

  useEffect(() => {
    if (shouldFetchStatsRef.current) {
      getGoalStats().then((res) => {
        setStats(res?.data);
        setLoading(false);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to get goal stats');
        setLoading(false);
      });
      shouldFetchStatsRef.current = false;
    }
  }, []);

  if (loading) {
    return <GoalStatsSkeleton />;
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8'>
      {(() => {
        return stats?.map(({ status, count }) => {
          const Icon = getStatsIcons(status);
          return (
            <div key={status} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`w-8 h-8 bg-gradient-to-r ${getStatsColor(status)} rounded-lg mb-2 flex items-center justify-center`}>
                {Icon && <Icon className='w-4 h-4 text-white' />}
              </div>
              <p className='text-xl font-bold'>
                {status === 'average_progress' ? count.toFixed(2) : count}
                {status === 'average_progress' && '%'}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{titleCase(status)}</p>
            </div>
          );
        });
      })()}
    </div>
  );
};

export default GoalStats;