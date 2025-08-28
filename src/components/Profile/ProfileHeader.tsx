import { useProfileStore } from 'stores/profileStore';

const ProfileHeader = () => {
  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';

  return (
    <div className='fixed top-0 left-70 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4'>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
        <div>
          <h3 className='text-2xl font-bold mb-2'>Profile & Settings</h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your account, preferences, and productivity settings
          </p>
        </div>
        <div className='flex items-center gap-4'>
          <button className='flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'>
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;