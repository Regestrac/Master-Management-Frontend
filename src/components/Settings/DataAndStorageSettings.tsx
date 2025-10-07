import { useEffect, useRef, useState } from 'react';

import { toast } from 'react-toastify';

import { ANALYTICS_RETENTION_OPTIONS, TASK_RETENTION_OPTIONS } from 'helpers/configs';

import { useSettingsStore } from 'stores/settingsStore';

import { getStorageUsage } from 'services/settings';

import SelectField from 'components/Shared/SelectField';
import Switch from 'components/Shared/Switch';

type StorageUsageResponse = {
  total_bytes: number;
  tasks_bytes: number;
  goals_bytes: number;
  workspaces_bytes: number;
  focus_bytes: number;
};

// Helper function to format bytes to human-readable format
const formatBytes = (bytes: number): string => {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const DataAndStorageSettings = () => {
  const [storageData, setStorageData] = useState<StorageUsageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const shouldFetchStorageUsageRef = useRef(true);

  useEffect(() => {
    if (shouldFetchStorageUsageRef.current) {
      setIsLoading(true);
      getStorageUsage().then((res) => {
        setStorageData(res);
      }).catch((err) => {
        toast.error(err.message || 'Failed to fetch storage usage!');
      }).finally(() => {
        setIsLoading(false);
      });
      shouldFetchStorageUsageRef.current = false;
    }
  }, []);

  // Calculate storage breakdown
  const totalBytes = storageData?.total_bytes || 0;
  const tasksBytes = storageData?.tasks_bytes || 0;
  const goalsBytes = storageData?.goals_bytes || 0;
  const workspacesBytes = storageData?.workspaces_bytes || 0;

  // Calculate "others" as the difference
  const othersBytes = totalBytes - (tasksBytes + goalsBytes + workspacesBytes);

  // Calculate percentages
  const calculatePercentage = (bytes: number) => totalBytes > 0 ? (bytes / totalBytes) * 100 : 0;

  // Assume 100 MB storage limit (you can adjust this or make it dynamic)
  const storageLimitBytes = 10 * 1024 * 1024; // 10 MB
  const storageUsedPercentage = (totalBytes / storageLimitBytes) * 100;

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
          {isLoading ? (
            <div className='space-y-4'>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'} animate-pulse`}>
                <div className='h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2' />
                <div className='h-3 bg-gray-300 dark:bg-gray-600 rounded' />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'} animate-pulse`}>
                    <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2' />
                    <div className='h-1 bg-gray-300 dark:bg-gray-600 rounded' />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='space-y-4'>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                <div className='flex items-center justify-between mb-2'>
                  <span className='font-medium'>Total Storage Used</span>
                  <span className='text-lg font-bold'>
                    {formatBytes(totalBytes)}
                    &nbsp;/&nbsp;
                    {formatBytes(storageLimitBytes)}
                  </span>
                </div>
                <div className={`w-full h-3 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                  <div
                    className='h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300'
                    style={{ width: `${Math.min(storageUsedPercentage, 100)}%` }}
                  />
                </div>
                <div className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                  {storageUsedPercentage.toFixed(2)}
                  % of storage used
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {[
                  { label: 'Tasks', size: formatBytes(tasksBytes), percentage: calculatePercentage(tasksBytes), color: 'bg-blue-500', bytes: tasksBytes },
                  { label: 'Goals', size: formatBytes(goalsBytes), percentage: calculatePercentage(goalsBytes), color: 'bg-green-500', bytes: goalsBytes },
                  { label: 'Workspaces', size: formatBytes(workspacesBytes), percentage: calculatePercentage(workspacesBytes), color: 'bg-purple-500', bytes: workspacesBytes },
                  { label: 'Others', size: formatBytes(othersBytes), percentage: calculatePercentage(othersBytes), color: 'bg-pink-500', bytes: othersBytes },
                ].filter((item) => item.bytes > 0).map((item, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center space-x-2'>
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className='text-sm font-medium'>{item.label}</span>
                      </div>
                      <span className='text-sm font-medium'>{item.size}</span>
                    </div>
                    <div className={`w-full h-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full`}>
                      <div className={`h-1 ${item.color} rounded-full transition-all duration-300`} style={{ width: `${item.percentage}%` }} />
                    </div>
                    <div className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                      {item.percentage.toFixed(1)}
                      % of total
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Backup Settings */}
        <div>
          <h5 className='font-semibold mb-4'>Backup & Sync</h5>
          <div className='space-y-4'>
            <Switch
              name='cloudSync'
              label='Cloud Sync'
              description='Sync data across all your devices'
            />
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
                options={TASK_RETENTION_OPTIONS}
                isMulti={false}
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Analytics Data Retention</label>
              <SelectField
                name='analyticsRetention'
                options={ANALYTICS_RETENTION_OPTIONS}
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