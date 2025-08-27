import { useProfileStore } from 'stores/profileStore';

const AdvancedSettings = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <h4 className='text-xl font-bold mb-6 flex items-center'>
        <span className='text-2xl mr-3'>🔧</span>
        Advanced Settings
      </h4>

      <div className='space-y-6'>
        {/* Performance Settings */}
        <div>
          <h5 className='font-semibold mb-4'>Performance & Memory</h5>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Hardware Acceleration</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Use GPU acceleration for better performance
                </p>
              </div>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Background Sync</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Continue syncing when app is in background
                </p>
              </div>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
              </button>
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Cache Size: 500 MB
              </label>
              <input
                type='range'
                min='100'
                max='2000'
                defaultValue='500'
                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
              />
              <div className='flex justify-between text-xs text-gray-500 mt-1'>
                <span>100MB</span>
                <span>1GB</span>
                <span>2GB</span>
              </div>
            </div>
            <button className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'>
              Clear Cache
            </button>
          </div>
        </div>

        {/* Developer Settings */}
        <div>
          <h5 className='font-semibold mb-4'>Developer & Debug</h5>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Debug Mode</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Enable debug logging and detailed error messages
                </p>
              </div>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors'>
                <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Beta Features</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Enable experimental features and early access
                </p>
              </div>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors'>
                <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Analytics & Telemetry</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Send anonymous usage data to help improve the app
                </p>
              </div>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
              </button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <button className='flex flex-col items-center p-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors'>
                <svg className='w-8 h-8 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
                <span className='text-sm font-medium'>Export Logs</span>
              </button>
              <button className='flex flex-col items-center p-4 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors'>
                <svg className='w-8 h-8 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' />
                </svg>
                <span className='text-sm font-medium'>Run Diagnostics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Experimental Features */}
        <div>
          <h5 className='font-semibold mb-4'>Experimental Features</h5>
          <div className='space-y-4'>
            <div className={`p-4 rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
              <div className='flex items-center space-x-3 mb-3'>
                <span className='text-2xl'>🤖</span>
                <div>
                  <h6 className='font-medium'>AI Task Assistant</h6>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    AI-powered task creation and management (Beta)
                  </p>
                </div>
                <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors ml-auto'>
                  <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
                </button>
              </div>
            </div>
            <div className={`p-4 rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
              <div className='flex items-center space-x-3 mb-3'>
                <span className='text-2xl'>📊</span>
                <div>
                  <h6 className='font-medium'>Advanced Analytics</h6>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Detailed productivity insights and predictions (Alpha)
                  </p>
                </div>
                <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors ml-auto'>
                  <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
                </button>
              </div>
            </div>
            <div className={`p-4 rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
              <div className='flex items-center space-x-3 mb-3'>
                <span className='text-2xl'>👥</span>
                <div>
                  <h6 className='font-medium'>Team Collaboration</h6>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Share projects and collaborate in real-time (Coming Soon)
                  </p>
                </div>
                <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors ml-auto opacity-50 cursor-not-allowed'>
                  <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <h5 className='font-semibold mb-4 text-red-500'>⚠️ Danger Zone</h5>
          <div className={`p-4 rounded-lg border-2 border-red-500 ${darkMode ? 'bg-red-900/10' : 'bg-red-50'}`}>
            <div className='space-y-4'>
              <div>
                <h6 className='font-medium text-red-500 mb-2'>Reset All Settings</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                  This will reset all settings to their default values. This action cannot be undone.
                </p>
                <button className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'>
                  Reset Settings
                </button>
              </div>
              <div className='border-t border-red-300 pt-4'>
                <h6 className='font-medium text-red-500 mb-2'>Delete All Data</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                  Permanently delete all your tasks, goals, and data. This action cannot be undone.
                </p>
                <button className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'>
                  Delete All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;