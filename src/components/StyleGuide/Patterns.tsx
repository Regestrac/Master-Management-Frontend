import { Target, CheckSquare, BarChart3, Home, ChevronRight } from 'lucide-react';

const Patterns = ({ darkMode }: { darkMode: boolean; }) => {
  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold mb-2'>Design Patterns</h2>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Common UI patterns and interactions used throughout the application
        </p>
      </div>

      {/* Navigation Patterns */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
        <h3 className='text-xl font-semibold mb-4'>Navigation Patterns</h3>
        <div className='space-y-6'>
          <div>
            <h4 className='font-medium mb-3'>Sidebar Navigation</h4>
            <div className={`${darkMode ? 'bg-gray-750 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg p-4 border`}>
              <nav className='space-y-2'>
                {[
                  { icon: Home, label: 'Dashboard', active: true },
                  { icon: CheckSquare, label: 'Tasks', active: false },
                  { icon: Target, label: 'Goals', active: false },
                  { icon: BarChart3, label: 'Analytics', active: false },
                ].map(({ icon: Icon, label, active }, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${active
                      ? 'bg-purple-500 text-white'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Icon className='w-4 h-4' />
                    <span className='text-sm font-medium'>{label}</span>
                  </div>
                ))}
              </nav>
            </div>
          </div>
          <div>
            <h4 className='font-medium mb-3'>Breadcrumbs</h4>
            <div className='flex items-center space-x-2 text-sm'>
              <span className='text-purple-500 hover:text-purple-600 cursor-pointer'>Dashboard</span>
              <ChevronRight className='w-4 h-4 text-gray-400' />
              <span className='text-purple-500 hover:text-purple-600 cursor-pointer'>Tasks</span>
              <ChevronRight className='w-4 h-4 text-gray-400' />
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Task Details</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
        <h3 className='text-xl font-semibold mb-4'>Status Indicators</h3>
        <div className='space-y-6'>
          <div>
            <h4 className='font-medium mb-3'>Task Status</h4>
            <div className='flex flex-wrap gap-3'>
              <span className='px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-medium'>
                Pending
              </span>
              <span className='px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium'>
                In Progress
              </span>
              <span className='px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium'>
                Completed
              </span>
              <span className='px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium'>
                On Hold
              </span>
            </div>
          </div>
          <div>
            <h4 className='font-medium mb-3'>Priority Levels</h4>
            <div className='flex flex-wrap gap-3'>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-red-500 rounded-full' />
                <span className='text-sm'>High Priority</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-yellow-500 rounded-full' />
                <span className='text-sm'>Medium Priority</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-green-500 rounded-full' />
                <span className='text-sm'>Low Priority</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
        <h3 className='text-xl font-semibold mb-4'>Progress Indicators</h3>
        <div className='space-y-6'>
          <div>
            <h4 className='font-medium mb-3'>Progress Bars</h4>
            <div className='space-y-4'>
              <div>
                <div className='flex justify-between text-sm mb-1'>
                  <span>Task Progress</span>
                  <span>75%</span>
                </div>
                <div className={`w-full h-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full`}>
                  <div className='h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full' style={{ width: '75%' }} />
                </div>
              </div>
              <div>
                <div className='flex justify-between text-sm mb-1'>
                  <span>Goal Achievement</span>
                  <span>90%</span>
                </div>
                <div className={`w-full h-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full`}>
                  <div className='h-2 bg-green-500 rounded-full' style={{ width: '90%' }} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className='font-medium mb-3'>Circular Progress</h4>
            <div className='flex space-x-6'>
              <div className='relative w-16 h-16'>
                <svg className='w-16 h-16 transform -rotate-90' viewBox='0 0 100 100'>
                  <circle
                    cx='50'
                    cy='50'
                    r='40'
                    stroke={darkMode ? '#374151' : '#E5E7EB'}
                    strokeWidth='8'
                    fill='none'
                  />
                  <circle
                    cx='50'
                    cy='50'
                    r='40'
                    stroke='url(#gradient)'
                    strokeWidth='8'
                    fill='none'
                    strokeLinecap='round'
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.65)}`}
                  />
                  <defs>
                    <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                      <stop offset='0%' stopColor='#A855F7' />
                      <stop offset='100%' stopColor='#EC4899' />
                    </linearGradient>
                  </defs>
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='text-sm font-bold'>65%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading States */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
        <h3 className='text-xl font-semibold mb-4'>Loading States</h3>
        <div className='space-y-6'>
          <div>
            <h4 className='font-medium mb-3'>Spinners</h4>
            <div className='flex space-x-4'>
              <div className='w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin' />
              <div className='w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin' />
              <div className='w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin' />
            </div>
          </div>
          <div>
            <h4 className='font-medium mb-3'>Skeleton Loading</h4>
            <div className='space-y-3'>
              <div className={`h-4 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded animate-pulse`} />
              <div className={`h-4 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded animate-pulse w-3/4`} />
              <div className={`h-4 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded animate-pulse w-1/2`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patterns;