import { useState } from 'react';

import { Target, Sun, Moon } from 'lucide-react';

import NavigationSideBar from 'components/StyleGuide/NavigationSideBar';
import ColorPallet from 'components/StyleGuide/ColorPallet';
import Typography from 'components/StyleGuide/Typography';
import Spacing from 'components/StyleGuide/Spacing';
import ComponentLibrary from 'components/StyleGuide/ComponentLibrary';
import Patterns from 'components/StyleGuide/Patterns';

const StyleGuide = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('colors');

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-lg border-b`}>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                <Target className='w-6 h-6 text-white' />
              </div>
              <div>
                {/* <h1 className='text-2xl font-bold'>Title</h1> */}
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Design System Style Guide
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                {darkMode ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
              </button>
              {/* <button className='flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'>
                <Download className='w-4 h-4' />
                <span>Export Tokens</span>
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>

          <NavigationSideBar activeSection={activeSection} setActiveSection={setActiveSection} darkMode={darkMode} />

          <div className='lg:col-span-3 space-y-8'>

            {activeSection === 'colors' && <ColorPallet darkMode={darkMode} />}

            {activeSection === 'typography' && <Typography darkMode={darkMode} />}

            {activeSection === 'spacing' && <Spacing darkMode={darkMode} />}

            {activeSection === 'components' && <ComponentLibrary darkMode={darkMode} />}

            {activeSection === 'patterns' && <Patterns darkMode={darkMode} />}

          </div>

        </div>
      </div>
    </div>
  );
};

export default StyleGuide;