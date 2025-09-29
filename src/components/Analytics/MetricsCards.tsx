import { useEffect, useRef, useState } from 'react';

import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { formatDurationInSeconds } from 'helpers/utils';

import { useProfileStore } from 'stores/profileStore';

import { getQuickMetrics } from 'services/analytics';

type QuickMetricsType = {
  focus_time: number;
  productivity_score: number;
  tasks_completed: number;
  goal_progress: number;
  focus_time_change: number;
  productivity_score_change: number;
  tasks_completed_change: number;
  goal_progress_change: number;
};

const MetricsCards = () => {
  const [metricsData, setMetricsData] = useState({} as QuickMetricsType);

  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  const previousParamsRef = useRef<string>('');

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (previousParamsRef.current !== searchParams?.toString()) {
      getQuickMetrics(searchParams?.toString()).then((res) => {
        setMetricsData(res);
      }).catch((err) => {
        toast.error(err.error || 'Failed to fetch metrics');
      });
      previousParamsRef.current = searchParams?.toString();
    }
  }, [searchParams]);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pt-32 lg:pt-20'>
      {[
        {
          title: 'Productivity Score',
          value: `${metricsData.productivity_score || 0}%`,
          change: metricsData.productivity_score_change ? `${metricsData.productivity_score_change > 0 ? '+' : ''}${metricsData.productivity_score_change}` : null,
          trend: metricsData.productivity_score_change > 0 ? 'up' : 'down',
          icon: '📊',
          color: 'from-blue-500 to-blue-600',
          // description: 'Overall productivity this week',
        },
        {
          title: 'Tasks Completed',
          value: metricsData.tasks_completed,
          change: metricsData.tasks_completed_change ? `${metricsData.tasks_completed_change > 0 ? '+' : ''}${metricsData.tasks_completed_change}` : null,
          trend: metricsData.tasks_completed_change > 0 ? 'up' : 'down',
          icon: '✅',
          color: 'from-green-500 to-green-600',
          // description: 'Tasks completed this month',
        },
        {
          title: 'Focus Time',
          value: formatDurationInSeconds(metricsData.focus_time),
          change: metricsData.focus_time_change ? `${metricsData.focus_time_change > 0 ? '+' : ''}${formatDurationInSeconds(metricsData.focus_time_change)}` : null,
          trend: metricsData.focus_time_change > 0 ? 'up' : 'down',
          icon: '⏱️',
          color: 'from-purple-500 to-purple-600',
          // description: 'Deep work hours this week',
        },
        {
          title: 'Goal Progress',
          value: `${metricsData.goal_progress || 0}%`,
          change: metricsData.goal_progress_change ? `${metricsData.goal_progress_change > 0 ? '+' : ''}${metricsData.goal_progress_change}` : null,
          trend: metricsData.goal_progress_change > 0 ? 'up' : 'down',
          icon: '🎯',
          color: 'from-orange-500 to-orange-600',
          // description: 'Average goal completion',
        },
      ].map((metric, index) => (
        <div key={index} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-200`}>
          <div className='flex items-center justify-between mb-4'>
            <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center text-xl`}>
              {metric.icon}
            </div>
            {metric.change ? (
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${metric.trend === 'up'
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600'}`}
              >
                <svg className={`w-3 h-3 ${metric.trend === 'up' ? 'transform rotate-0' : 'transform rotate-180'}`} fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z' clipRule='evenodd' />
                </svg>
                <span>{metric.change}</span>
              </div>
            ) : null}
          </div>
          <div>
            <h4 className='text-2xl font-bold mb-1'>{metric.value}</h4>
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metric.title}</p>
            {/* <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{metric.description}</p> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;