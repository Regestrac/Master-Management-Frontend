import { useProfileStore } from 'stores/profileStore';

const GeneralSettings = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <h4 className='text-xl font-bold mb-6 flex items-center'>
        <span className='text-2xl mr-3'>⚙️</span>
        General Settings
      </h4>

      <div className='space-y-6'>
        {/* Language & Region */}
        <div>
          <h5 className='font-semibold mb-4'>Language & Region</h5>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Language</label>
              <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value='en'>English</option>
                <option value='es'>Español</option>
                <option value='fr'>Français</option>
                <option value='de'>Deutsch</option>
                <option value='it'>Italiano</option>
                <option value='pt'>Português</option>
                <option value='ru'>Русский</option>
                <option value='ja'>日本語</option>
                <option value='ko'>한국어</option>
                <option value='zh'>中文</option>
                <option value='ar'>العربية</option>
                <option value='hi'>हिन्दी</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Time Zone</label>
              <select
                className={`w-full px-4 py-3 rounded-lg border ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                defaultValue='UTC+0'
              >
                <option value='UTC-12'>(UTC-12:00) Baker Island</option>
                <option value='UTC-11'>(UTC-11:00) Hawaii</option>
                <option value='UTC-10'>(UTC-10:00) Alaska</option>
                <option value='UTC-9'>(UTC-09:00) Alaska</option>
                <option value='UTC-8'>(UTC-08:00) Pacific Time</option>
                <option value='UTC-7'>(UTC-07:00) Mountain Time</option>
                <option value='UTC-6'>(UTC-06:00) Central Time</option>
                <option value='UTC-5'>(UTC-05:00) Eastern Time</option>
                <option value='UTC-4'>(UTC-04:00) Atlantic Time</option>
                <option value='UTC-3'>(UTC-03:00) Argentina</option>
                <option value='UTC-2'>(UTC-02:00) Mid-Atlantic</option>
                <option value='UTC-1'>(UTC-01:00) Azores</option>
                <option value='UTC+0'>(UTC+00:00) Greenwich Mean Time</option>
                <option value='UTC+1'>(UTC+01:00) Central European Time</option>
                <option value='UTC+2'>(UTC+02:00) Eastern European Time</option>
                <option value='UTC+3'>(UTC+03:00) Moscow Time</option>
                <option value='UTC+4'>(UTC+04:00) Gulf Time</option>
                <option value='UTC+5'>(UTC+05:00) Pakistan Time</option>
                <option value='UTC+6'>(UTC+06:00) Bangladesh Time</option>
                <option value='UTC+7'>(UTC+07:00) Indochina Time</option>
                <option value='UTC+8'>(UTC+08:00) China Standard Time</option>
                <option value='UTC+9'>(UTC+09:00) Japan Standard Time</option>
                <option value='UTC+10'>(UTC+10:00) Australian Eastern Time</option>
                <option value='UTC+11'>(UTC+11:00) Solomon Islands Time</option>
                <option value='UTC+12'>(UTC+12:00) Fiji Time</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Date Format</label>
              <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value='MM/DD/YYYY'>MM/DD/YYYY (US)</option>
                <option value='DD/MM/YYYY'>DD/MM/YYYY (UK)</option>
                <option value='YYYY-MM-DD'>YYYY-MM-DD (ISO)</option>
                <option value='DD.MM.YYYY'>DD.MM.YYYY (German)</option>
                <option value='MM-DD-YYYY'>MM-DD-YYYY</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Time Format</label>
              <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value='12'>12-hour (AM/PM)</option>
                <option value='24'>24-hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Week Settings */}
        <div>
          <h5 className='font-semibold mb-4'>Week & Calendar Settings</h5>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>First Day of Week</label>
              <select
                className={`w-full px-4 py-3 rounded-lg border ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                defaultValue='monday'
              >
                <option value='sunday'>Sunday</option>
                <option value='monday'>Monday</option>
                <option value='saturday'>Saturday</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Work Week</label>
              <select className={`w-full px-4 py-3 rounded-lg border ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value='5'>Monday to Friday (5 days)</option>
                <option value='6'>Monday to Saturday (6 days)</option>
                <option value='7'>Full Week (7 days)</option>
                <option value='custom'>Custom</option>
              </select>
            </div>
          </div>
        </div>

        {/* Startup Settings */}
        <div>
          <h5 className='font-semibold mb-4'>Startup & Defaults</h5>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Default Page on Startup</label>
              <select
                className={`w-full px-4 py-3 rounded-lg border ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                defaultValue='dashboard'
              >
                <option value='dashboard'>Dashboard</option>
                <option value='tasks'>Tasks</option>
                <option value='goals'>Goals</option>
                <option value='calendar'>Calendar</option>
                <option value='analytics'>Analytics</option>
                <option value='last'>Last Visited Page</option>
              </select>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Auto-start Focus Timer</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Automatically start timer when clicking on tasks
                </p>
              </div>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors'>
                <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Remember Window Size</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Save window dimensions and position
                </p>
              </div>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Load Recent Files</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Show recently opened projects on startup
                </p>
              </div>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;