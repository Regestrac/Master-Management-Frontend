import { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';

import { useGoalStore } from 'stores/goalsStore';

import { getAllGoals } from 'services/goals';

import GoalCard from 'components/Goals/GoalCard';

import CreateGoalCard from './CreateGoalCard';
import GoalFilters from './GoalFilters';

const GoalsListing = () => {
  const [createGoal, setCreateGoal] = useState(false);

  const goals = useGoalStore((state) => state.goals);
  const addGoal = useGoalStore((state) => state.addGoal);

  const [searchParams] = useSearchParams();

  const view = searchParams.get('view') as 'list' | 'grid' || 'list';

  const handleCreateGoal = () => {
    setCreateGoal(true);
  };

  const handleCancelCreateGoal = () => {
    setCreateGoal(false);
  };

  useEffect(() => {
    getAllGoals(searchParams.toString()).then((res) => {
      addGoal(res?.data || [], 'replace');
    }).catch((err) => {
      toast.error(err?.error || 'Failed to get goals!');
    });
  }, [searchParams, addGoal]);

  return (
    <>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
        <GoalFilters />
        <div className='flex items-center gap-4'>
          <button
            onClick={handleCreateGoal}
            className='flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
          >
            <Plus className='w-4 h-4' />
            <span>New Goal</span>
          </button>
        </div>
      </div>

      <div className={view === 'list' ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'}>
        {createGoal && <CreateGoalCard handleCancel={handleCancelCreateGoal} view={view} />}
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} view={view} isActive={false} />
        ))}
      </div>
    </>
  );
};

export default GoalsListing;