import { copyToClipboard } from 'src/helpers/utils';

const colorPalette = {
  primary: {
    name: 'Primary Purple',
    colors: [
      { name: 'purple-50', value: '#F3F4F6', hex: '#F3F4F6' },
      { name: 'purple-100', value: '#E5E7EB', hex: '#E5E7EB' },
      { name: 'purple-200', value: '#D1D5DB', hex: '#D1D5DB' },
      { name: 'purple-300', value: '#9CA3AF', hex: '#9CA3AF' },
      { name: 'purple-400', value: '#6B7280', hex: '#6B7280' },
      { name: 'purple-500', value: '#A855F7', hex: '#A855F7' },
      { name: 'purple-600', value: '#9333EA', hex: '#9333EA' },
      { name: 'purple-700', value: '#7C3AED', hex: '#7C3AED' },
      { name: 'purple-800', value: '#6D28D9', hex: '#6D28D9' },
      { name: 'purple-900', value: '#5B21B6', hex: '#5B21B6' },
    ],
  },
  secondary: {
    name: 'Accent Pink',
    colors: [
      { name: 'pink-50', value: '#FDF2F8', hex: '#FDF2F8' },
      { name: 'pink-100', value: '#FCE7F3', hex: '#FCE7F3' },
      { name: 'pink-200', value: '#FBCFE8', hex: '#FBCFE8' },
      { name: 'pink-300', value: '#F9A8D4', hex: '#F9A8D4' },
      { name: 'pink-400', value: '#F472B6', hex: '#F472B6' },
      { name: 'pink-500', value: '#EC4899', hex: '#EC4899' },
      { name: 'pink-600', value: '#DB2777', hex: '#DB2777' },
      { name: 'pink-700', value: '#BE185D', hex: '#BE185D' },
      { name: 'pink-800', value: '#9D174D', hex: '#9D174D' },
      { name: 'pink-900', value: '#831843', hex: '#831843' },
    ],
  },
  semantic: {
    name: 'Semantic Colors',
    colors: [
      { name: 'success', value: '#10B981', hex: '#10B981', usage: 'Success states, completion' },
      { name: 'warning', value: '#F59E0B', hex: '#F59E0B', usage: 'Warnings, alerts' },
      { name: 'error', value: '#EF4444', hex: '#EF4444', usage: 'Errors, destructive actions' },
      { name: 'info', value: '#3B82F6', hex: '#3B82F6', usage: 'Information, links' },
    ],
  },
  neutral: {
    name: 'Neutral Grays',
    colors: [
      { name: 'gray-50', value: '#F9FAFB', hex: '#F9FAFB' },
      { name: 'gray-100', value: '#F3F4F6', hex: '#F3F4F6' },
      { name: 'gray-200', value: '#E5E7EB', hex: '#E5E7EB' },
      { name: 'gray-300', value: '#D1D5DB', hex: '#D1D5DB' },
      { name: 'gray-400', value: '#9CA3AF', hex: '#9CA3AF' },
      { name: 'gray-500', value: '#6B7280', hex: '#6B7280' },
      { name: 'gray-600', value: '#4B5563', hex: '#4B5563' },
      { name: 'gray-700', value: '#374151', hex: '#374151' },
      { name: 'gray-800', value: '#1F2937', hex: '#1F2937' },
      { name: 'gray-900', value: '#111827', hex: '#111827' },
    ],
  },
};

const ColorPallet = ({ darkMode }: { darkMode: boolean; }) => {
  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold mb-2'>Color System</h2>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Our color palette reflects professionalism and productivity
        </p>
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Click to copy hex. Double click to copy name.
        </p>
      </div>

      {Object.entries(colorPalette).map(([key, palette]) => (
        <div
          key={key}
          className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}
        >
          <h3 className='text-xl font-semibold mb-4'>{palette.name}</h3>
          <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
            {palette.colors.map((color, index) => (
              <div key={index} className='space-y-2'>
                <div
                  className='h-20 rounded-lg border shadow-sm cursor-pointer hover:scale-105 transition-transform'
                  style={{ backgroundColor: color.hex }}
                  onClick={() => copyToClipboard(color.hex)}
                  onDoubleClick={() => copyToClipboard(color.name)}
                  title='Click to copy hex. Double click to copy name.'
                />
                <div className='text-center'>
                  <p className='text-sm font-medium'>{color.name}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {color.hex}
                  </p>
                  {/* {color.usage && (
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {color.usage}
                    </p>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Gradients */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
        <h3 className='text-xl font-semibold mb-4'>Brand Gradients</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <div className='h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg' />
            <p className='text-sm font-medium'>Primary Gradient</p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              from-purple-500 to-pink-500
            </p>
          </div>
          <div className='space-y-2'>
            <div className='h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg' />
            <p className='text-sm font-medium'>Secondary Gradient</p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              from-blue-500 to-cyan-500
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPallet;