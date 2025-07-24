const spacing = {
  scale: [
    { name: '1', value: '4px', usage: 'Minimal spacing' },
    { name: '2', value: '8px', usage: 'Small spacing' },
    { name: '3', value: '12px', usage: 'Compact spacing' },
    { name: '4', value: '16px', usage: 'Standard spacing' },
    { name: '5', value: '20px', usage: 'Base grid unit' },
    { name: '6', value: '24px', usage: 'Component padding' },
    { name: '8', value: '32px', usage: 'Section spacing' },
    { name: '10', value: '40px', usage: 'Large spacing' },
    { name: '12', value: '48px', usage: 'Extra large spacing' },
  ],
};

const Spacing = ({ darkMode }: { darkMode: boolean }) => {
  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold mb-2'>Spacing System</h2>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Based on a 20px grid with 4px increments for precision
        </p>
      </div>

      {/* Spacing Scale */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
        <h3 className='text-xl font-semibold mb-4'>Spacing Scale</h3>
        <div className='space-y-6'>
          {spacing.scale.map((space, index) => (
            <div key={index} className='flex items-center space-x-4'>
              <div className='w-16 text-right'>
                <p className='text-sm font-medium'>
                  space-
                  {space.name}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {space.value}
                </p>
              </div>
              <div
                className='bg-purple-500 rounded'
                style={{ width: space.value, height: '24px' }}
              />
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {space.usage}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Layout Examples */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
        <h3 className='text-xl font-semibold mb-4'>Layout Guidelines</h3>
        <div className='space-y-6'>
          <div>
            <h4 className='font-medium mb-2'>Component Padding (24px)</h4>
            <div className={`p-6 border-2 border-dashed ${darkMode ? 'border-gray-600 bg-gray-750' : 'border-gray-300 bg-gray-50'} rounded-lg`}>
              <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded border`}>
                Sample component content
              </div>
            </div>
          </div>
          <div>
            <h4 className='font-medium mb-2'>Element Spacing (16px)</h4>
            <div className='space-y-4'>
              <div className={`p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded`}>
                Element 1
              </div>
              <div className={`p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded`}>
                Element 2
              </div>
              <div className={`p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded`}>
                Element 3
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spacing;