import clsx from 'clsx';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { toast } from 'react-toastify';

import { useNavbarStore } from 'stores/navbarStore';
import { useSettingsStore } from 'stores/settingsStore';

import { updateTheme } from 'services/settings';

type ProfileHeaderProps = {
  onSave?: () => void;
  hasChanges?: boolean;
};

const ProfileHeader = ({ onSave, hasChanges = false }: ProfileHeaderProps) => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const setShowNavbar = useNavbarStore((state) => state.setShowNavbar);
  const showNavbar = useNavbarStore((state) => state.showNavbar);

  const handleSidebarToggle = () => {
    setShowNavbar(!showNavbar);
  };

  const updateColorTheme = () => {
    updateSettings({ theme: darkMode ? 'light' : 'dark' });
    updateTheme({ theme: darkMode ? 'light' : 'dark' }).then((res) => {
      updateSettings({ theme: res?.theme });
    }).catch((err) => {
      toast.error(err?.error);
    });
  };

  return (
    <div className={clsx('fixed top-0 sm:left-70 right-0 z-50 border-b px-6 py-4', darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200')}>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
        <div className='w-full md:w-auto flex items-center justify-between'>
          <div>
            <h3 className='text-2xl font-bold mb-2'>Profile</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your account, preferences, and productivity settings
            </p>
          </div>
          {/* Hamburger icon visible on small screens */}
          <button
            className={`sm:hidden ml-2 p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            onClick={handleSidebarToggle}
            aria-label='Open sidebar'
          >
            {showNavbar ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
          </button>
        </div>
        <div className='flex items-center justify-end gap-4'>
          {hasChanges && onSave && (
            <button
              onClick={onSave}
              className='flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
              <span>Save Changes</span>
            </button>
          )}
          <button
            onClick={updateColorTheme}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            {darkMode ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
          </button>

          {/* <button className='flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12' />
            </svg>
            <span>Export Data</span>
          </button>
          <button className='flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
            </svg>
            <span>Backup</span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;