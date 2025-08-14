import { useEffect, useRef, useState } from 'react';

import { Clock, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { formatTimeElapsed } from 'helpers/utils';

import { useProfileStore } from 'stores/profileStore';

import { getActiveGoals } from 'services/goals';

type ActiveGoalType = {
  id: number;
  title: string;
  streak: number;
  time_spend: number;
  status: string;
  last_accessed_at: string;
  type: 'goal' | 'task';
}

const ActiveGoals = () => {
  const [goals, setGoals] = useState<ActiveGoalType[]>([]);
  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';

  const shouldFetchGoalsRef = useRef(true);

  const navigate = useNavigate();

  const handleViewAllGoals = () => {
    navigate('/goals');
  };

  useEffect(() => {
    if (shouldFetchGoalsRef.current) {
      getActiveGoals().then((res) => {
        setGoals(res?.data);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch active goals');
      });
      shouldFetchGoalsRef.current = false;
    }
  }, []);

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-xl font-bold'>Active Goals</h3>
        <button className='text-purple-500 hover:text-purple-600 text-sm font-medium' onClick={handleViewAllGoals}>View All</button>
      </div>

      <div className='space-y-4'>
        {goals.map((goal) => {
          const progress = goal.time_spend % 100; // For now, update this

          return (
            <div key={goal.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
              <div className='mb-4'>
                <h4 className='font-semibold mb-2'>{goal.title}</h4>
                <div className='flex items-center justify-between text-sm mb-2'>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {progress}
                    % complete
                  </span>
                  <span className='text-orange-500 flex items-center'>
                    <Flame className='w-4 h-4 mr-1' />
                    {goal.streak}
                    {' '}
                    days
                  </span>
                </div>
                <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                  <div
                    className='bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500'
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className={`flex items-center justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className='flex items-center'>
                  <Clock className='w-4 h-4 mr-1' />
                  {formatTimeElapsed(goal.time_spend)}
                </span>
                <button className='text-purple-500 hover:text-purple-600 font-medium'>
                  Continue
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveGoals;