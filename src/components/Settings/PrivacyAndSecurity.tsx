import { useSettingsStore } from 'stores/settingsStore';

import Switch from 'components/Shared/Switch';

const PrivacyAndSecurity = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <h4 className='text-xl font-bold mb-6'>Privacy & Security</h4>

      <div className='space-y-6'>
        {/* Password Section */}
        <div>
          <h5 className='font-semibold mb-4'>Password & Authentication</h5>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Password</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Last changed 3 months ago
                </p>
              </div>
              <button className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm'>
                Change Password
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Two-Factor Authentication</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Add an extra layer of security
                </p>
              </div>
              <button className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm'>
                Enable 2FA
              </button>
            </div>
          </div>
        </div>

        {/* Data Privacy */}
        <div>
          <h5 className='font-semibold mb-4'>Data Privacy</h5>
          <div className='space-y-4'>
            <Switch
              name='analyticsUsageData'
              label='Analytics & Usage Data'
              description='Help improve TaskFlow Pro by sharing anonymous usage data'
            />
            <Switch
              name='marketingCommunications'
              label='Marketing Communications'
              description='Receive product updates and productivity tips'
            />
            <Switch
              name='thirdPartyIntegrations'
              label='Third-party Integrations'
              description='Allow approved third-party apps to access your data'
            />
          </div>
        </div>

        {/* Data Management */}
        <div>
          <h5 className='font-semibold mb-4'>Data Management</h5>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <button className='flex flex-col items-center p-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors'>
              <svg className='w-8 h-8 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
              <span className='text-sm font-medium'>Download Data</span>
            </button>
            <button className='flex flex-col items-center p-4 border border-green-500 text-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors'>
              <svg className='w-8 h-8 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
              </svg>
              <span className='text-sm font-medium'>Import Data</span>
            </button>
            <button className='flex flex-col items-center p-4 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'>
              <svg className='w-8 h-8 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
              </svg>
              <span className='text-sm font-medium'>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyAndSecurity;