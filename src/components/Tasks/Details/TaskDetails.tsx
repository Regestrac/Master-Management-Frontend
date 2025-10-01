import { useState } from 'react';

import {
  Edit3,
  MessageSquare,
  History,
  Target,
} from 'lucide-react';

import { useSettingsStore } from 'stores/settingsStore';

import TaskHeader from 'components/Tasks/Details/TaskHeader';
import TaskProgress from 'components/Tasks/Details/TaskProgress';
import TaskOverview from 'components/Tasks/Details/Overview/TaskOverview';
import TaskActivity from 'components/Tasks/Details/Activity/TaskActivity';
import TaskNotes from 'components/Tasks/Details/Notes/TaskNotes';
import TaskComments from 'components/Tasks/Details/Comments/TaskComments';

const TaskDetails = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 border-b transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className='mx-auto px-6 py-4'>

          <TaskHeader />
          <TaskProgress />

          {/* Tabs */}
          <div className='flex space-x-6 mt-6 2xl:mx-12'>
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
                    ? 'border-primary-500 text-primary-600'
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

      <div className='px-6 py-8 2xl:mx-12'>
        {activeTab === 'overview' && <TaskOverview />}
        {activeTab === 'activity' && <TaskActivity />}
        {activeTab === 'notes' && <TaskNotes />}
        {activeTab === 'comments' && <TaskComments />}
      </div>
    </div>
  );
};

export default TaskDetails;