import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useProfileStore } from 'stores/profileStore';

import { updateUserSettings } from 'services/settings';

const SettingsHeader = () => {
  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';

  const { getValues } = useFormContext();

  const handleSaveChanges = () => {
    const payload = {
      ...getValues(),
      date_format: getValues()?.dateFormat?.value,
      time_format: getValues()?.timeFormat?.value,
      first_day_of_week: getValues()?.firstDayOfWeek?.value,
      work_week: getValues()?.workWeek?.value,
    };
    updateUserSettings(payload).then((res) => {
      toast.success(res.message || 'Settings updated successfully');
    }).catch((err) => {
      toast.error(err?.error || 'Failed to update settings');
    });
  };

  return (
    <div
      className={clsx(
        'fixed top-0 left-70 right-0 z-50 border-b px-6 py-4',
        darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200',
      )}
    >
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
        <div>
          <h3 className='text-2xl font-bold mb-2'>Settings & Configuration</h3>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
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
          <button onClick={handleSaveChanges} className='flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
            <span>Save All Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsHeader;