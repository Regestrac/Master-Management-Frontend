import { SelectOptionType } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';

import SelectField from 'components/Shared/SelectField';
import Switch from 'components/Shared/Switch';

// Backup frequency options
const backupFrequencyOptions: SelectOptionType[] = [
  { label: 'Real-time', value: 'realtime' },
  { label: 'Every Hour', value: 'hourly' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Manual Only', value: 'manual' },
];

// Task retention options
const taskRetentionOptions: SelectOptionType[] = [
  { label: '30 days', value: '30' },
  { label: '90 days', value: '90' },
  { label: '6 months', value: '180' },
  { label: '1 year', value: '365' },
  { label: 'Forever', value: 'forever' },
];

// Analytics retention options
const analyticsRetentionOptions: SelectOptionType[] = [
  { label: '90 days', value: '90' },
  { label: '6 months', value: '180' },
  { label: '1 year', value: '365' },
  { label: '2 years', value: '730' },
  { label: 'Forever', value: 'forever' },
];

const DataAndStorageSettings = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <h4 className='text-xl font-bold mb-6 flex items-center'>
        <span className='text-2xl mr-3'>💾</span>
        Data & Storage
      </h4>

      <div className='space-y-6'>
        {/* Storage Usage */}
        <div>
          <h5 className='font-semibold mb-4'>Storage Usage</h5>
          <div className='space-y-4'>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
              <div className='flex items-center justify-between mb-2'>
                <span className='font-medium'>Total Storage Used</span>
                <span className='text-lg font-bold'>2.4 GB / 10 GB</span>
              </div>
              <div className={`w-full h-3 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                <div className='h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full' style={{ width: '24%' }} />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {[
                { label: 'Tasks & Projects', size: '1.2 GB', percentage: 50, color: 'bg-blue-500' },
                { label: 'Goals & Milestones', size: '450 MB', percentage: 18.75, color: 'bg-green-500' },
                { label: 'Analytics Data', size: '320 MB', percentage: 13.33, color: 'bg-purple-500' },
                { label: 'Attachments', size: '280 MB', percentage: 11.67, color: 'bg-orange-500' },
                { label: 'Backups', size: '150 MB', percentage: 6.25, color: 'bg-gray-500' },
              ].map((item, index) => (
                <div key={index} className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center space-x-2'>
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className='text-sm font-medium'>{item.label}</span>
                    </div>
                    <span className='text-sm font-medium'>{item.size}</span>
                  </div>
                  <div className={`w-full h-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full`}>
                    <div className={`h-1 ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Backup Settings */}
        <div>
          <h5 className='font-semibold mb-4'>Backup & Sync</h5>
          <div className='space-y-4'>
            <Switch
              name='autoBackup'
              label='Auto Backup'
              description='Automatically backup data every day'
            />
            <Switch
              name='cloudSync'
              label='Cloud Sync'
              description='Sync data across all your devices'
            />
            <div>
              <label className='block text-sm font-medium mb-2'>Backup Frequency</label>
              <SelectField
                name='backupFrequency'
                options={backupFrequencyOptions}
                isMulti={false}
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <button className='flex flex-col items-center p-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors'>
                <svg className='w-8 h-8 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10' />
                </svg>
                <span className='text-sm font-medium'>Backup Now</span>
              </button>
              <button className='flex flex-col items-center p-4 border border-green-500 text-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors'>
                <svg className='w-8 h-8 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
                </svg>
                <span className='text-sm font-medium'>Restore</span>
              </button>
              <button className='flex flex-col items-center p-4 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors'>
                <svg className='w-8 h-8 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                </svg>
                <span className='text-sm font-medium'>Sync All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Retention */}
        <div>
          <h5 className='font-semibold mb-4'>Data Retention</h5>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Keep Completed Tasks</label>
              <SelectField
                name='taskRetention'
                options={taskRetentionOptions}
                isMulti={false}
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Analytics Data Retention</label>
              <SelectField
                name='analyticsRetention'
                options={analyticsRetentionOptions}
                isMulti={false}
              />
            </div>
            <Switch
              name='autoDeleteOldData'
              label='Auto-delete Old Data'
              description='Automatically clean up old data based on retention settings'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAndStorageSettings;