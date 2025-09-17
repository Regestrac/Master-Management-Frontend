import { Clock, Plus } from 'lucide-react';

import { useProfileStore } from 'stores/profileStore';

const CalendarHeader = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8'>
      <div>
        <h3 className='text-2xl font-bold mb-2'>Calendar & Schedule</h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage your tasks, goals, and events in one place
        </p>
      </div>
      <div className='flex items-center gap-4'>
        <div className='flex rounded-lg border border-gray-300 overflow-hidden'>
          <button className='px-4 py-2 bg-purple-500 text-white text-sm font-medium'>Month</button>
          <button className={`px-4 py-2 text-sm font-medium ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}>Week</button>
          <button className={`px-4 py-2 text-sm font-medium ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}>Day</button>
        </div>
        <button className='flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'>
          <Plus className='w-4 h-4' />
          <span>Add Event</span>
        </button>
        <button className='flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
          <Clock className='w-4 h-4' />
          <span>Time Block</span>
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;