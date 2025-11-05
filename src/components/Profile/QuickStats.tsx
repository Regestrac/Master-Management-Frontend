import { useEffect, useRef, useState } from 'react';

import { toast } from 'react-toastify';

import { formatDuration } from 'helpers/utils';

import { useSettingsStore } from 'stores/settingsStore';

import { getMonthlyStats } from 'services/profile';

type StatsType = {
  tasks_completed: number;
  task_difference: number;
  goals_achieved: number;
  goal_difference: number;
  focus_duration: number;
  duration_difference: number;
  productivity_score: number;
  score_difference: number;
};

const addSymbol = (value?: number, isDuration?: boolean) => {
  if (!value || value > 0) {
    return `+${isDuration ? formatDuration(value || 0) : value || 0}`;
  }
  return isDuration ? formatDuration(value) : value;
};

const getColor = (value?: number) => {
  if (!value || value >= 0) {
    return 'text-green-300';
  }
  return 'text-red-300';
};

const QuickStats = () => {
  const [stats, setStats] = useState<StatsType>();

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const shouldFetchStatsRef = useRef(true);

  useEffect(() => {
    if (shouldFetchStatsRef.current) {
      getMonthlyStats().then((res) => {
        setStats(res?.data);
      }).catch((err) => {
        toast.error(err.message || 'Failed to get monthly stats!');
      });
      shouldFetchStatsRef.current = false;
    };
  }, []);

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <h5 className='font-semibold mb-4'>This Month</h5>
      <div className='space-y-4'>
        {[
          { label: 'Tasks Completed', value: stats?.tasks_completed, change: addSymbol(stats?.task_difference), color: getColor(stats?.task_difference) },
          { label: 'Goals Achieved', value: stats?.goals_achieved, change: addSymbol(stats?.goal_difference), color: getColor(stats?.goal_difference) },
          { label: 'Focus Hours', value: formatDuration(stats?.focus_duration || 0), change: addSymbol(stats?.duration_difference, true), color: getColor(stats?.duration_difference) },
          { label: 'Productivity Score', value: `${stats?.productivity_score}%`, change: `${addSymbol(stats?.score_difference)}%`, color: getColor(stats?.score_difference) },
        ].map((stat, index) => (
          <div key={index} className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium'>{stat.label}</p>
              <p className='text-lg font-bold text-primary-500'>{stat.value}</p>
            </div>
            <span className={`text-sm font-medium ${stat.color}`}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;