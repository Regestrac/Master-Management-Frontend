import { useProfileStore } from 'stores/profileStore';

const GoalProgressOverview = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h4 className='text-xl font-bold mb-1'>Goal Progress</h4>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active goals performance</p>
        </div>
        <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z' />
          </svg>
        </button>
      </div>

      <div className='space-y-4'>
        {[
          { title: 'Learn React Advanced', progress: 75, target: 'Aug 1', color: '#8B5CF6', weekly: '6/8h' },
          { title: 'Build Portfolio', progress: 40, target: 'Jul 15', color: '#06B6D4', weekly: '4/10h' },
          { title: 'Read 12 Books', progress: 60, target: 'Dec 31', color: '#10B981', weekly: '4/3h' },
          { title: 'Master TypeScript', progress: 25, target: 'Sep 15', color: '#F59E0B', weekly: '3/5h' },
        ].map((goal, index) => (
          <div key={index} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
            <div className='flex items-center justify-between mb-3'>
              <h5 className='font-medium'>{goal.title}</h5>
              <div className='flex items-center space-x-2 text-sm'>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Due
                  {goal.target}
                </span>
                <span className='font-medium'>
                  {goal.progress}
                  %
                </span>
              </div>
            </div>
            <div className={`w-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full mb-2`}>
              <div
                className='h-2 rounded-full transition-all duration-500'
                style={{ width: `${goal.progress}%`, backgroundColor: goal.color }}
              />
            </div>
            <div className='flex items-center justify-between text-xs'>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                This week:
                {goal.weekly}
              </span>
              <span className={`px-2 py-1 rounded ${goal.progress >= 50
                ? 'bg-green-100 text-green-600'
                : goal.progress >= 25
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-red-100 text-red-600'}`}
              >
                {goal.progress >= 50 ? 'On Track' : goal.progress >= 25 ? 'Behind' : 'Critical'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalProgressOverview;