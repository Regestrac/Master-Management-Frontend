import { BarChart3, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useSettingsStore } from 'stores/settingsStore';

const QuickActions = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const navigate = useNavigate();

  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  const handleCreateGoal = () => {
    navigate('/goals');
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm mt-6`}>
      <h4 className='font-semibold mb-4'>Quick Actions</h4>
      <div className='space-y-3'>
        <button
          className='w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-500/10 text-purple-500 transition-colors'
          onClick={handleCreateGoal}
        >
          <Plus className='w-5 h-5' />
          <span>Create New Goal</span>
        </button>
        <button
          className='w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-500/10 text-blue-500 transition-colors'
          onClick={handleViewAnalytics}
        >
          <BarChart3 className='w-5 h-5' />
          <span>View Analytics</span>
        </button>
        {/* <button className='w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-green-500/10 text-green-500 transition-colors'>
          <Calendar className='w-5 h-5' />
          <span>Schedule Review</span>
        </button> */}
      </div>
    </div>
  );
};

export default QuickActions;