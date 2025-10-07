import { useEffect, useRef, useState } from 'react';

import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

import { formatDuration, generateRandomColor } from 'helpers/utils';

import { useSettingsStore } from 'stores/settingsStore';

import { getGoalProgress } from 'services/analytics';

type GoalProgressType = {
  id: number;
  title: string;
  progress: number;
  due_date: string;
  duration: number;
}[];

const GoalProgressOverview = () => {
  const [goalProgress, setGoalProgress] = useState<GoalProgressType>([]);
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const prevSearchParamsRef = useRef('');

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (prevSearchParamsRef.current !== searchParams.toString()) {
      getGoalProgress(searchParams.toString()).then((res) => {
        setGoalProgress(res?.data);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch goal progress data!');
      });
      prevSearchParamsRef.current = searchParams.toString();
    }
  }, [searchParams]);

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 px-5 border shadow-sm`}>
      <div className='flex items-center justify-between mb-6 px-1'>
        <div>
          <h4 className='text-xl font-bold mb-1'>Goal Progress</h4>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active goals performance</p>
        </div>
      </div>

      <div className='space-y-4 max-h-[520px] overflow-y-auto scrollbar-sm px-1'>
        {goalProgress?.map((goal) => (
          <div key={goal.id} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
            <div className='flex items-center justify-between mb-3'>
              <h5 className='font-medium'>{goal.title}</h5>
              <div className='flex items-center space-x-2 text-sm'>
                {goal.due_date ? (
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Due
                    {goal.due_date}
                  </span>
                ) : null}
                <span className='font-medium'>
                  {Number(goal.progress)?.toFixed(1) || 0}
                  %
                </span>
              </div>
            </div>
            <div className={`w-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full mb-2`}>
              <div
                className='h-2 rounded-full transition-all duration-500'
                style={{ width: `${goal.progress || 0}%`, backgroundColor: generateRandomColor(goal.title) }}
              />
            </div>
            <div className='flex items-center justify-between text-xs'>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Time spend:&nbsp;
                {formatDuration(goal.duration)}
              </span>
              {(() => {
                const isBehind = goal.due_date ? new Date(goal.due_date) < new Date() : false;
                return (
                  <span className={`px-2 py-1 rounded ${isBehind ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {isBehind ? 'Behind' : 'On Track'}
                  </span>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalProgressOverview;