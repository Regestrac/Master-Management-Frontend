import { useState } from 'react';

import {
  Edit3,
  MessageSquare,
  History,
  Target,
  Menu,
  MoreVertical,
  Sun,
  Moon,
  Check,
  Eraser,
  MoveRight,
  CheckSquare,
  Copy,
  Star,
  Archive,
  Trash2,
} from 'lucide-react';
import { toast } from 'react-toastify';

import { useSettingsStore } from 'stores/settingsStore';
import { useNavbarStore } from 'stores/navbarStore';

import { updateTheme } from 'services/settings';

import TaskHeader from 'components/Tasks/Details/TaskHeader';
import TaskProgress from 'components/Tasks/Details/TaskProgress';
import TaskOverview from 'components/Tasks/Details/Overview/TaskOverview';
import TaskActivity from 'components/Tasks/Details/Activity/TaskActivity';
import TaskNotes from 'components/Tasks/Details/Notes/TaskNotes';
import TaskComments from 'components/Tasks/Details/Comments/TaskComments';
import TaskTimer from 'components/Tasks/Details/TaskTimer';
import Dropdown from 'components/Shared/Dropdown';

const moreOptions = [
  { label: 'Mark As Completed', value: 'mark_completed', bgColor: 'text-green-600 bg-green-500/20', icon: <Check className='w-4 h-4' /> },
  { label: 'Clear stats', value: 'clear_stats', bgColor: 'text-white', icon: <Eraser className='w-4 h-4' /> },
  { label: 'Move Task', value: 'move_task', bgColor: 'text-white', icon: <MoveRight className='w-4 h-4' /> },
  { label: 'Duplicate Task', value: 'duplicate_task', bgColor: 'text-white', icon: <CheckSquare className='w-4 h-4' /> },
  { label: 'Copy Link', value: 'copy_link', bgColor: 'text-white', icon: <Copy className='w-4 h-4' /> },
  { label: 'Add to Favorites', value: 'add_favorite', bgColor: 'text-white', icon: <Star className='w-4 h-4' /> },
  { label: 'Archive', value: 'archive_task', bgColor: 'text-white', icon: <Archive className='w-4 h-4' /> },
  { label: 'Delete Task', value: 'delete_task', bgColor: 'text-red-600 bg-red-500/20', icon: <Trash2 className='w-4 h-4' /> },
];

const TaskDetails = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const showNavbar = useNavbarStore((state) => state.showNavbar);
  const setShowNavbar = useNavbarStore((state) => state.setShowNavbar);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  const toggleSidebar = () => {
    setShowNavbar(!showNavbar);
  };

  const updateAppTheme = () => {
    updateSettings({ theme: darkMode ? 'light' : 'dark' });
    updateTheme({ theme: darkMode ? 'light' : 'dark' }).then((res) => {
      updateSettings({ theme: res?.theme });
    }).catch((err) => {
      toast.error(err?.error);
    });
  };

  const handleMoreOptionSelect = () => {

  };

  return (
    <div className={`min-h-screen transition-colors duration-300 -m-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 border-b transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className='mx-auto px-4 sm:px-6 py-4'>
          {/* Mobile Sidebar Toggle */}
          <div className='flex items-center justify-between mb-4 lg:hidden'>
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-label='Toggle Sidebar'
            >
              <Menu className='w-5 h-5' />
            </button>
            <div className='flex items-center gap-2 flex-shrink-0 sm:hidden'>
              <div className='sm:hidden'>
                <TaskTimer />
              </div>
              <button
                onClick={updateAppTheme}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                aria-label='Theme'
              >
                {darkMode ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
              </button>
              <Dropdown options={moreOptions} onSelect={handleMoreOptionSelect} hideClear value={null}>
                <div className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <MoreVertical className='w-5 h-5' />
                </div>
              </Dropdown>
            </div>
          </div>

          <TaskHeader />
          <TaskProgress />

          {/* Tabs */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-4'>
            <div className='flex overflow-x-auto space-x-4 sm:space-x-6 2xl:mx-12 pb-2 sm:pb-0'>
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
                    className={`flex items-center space-x-2 px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}`}
                  >
                    <Icon className='w-4 h-4' />
                    <span className='font-medium'>{tab.label}</span>
                  </button>
                );
              })}
            </div>
            <div className='max-sm:hidden'>
              <TaskTimer />
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 sm:px-6 py-6 sm:py-8 2xl:mx-12'>
        {activeTab === 'overview' && <TaskOverview />}
        {activeTab === 'activity' && <TaskActivity />}
        {activeTab === 'notes' && <TaskNotes />}
        {activeTab === 'comments' && <TaskComments />}
      </div>
    </div>
  );
};

export default TaskDetails;