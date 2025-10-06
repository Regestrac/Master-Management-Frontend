import { useSettingsStore } from 'stores/settingsStore';

import Switch from 'components/Shared/Switch';

const AdvancedSettings = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <h4 className='text-xl font-bold mb-6 flex items-center'>
        <span className='text-2xl mr-3'>🔧</span>
        Advanced Settings
      </h4>

      <div className='space-y-6'>
        {/* Developer Settings */}
        <div>
          <h5 className='font-semibold mb-4'>Developer & Debug</h5>
          <div className='space-y-4'>
            <Switch
              name='debugMode'
              label='Debug Mode'
              description='Enable debug logging and detailed error messages'
              disabled
            />
            <Switch
              name='betaFeatures'
              label='Beta Features'
              description='Enable experimental features and early access'
              disabled
            />
            <Switch
              name='analyticsTelemetry'
              label='Analytics & Telemetry'
              description='Send anonymous usage data to help improve the app'
              disabled
            />
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
                <div className='ml-auto'>
                  <Switch
                    name='aiTaskAssistant'
                    label=''
                    description=''
                    disabled
                  />
                </div>
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
                <div className='ml-auto'>
                  <Switch
                    name='advancedAnalytics'
                    label=''
                    description=''
                    disabled
                  />
                </div>
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
                <div className='ml-auto'>
                  <Switch
                    name='teamCollaboration'
                    label=''
                    description=''
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <h5 className='font-semibold text-2xl mb-4 text-red-500'>⚠️ Danger Zone</h5>
          <div className={`p-4 rounded-lg border-2 border-red-500 ${darkMode ? 'bg-red-900/10' : 'bg-red-50'}`}>
            <div className='space-y-4'>
              <div className='flex items-center justify-between space-x-3 mb-3'>
                <div>
                  <h6 className='font-medium text-red-500 mb-2'>Reset All Settings</h6>
                  <p className={`text-sm ${darkMode ? 'text-red-200/70' : 'text-gray-600'} mb-3`}>
                    This will reset all settings to their default values. This action cannot be undone.
                  </p>
                </div>
                <button className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center'>
                  <span className='whitespace-nowrap'>Reset Settings</span>
                </button>
              </div>
              <div className='border-t border-red-400 pt-4 flex items-center justify-between space-x-3'>
                <div>
                  <h6 className='font-medium text-red-500 mb-2'>Delete All Data</h6>
                  <p className={`text-sm ${darkMode ? 'text-red-200/70' : 'text-gray-600'} mb-3`}>
                    Permanently delete all your tasks, goals, and data. This action cannot be undone.
                  </p>
                </div>
                <button className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center'>
                  <span className='whitespace-nowrap'>Delete All Data</span>
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