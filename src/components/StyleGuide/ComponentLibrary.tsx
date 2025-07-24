import { Target, CheckSquare, Settings, Plus, Play, Trash2, Download } from 'lucide-react';

const ComponentLibrary = ({ darkMode }: { darkMode: boolean; }) => {
  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold mb-2'>Component Library</h2>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Reusable UI components with consistent styling
        </p>
      </div>

      {/* Buttons */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
        <h3 className='text-xl font-semibold mb-4'>Buttons</h3>
        <div className='space-y-6'>
          <div>
            <h4 className='font-medium mb-3'>Primary Buttons</h4>
            <div className='flex flex-wrap gap-4'>
              <button className='px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium'>
                Primary Button
              </button>
              <button className='flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium'>
                <Plus className='w-4 h-4' />
                <span>With Icon</span>
              </button>
              <button className='px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg opacity-50 cursor-not-allowed font-medium'>
                Disabled
              </button>
            </div>
          </div>
          <div>
            <h4 className='font-medium mb-3'>Secondary Buttons</h4>
            <div className='flex flex-wrap gap-4'>
              <button className={`px-6 py-3 border-2 ${darkMode
                ? 'border-gray-600 hover:border-purple-500 hover:bg-gray-700'
                : 'border-gray-300 hover:border-purple-500 hover:bg-gray-50'} rounded-lg transition-all font-medium`}
              >
                Secondary
              </button>
              <button className={`flex items-center space-x-2 px-6 py-3 border-2 ${darkMode
                ? 'border-gray-600 hover:border-purple-500 hover:bg-gray-700'
                : 'border-gray-300 hover:border-purple-500 hover:bg-gray-50'} rounded-lg transition-all font-medium`}
              >
                <Download className='w-4 h-4' />
                <span>Download</span>
              </button>
            </div>
          </div>
          <div>
            <h4 className='font-medium mb-3'>Icon Buttons</h4>
            <div className='flex flex-wrap gap-4'>
              <button className={`p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                <Settings className='w-5 h-5' />
              </button>
              <button className='p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'>
                <Play className='w-5 h-5' />
              </button>
              <button className='p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'>
                <Trash2 className='w-5 h-5' />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Elements */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
        <h3 className='text-xl font-semibold mb-4'>Form Elements</h3>
        <div className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium mb-2'>Text Input</label>
              <input
                type='text'
                placeholder='Enter text...'
                className={`w-full px-4 py-3 border rounded-lg ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Select Dropdown</label>
              <select className={`w-full px-4 py-3 border rounded-lg ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>Textarea</label>
            <textarea
              placeholder='Enter description...'
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div className='space-y-2'>
            <label className='flex items-center'>
              <input
                type='checkbox'
                className='w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded'
              />
              <span className='ml-2 text-sm'>Checkbox option</span>
            </label>
            <label className='flex items-center'>
              <input
                type='radio'
                name='radio-group'
                className='w-4 h-4 text-purple-600 focus:ring-purple-500'
              />
              <span className='ml-2 text-sm'>Radio option 1</span>
            </label>
            <label className='flex items-center'>
              <input
                type='radio'
                name='radio-group'
                className='w-4 h-4 text-purple-600 focus:ring-purple-500'
              />
              <span className='ml-2 text-sm'>Radio option 2</span>
            </label>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
        <h3 className='text-xl font-semibold mb-4'>Cards</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className={`${darkMode ? 'bg-gray-750 border-gray-600' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow`}>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center'>
                <CheckSquare className='w-4 h-4 text-white' />
              </div>
              <h4 className='font-semibold'>Task Card</h4>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              This is a sample task card with standard styling and spacing.
            </p>
            <div className='flex justify-between items-center'>
              <span className='px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium'>
                Completed
              </span>
              <button className='text-purple-500 hover:text-purple-600 text-sm font-medium'>
                View Details
              </button>
            </div>
          </div>
          <div className={`${darkMode ? 'bg-gray-750 border-gray-600' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow`}>
            <div className='flex items-center space-x-3 mb-4'>
              <div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center'>
                <Target className='w-4 h-4 text-white' />
              </div>
              <h4 className='font-semibold'>Goal Card</h4>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Sample goal card with progress indicator and actions.
            </p>
            <div className='space-y-3'>
              <div className={`w-full h-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full`}>
                <div className='h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full' style={{ width: '75%' }} />
              </div>
              <div className='flex justify-between text-sm'>
                <span>75% Complete</span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>15 days left</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentLibrary;