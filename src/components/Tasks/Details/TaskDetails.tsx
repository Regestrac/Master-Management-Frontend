import { useState } from 'react';

import {
  Edit3,
  MessageSquare,
  History,
  Target,
} from 'lucide-react';
import { useProfileStore } from 'stores/profileStore';

import TaskHeader from './TaskHeader';
import TaskProgress from './TaskProgress';
import TaskOverview from './Overview/TaskOverview';
import RestOfTaskDetails from './RestOfTaskDetails';
import TaskActivity from './Activity/TaskActivity';

const TaskDetailsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 border-b transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className='max-w-7xl mx-auto px-6 py-4'>

          <TaskHeader />
          <TaskProgress />

          {/* Tabs */}
          <div className='flex space-x-6 mt-6'>
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'notes', label: 'Notes', icon: Edit3 },
              { id: 'activity', label: 'Activity', icon: History },
              { id: 'comments', label: 'Comments', icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 border-b-2 transition-colors ${activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}`}
                >
                  <Icon className='w-4 h-4' />
                  <span className='font-medium'>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            {activeTab === 'overview' && <TaskOverview />}
            {activeTab === 'activity' && <TaskActivity />}
          </div>

          <RestOfTaskDetails activeTab={activeTab} />

        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;