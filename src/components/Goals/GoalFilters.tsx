import { CheckSquare, Plus, Target } from 'lucide-react';
import { useProfileStore } from 'stores/profileStore';

type GoalFilterPropsType = {
  goalFilter: string;
  setGoalFilter: (_filter: string) => void;
  goalSort: string;
  setGoalSort: (_sort: string) => void;
  goalViewMode: 'card' | 'list';
  setGoalViewMode: (_viewMode: 'card' | 'list') => void
};

const GoalFilters = ({ goalViewMode, setGoalViewMode, goalFilter, setGoalFilter, goalSort, setGoalSort }: GoalFilterPropsType) => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  const handleCreateGoal = () => {

  };

  return (
    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
      <div className='flex flex-wrap items-center gap-4'>
        <select
          value={goalFilter}
          onChange={(e) => setGoalFilter(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${darkMode
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
        >
          <option value='all'>All Goals</option>
          <option value='active'>Active</option>
          <option value='completed'>Completed</option>
          <option value='paused'>Paused</option>
          <option value='learning'>Learning</option>
          <option value='career'>Career</option>
          <option value='personal'>Personal</option>
          <option value='health'>Health</option>
          <option value='business'>Business</option>
        </select>

        <select
          value={goalSort}
          onChange={(e) => setGoalSort(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${darkMode
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
        >
          <option value='progress'>Sort by Progress</option>
          <option value='streak'>Sort by Streak</option>
          <option value='priority'>Sort by Priority</option>
          <option value='deadline'>Sort by Deadline</option>
        </select>

        <div className='flex rounded-lg border border-gray-300 overflow-hidden'>
          <button
            onClick={() => setGoalViewMode('card')}
            className={`p-2 ${goalViewMode === 'card' ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}
          >
            <Target className='w-4 h-4' />
          </button>
          <button
            onClick={() => setGoalViewMode('list')}
            className={`p-2 ${goalViewMode === 'list' ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}
          >
            <CheckSquare className='w-4 h-4' />
          </button>
        </div>
      </div>

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
  );
};

export default GoalFilters;