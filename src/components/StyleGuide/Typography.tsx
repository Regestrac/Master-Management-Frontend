const typography = {
  fontSizes: [
    { name: 'text-xs', size: '12px', usage: 'Captions, labels' },
    { name: 'text-sm', size: '14px', usage: 'Small text, metadata' },
    { name: 'text-base', size: '16px', usage: 'Body text, default' },
    { name: 'text-lg', size: '18px', usage: 'Large body text' },
    { name: 'text-xl', size: '20px', usage: 'Subheadings' },
    { name: 'text-2xl', size: '24px', usage: 'Section titles' },
    { name: 'text-3xl', size: '30px', usage: 'Page titles' },
    { name: 'text-4xl', size: '36px', usage: 'Display headings' },
  ],
  fontWeights: [
    { name: 'font-normal', weight: '400', usage: 'Body text' },
    { name: 'font-medium', weight: '500', usage: 'Emphasis' },
    { name: 'font-semibold', weight: '600', usage: 'Headings' },
    { name: 'font-bold', weight: '700', usage: 'Strong emphasis' },
  ],
};

const Typography = ({ darkMode }: { darkMode: boolean }) => {
  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold mb-2'>Typography</h2>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Clean, readable typography using Inter font family
        </p>
      </div>

      {/* Font Family */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
        <h3 className='text-xl font-semibold mb-4'>Font Family</h3>
        <div className='space-y-4'>
          <div>
            <p className='text-3xl font-normal'>Inter Regular</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Primary: Inter, system-ui, sans-serif
            </p>
          </div>
          <div>
            <p className='text-3xl font-medium'>Inter Medium</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              For emphasis and UI elements
            </p>
          </div>
          <div>
            <p className='text-3xl font-semibold'>Inter Semibold</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              For headings and important text
            </p>
          </div>
        </div>
      </div>

      {/* Font Sizes */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
        <h3 className='text-xl font-semibold mb-4'>Font Sizes</h3>
        <div className='space-y-4'>
          {typography.fontSizes.map((size, index) => (
            <div key={index} className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <p style={{ fontSize: size.size }} className='font-medium'>
                  The quick brown fox
                </p>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {size.usage}
                </span>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium'>{size.name}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {size.size}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Font Weights */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
        <h3 className='text-xl font-semibold mb-4'>Font Weights</h3>
        <div className='space-y-4'>
          {typography.fontWeights.map((weight, index) => (
            <div key={index} className='flex items-center justify-between'>
              <p style={{ fontWeight: weight.weight }} className='text-lg'>
                The quick brown fox jumps
              </p>
              <div className='text-right'>
                <p className='text-sm font-medium'>{weight.name}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {weight.weight}
                  {' '}
                  •
                  {weight.usage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Typography;