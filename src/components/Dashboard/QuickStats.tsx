import { useEffect, useRef, useState } from 'react';

import { CheckSquare, Clock, Flame, Trophy } from 'lucide-react';
import { toast } from 'react-toastify';

import { useSettingsStore } from 'stores/settingsStore';

import { getQuickStats } from 'services/dashboard';

import Skeleton from 'components/Shared/Skeleton';

const secondsToHour = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);

  return `${hours || 0} h`;
};

const QuickStats = () => {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const shouldFetchStatsRef = useRef(true);

  useEffect(() => {
    if (shouldFetchStatsRef.current) {
      setIsLoading(true);
      getQuickStats().then((res) => {
        setStats(res?.data);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to get quick stats');
      }).finally(() => {
        setIsLoading(false);
      });
      shouldFetchStatsRef.current = false;
    }
  }, []);

  const taskStats = [
    { icon: CheckSquare, label: 'Total Tasks', value: stats.total_tasks, color: 'from-blue-500 to-blue-600' },
    { icon: Trophy, label: 'Completed Today', value: stats.completed_today, color: 'from-green-500 to-green-600' },
    { icon: Flame, label: 'Current Streak', value: `${stats.current_streak || 0} days`, color: 'from-orange-500 to-orange-600' },
    { icon: Clock, label: 'Total Hours', value: secondsToHour(stats.total_time_spend), color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
      {taskStats.map(({ icon: Icon, label, value, color }) => (
        isLoading ? <Skeleton key={label} className='rounded-xl' height={106} /> : (
          <div key={label} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className='flex items-center justify-between'>
              <div>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>{label}</p>
                <p className='text-2xl font-bold mt-1'>{value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
                <Icon className='w-6 h-6 text-white' />
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default QuickStats;