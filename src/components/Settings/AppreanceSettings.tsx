import { SelectOptionType } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';

import SelectField from 'components/Shared/SelectField';
import Switch from 'components/Shared/Switch';
import Slider from 'components/Shared/Slider';

// Font family options
const fontFamilyOptions: SelectOptionType[] = [
  { label: 'Inter (Default)', value: 'inter' },
  { label: 'Roboto', value: 'roboto' },
  { label: 'Open Sans', value: 'open-sans' },
  { label: 'Lato', value: 'lato' },
  { label: 'Source Sans Pro', value: 'source-sans' },
  { label: 'System Default', value: 'system' },
  { label: 'Georgia (Serif)', value: 'georgia' },
  { label: 'Times New Roman (Serif)', value: 'times' },
  { label: 'Monaco (Monospace)', value: 'monaco' },
  { label: 'Fira Code (Monospace)', value: 'fira-code' },
];

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
            <SelectField
              name='fontFamily'
              label='Font Family'
              options={fontFamilyOptions}
              isMulti={false}
              placeholder='Select font family...'
            />
            <Slider
              name='fontSize'
              label='Font Size'
              min={12}
              max={20}
              step={1}
              unit='px'
              showValue={true}
              showLabels={true}
            />
          </div>
        </div>

        {/* Layout Settings */}
        <div>
          <h5 className='font-semibold mb-4'>Layout & Spacing</h5>
          <div className='space-y-4'>
            <Switch
              name='compactMode'
              label='Compact Mode'
              description='Reduce spacing and padding for more content'
            />
            <Switch
              name='showSidebar'
              label='Show Sidebar'
              description='Display navigation sidebar'
            />
            <Switch
              name='showBreadcrumbs'
              label='Show Breadcrumbs'
              description='Display navigation breadcrumbs'
            />
            <Slider
              name='sidebarWidth'
              label='Sidebar Width'
              min={200}
              max={400}
              step={10}
              unit='px'
              showValue={true}
              showLabels={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppreanceSettings;