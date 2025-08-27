import { themes, useTheme } from 'context/themeHelpers';

import { useProfileStore } from 'stores/profileStore';

import GeneralSettings from 'components/Settings/GeneralSettings';
import AppreanceSettings from 'components/Settings/AppreanceSettings';
import ProductivitySettings from 'components/Settings/ProductivitySettings';
import DataAndStorageSettings from 'components/Settings/DataAndStorageSettings';
import AdvancedSettings from 'components/Settings/AdvancedSettings';
import AboutSection from 'components/Settings/AboutSection';

const Settings = () => {
  const { theme: currentTheme, setTheme } = useTheme();

  const themeOptions = Object.keys(themes) as Array<keyof typeof themes>;

  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <>
      <div>
        {/* Settings Header */}
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8'>
          <div>
            <h3 className='text-2xl font-bold mb-2'>Settings & Configuration</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Customize your TaskFlow Pro experience and manage system settings
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <button className='flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
              </svg>
              <span>Reset to Defaults</span>
            </button>
            <button className='flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
              <span>Save All Changes</span>
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Settings Navigation */}
          <div className='lg:col-span-1'>
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-4 border shadow-sm sticky top-4`}>
              <h4 className='font-semibold mb-4'>Settings Categories</h4>
              <nav className='space-y-2'>
                {[
                  { id: 'general', icon: '⚙️', label: 'General', active: true },
                  { id: 'appearance', icon: '🎨', label: 'Appearance' },
                  { id: 'productivity', icon: '⚡', label: 'Productivity' },
                  { id: 'notifications', icon: '🔔', label: 'Notifications' },
                  { id: 'data', icon: '💾', label: 'Data & Storage' },
                  { id: 'privacy', icon: '🔒', label: 'Privacy & Security' },
                  { id: 'integrations', icon: '🔗', label: 'Integrations' },
                  { id: 'advanced', icon: '🔧', label: 'Advanced' },
                  { id: 'about', icon: 'ℹ️', label: 'About' },
                ].map(({ id, icon, label, active }) => (
                  <button
                    key={id}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${active
                      ? 'bg-purple-500 text-white'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <span className='text-lg'>{icon}</span>
                    <span className='text-sm font-medium'>{label}</span>
                  </button>
                ))}
              </nav>

              <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
                <button className='w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'>
                  <span className='text-lg'>🚪</span>
                  <span className='text-sm font-medium'>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className='lg:col-span-3 space-y-8'>
            <GeneralSettings />

            <AppreanceSettings />

            <ProductivitySettings />

            <DataAndStorageSettings />

            <AdvancedSettings />

            <AboutSection />
          </div>
        </div>
      </div>

      {/* Old UI */}
      <div className='settings-container'>
        <h1 className='settings-title'>Settings</h1>

        <div className='settings-section'>
          <h2 className='settings-section-title'>Theme</h2>
          <div className='theme-grid'>
            {themeOptions.map((themeName) => (
              <div
                key={themeName}
                className={`theme-option ${currentTheme === themeName ? 'active' : ''}`}
                onClick={() => setTheme(themeName)}
              >
                <div className={`theme-preview theme-preview-${themeName}`} />
                <span className='theme-name'>
                  {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
