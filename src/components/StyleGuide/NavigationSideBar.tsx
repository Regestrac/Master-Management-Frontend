import { Dispatch, SetStateAction } from 'react';

import { Palette, Type, Grid, Layers, Target } from 'lucide-react';

const sections = [
  { id: 'colors', name: 'Colors', icon: Palette },
  { id: 'typography', name: 'Typography', icon: Type },
  { id: 'spacing', name: 'Spacing', icon: Grid },
  { id: 'components', name: 'Components', icon: Layers },
  { id: 'patterns', name: 'Patterns', icon: Target },
];

const NavigationSideBar = ({ darkMode, setActiveSection, activeSection }: { darkMode: boolean; setActiveSection: Dispatch<SetStateAction<string>>; activeSection: string; }) => {
  return (
    <div className='lg:col-span-1'>
      <div className={`sticky top-24 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
        <h3 className='font-semibold mb-4'>Style Guide Sections</h3>
        <nav className='space-y-2'>
          {sections.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeSection === id
                ? 'bg-purple-500 text-white'
                : darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Icon className='w-4 h-4' />
              <span className='text-sm font-medium'>{name}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default NavigationSideBar;