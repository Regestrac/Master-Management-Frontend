import { useProfileStore } from 'stores/profileStore';

const AppreanceSettings = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <h4 className='text-xl font-bold mb-6 flex items-center'>
        <span className='text-2xl mr-3'>🎨</span>
        Appearance & Themes
      </h4>

      <div className='space-y-6'>
        {/* Theme Selection */}
        <div>
          <h5 className='font-semibold mb-4'>Theme</h5>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <button className={`p-4 rounded-lg border-2 transition-all ${!darkMode
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-purple-500'}`}
            >
              <div className='w-full h-20 bg-white border border-gray-300 rounded mb-3 flex items-center justify-center'>
                <div className='w-8 h-8 bg-gray-200 rounded' />
              </div>
              <span className='text-sm font-medium'>Light</span>
            </button>
            <button className={`p-4 rounded-lg border-2 transition-all ${darkMode
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-purple-500'}`}
            >
              <div className='w-full h-20 bg-gray-800 border border-gray-600 rounded mb-3 flex items-center justify-center'>
                <div className='w-8 h-8 bg-gray-600 rounded' />
              </div>
              <span className='text-sm font-medium'>Dark</span>
            </button>
            <button className='p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 transition-all'>
              <div className='w-full h-20 bg-gradient-to-r from-white to-gray-800 border border-gray-400 rounded mb-3 flex items-center justify-center'>
                <div className='w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-600 rounded' />
              </div>
              <span className='text-sm font-medium'>Auto</span>
            </button>
          </div>
        </div>

        {/* Color Scheme */}
        <div>
          <h5 className='font-semibold mb-4'>Accent Color</h5>
          <div className='grid grid-cols-6 md:grid-cols-8 gap-3'>
            {[
              { name: 'Purple', color: '#A855F7', active: true },
              { name: 'Blue', color: '#3B82F6' },
              { name: 'Green', color: '#10B981' },
              { name: 'Red', color: '#EF4444' },
              { name: 'Orange', color: '#F59E0B' },
              { name: 'Pink', color: '#EC4899' },
              { name: 'Indigo', color: '#6366F1' },
              { name: 'Teal', color: '#14B8A6' },
              { name: 'Cyan', color: '#06B6D4' },
              { name: 'Emerald', color: '#059669' },
              { name: 'Lime', color: '#65A30D' },
              { name: 'Yellow', color: '#EAB308' },
              { name: 'Amber', color: '#D97706' },
              { name: 'Rose', color: '#F43F5E' },
              { name: 'Fuchsia', color: '#D946EF' },
              { name: 'Violet', color: '#8B5CF6' },
            ].map((colorOption, index) => (
              <button
                key={index}
                className={`w-12 h-12 rounded-lg border-2 transition-all ${colorOption.active
                  ? 'border-gray-900 dark:border-white scale-110'
                  : 'border-gray-300 dark:border-gray-600 hover:scale-105'}`}
                style={{ backgroundColor: colorOption.color }}
                title={colorOption.name}
              >
                {colorOption.active && (
                  <svg className='w-6 h-6 text-white mx-auto' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Font Settings */}
        <div>
          <h5 className='font-semibold mb-4'>Typography</h5>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Font Family</label>
              <select
                className={`w-full px-4 py-3 rounded-lg border ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                defaultValue='inter'
              >
                <option value='inter'>Inter (Default)</option>
                <option value='roboto'>Roboto</option>
                <option value='open-sans'>Open Sans</option>
                <option value='lato'>Lato</option>
                <option value='source-sans'>Source Sans Pro</option>
                <option value='system'>System Default</option>
                <option value='georgia'>Georgia (Serif)</option>
                <option value='times'>Times New Roman (Serif)</option>
                <option value='monaco'>Monaco (Monospace)</option>
                <option value='fira-code'>Fira Code (Monospace)</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Font Size: 14px
              </label>
              <input
                type='range'
                min='12'
                max='20'
                defaultValue='14'
                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
              />
              <div className='flex justify-between text-xs text-gray-500 mt-1'>
                <span>12px</span>
                <span>16px</span>
                <span>20px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Settings */}
        <div>
          <h5 className='font-semibold mb-4'>Layout & Spacing</h5>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Compact Mode</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Reduce spacing and padding for more content
                </p>
              </div>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors'>
                <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1' />
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Show Sidebar</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Display navigation sidebar
                </p>
              </div>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h6 className='font-medium'>Show Breadcrumbs</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Display navigation breadcrumbs
                </p>
              </div>
              <button className='relative inline-flex h-6 w-11 items-center rounded-full bg-purple-500 transition-colors'>
                <span className='inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6' />
              </button>
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Sidebar Width: 256px
              </label>
              <input
                type='range'
                min='200'
                max='400'
                defaultValue='256'
                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
              />
              <div className='flex justify-between text-xs text-gray-500 mt-1'>
                <span>200px</span>
                <span>300px</span>
                <span>400px</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppreanceSettings;