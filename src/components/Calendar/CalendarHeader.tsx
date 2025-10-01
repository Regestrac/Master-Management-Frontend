import { Plus, Menu, X, Sun, Moon } from 'lucide-react';
import { toast } from 'react-toastify';

import { useProfileStore } from 'stores/profileStore';
import { useNavbarStore } from 'stores/navbarStore';

import { updateTheme } from 'services/profile';

const CalendarHeader = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const setShowNavbar = useNavbarStore((state) => state.setShowNavbar);
  const showNavbar = useNavbarStore((state) => state.showNavbar);

  const handleSidebarToggle = () => {
    setShowNavbar(!showNavbar);
  };

  const updateColorTheme = () => {
    updateProfile({ theme: darkMode ? 'light' : 'dark' });
    updateTheme({ theme: darkMode ? 'light' : 'dark' }).then((res) => {
      updateProfile({ theme: res?.theme });
    }).catch((err) => {
      toast.error(err?.error);
    });
  };

  return (
    <div className={`sm:ml-70 fixed top-0 left-0 right-0 z-40 ${darkMode ? 'bg-gray-900' : 'bg-white'} border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} px-4 lg:px-6 py-4`}>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
        <div className='w-full md:w-auto flex items-center justify-between'>
          <div>
            <h3 className='text-2xl font-bold mb-2'>Calendar & Schedule</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your tasks, goals, and events in one place
            </p>
          </div>
          {/* Hamburger icon visible on small screens */}
          <button
            className={`sm:hidden ml-2 p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            onClick={handleSidebarToggle}
            aria-label='Toggle sidebar'
          >
            {showNavbar ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
          </button>
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex rounded-lg border border-gray-300 overflow-hidden'>
            <button className='px-4 py-2 bg-primary-500 text-white text-sm font-medium'>Month</button>
            <button className={`px-4 py-2 text-sm font-medium ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}>Week</button>
            <button className={`px-4 py-2 text-sm font-medium ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}>Day</button>
          </div>
          <button className='flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors'>
            <Plus className='w-4 h-4' />
            <span className='hidden sm:inline'>Add Event</span>
          </button>
          <button
            onClick={updateColorTheme}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            {darkMode ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;