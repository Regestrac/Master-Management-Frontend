import { useProfileStore } from 'stores/profileStore';

const ProductivityTrendChart = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  return (
    <div className='lg:col-span-2'>
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h4 className='text-xl font-bold mb-1'>Productivity Trend</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Daily focus hours over time</p>
          </div>
          <div className='flex space-x-2'>
            <button className='px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-sm font-medium'>Hours</button>
            <button className={`px-3 py-1 rounded-lg text-sm font-medium ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Tasks</button>
          </div>
        </div>

        {/* Chart Placeholder - would use a real chart library like Chart.js or Recharts */}
        <div className='relative h-64'>
          <svg className='w-full h-full' viewBox='0 0 400 200'>
            <defs>
              <linearGradient id='chartGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                <stop offset='0%' stopColor='#A855F7' stopOpacity='0.3' />
                <stop offset='100%' stopColor='#A855F7' stopOpacity='0.05' />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 50, 100, 150, 200].map((y) => (
              <line key={y} x1='40' y1={y} x2='380' y2={y} stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth='1' />
            ))}
            {[40, 100, 160, 220, 280, 340, 380].map((x) => (
              <line key={x} x1={x} y1='0' x2={x} y2='200' stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth='1' />
            ))}

            {/* Chart area */}
            <path
              d='M40,140 L80,120 L120,100 L160,80 L200,90 L240,70 L280,85 L320,65 L360,75 L380,60'
              fill='url(#chartGradient)'
              stroke='none'
            />

            {/* Chart line */}
            <path
              d='M40,140 L80,120 L120,100 L160,80 L200,90 L240,70 L280,85 L320,65 L360,75 L380,60'
              fill='none'
              stroke='#A855F7'
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'
            />

            {/* Data points */}
            {[[40, 140], [80, 120], [120, 100], [160, 80], [200, 90], [240, 70], [280, 85], [320, 65], [360, 75], [380, 60]].map(([x, y], index) => (
              <circle key={index} cx={x} cy={y} r='4' fill='#A855F7' stroke='white' strokeWidth='2' />
            ))}

            {/* Y-axis labels */}
            <text x='30' y='15' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>8h</text>
            <text x='30' y='65' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>6h</text>
            <text x='30' y='115' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>4h</text>
            <text x='30' y='165' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>2h</text>

            {/* X-axis labels */}
            <text x='35' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Mon</text>
            <text x='95' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Tue</text>
            <text x='155' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Wed</text>
            <text x='215' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Thu</text>
            <text x='275' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Fri</text>
            <text x='335' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Sat</text>
            <text x='375' y='190' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Sun</text>
          </svg>
        </div>

        <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex items-center space-x-4 text-sm'>
            <div className='flex items-center space-x-2'>
              <div className='w-3 h-3 bg-purple-500 rounded-full' />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Focus Hours</span>
            </div>
            <span className='font-medium'>Peak: Thursday (7.2h)</span>
          </div>
          <span className='text-sm text-green-600 font-medium'>+18% vs last week</span>
        </div>
      </div>
    </div>
  );
};

export default ProductivityTrendChart;