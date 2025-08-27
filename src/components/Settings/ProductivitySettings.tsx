import { useProfileStore } from 'stores/profileStore';

const ProductivitySettings = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <h4 className='text-xl font-bold mb-6 flex items-center'>
        <span className='text-2xl mr-3'>⚡</span>
        Productivity & Focus
      </h4>

      <div className='space-y-6'>
        {/* Pomodoro Settings */}
        <div>
          <h5 className='font-semibold mb-4'>Pomodoro Timer</h5>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Focus Duration: 25 minutes
              </label>
              <input
                type='range'
                min='15'
                max='90'
                defaultValue='25'
                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
              />
              <div className='flex justify-between text-xs text-gray-500 mt-1'>
                <span>15min</span>
                <span>45min</span>
                <span>90min</span>
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Short Break: 5 minutes
              </label>
              <input
                type='range'
                min='5'
                max='15'
                defaultValue='5'
                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
              />
              <div className='flex justify-between text-xs text-gray-500 mt-1'>
                <span>5min</span>
                <span>10min</span>
                <span>15min</span>
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Long Break: 30 minutes
              </label>
              <input
                type='range'
                min='15'
                max='60'
                defaultValue='30'
                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
              />
              <div className='flex justify-between text-xs text-gray-500 mt-1'>
                <span>15min</span>
                <span>30min</span>
                <span>60min</span>
              </div>
            </div>
          </div>
          <div className='mt-4 space-y-3'>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Auto-start Breaks</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Automatically start break timer after focus sessions
                </p>
              </div>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Long Break After</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Take a long break after 4 focus sessions
                </p>
              </div>
              <select
                className={`px-3 py-2 rounded-lg border ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                defaultValue='4'
              >
                <option value='2'>2 sessions</option>
                <option value='3'>3 sessions</option>
                <option value='4'>4 sessions</option>
                <option value='5'>5 sessions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Goal Settings */}
        <div>
          <h5 className='font-semibold mb-4'>Goal Management</h5>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Default Goal Duration</label>
              <select
                className={`w-full px-4 py-3 rounded-lg border ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                defaultValue='90'
              >
                <option value='30'>30 days</option>
                <option value='60'>60 days</option>
                <option value='90'>90 days</option>
                <option value='180'>6 months</option>
                <option value='365'>1 year</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Weekly Target Hours</label>
              <select
                className={`w-full px-4 py-3 rounded-lg border ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                defaultValue='10'
              >
                <option value='5'>5 hours</option>
                <option value='10'>10 hours</option>
                <option value='15'>15 hours</option>
                <option value='20'>20 hours</option>
                <option value='25'>25 hours</option>
              </select>
            </div>
          </div>
          <div className='mt-4 space-y-3'>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Smart Goal Suggestions</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Get AI-powered suggestions for new goals
                </p>
              </div>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Progress Reminders</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Get weekly progress check-ins for active goals
                </p>
              </div>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
              </button>
            </div>
          </div>
        </div>

        {/* Automation Settings */}
        <div>
          <h5 className='font-semibold mb-4'>Automation & AI</h5>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Smart Task Scheduling</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Automatically schedule tasks based on priority and deadlines
                </p>
              </div>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Auto-categorize Tasks</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Use AI to categorize new tasks automatically
                </p>
              </div>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors'>
                <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Productivity Insights</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Generate weekly productivity reports and insights
                </p>
              </div>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Smart Time Blocking</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Automatically create time blocks based on your schedule
                </p>
              </div>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors'>
                <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivitySettings;