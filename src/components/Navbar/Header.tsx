import { Bell, Moon, Search, Sun } from 'lucide-react';
import { useThemeStore } from 'stores/themeStore';

const Header = () => {
  const darkMode = useThemeStore((state) => state.theme) === 'dark';
  const updateThemeState = useThemeStore((state) => state.updateTheme);

  const UpdateTheme = () => {
    updateThemeState(darkMode ? 'light' : 'dark');
  };

  return (
    <div className='flex items-center justify-between mb-8'>
      <div>
        <h2 className='text-3xl font-bold mb-2'>Good Morning, Alex! 👋</h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>You have 5 tasks scheduled for today</p>
      </div>

      <div className='flex items-center space-x-4'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
          <input
            type='text'
            placeholder='Search tasks...'
            className={`pl-10 pr-4 py-2 rounded-lg border ${darkMode
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
        </div>
        <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
          <Bell className='w-5 h-5' />
        </button>
        <button
          onClick={UpdateTheme}
          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
        >
          {darkMode ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
        </button>
      </div>
    </div>
  );
};

export default Header;