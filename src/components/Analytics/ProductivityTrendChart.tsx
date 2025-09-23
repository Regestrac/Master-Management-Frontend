import { useState } from 'react';

import { useProfileStore } from 'stores/profileStore';

const createChartPathString = (data: number[][]) => {
  return data.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
};

const dummyChartData = [[50, 140], [100, 120], [150, 100], [200, 80], [250, 90], [300, 70], [350, 85]];

const ProductivityTrendChart = () => {
  const [chartData, _setChartData] = useState(dummyChartData);

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
            <button className='px-3 py-1 bg-primary-100 text-primary-600 rounded-lg text-sm font-medium'>Hours</button>
            <button className={`px-3 py-1 rounded-lg text-sm font-medium ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Tasks</button>
          </div>
        </div>

        {/* Chart Placeholder - would use a real chart library like Chart.js or Recharts */}
        <div className='relative h-70'>
          <svg className='w-full h-full' viewBox='0 0 400 220'>
            <defs>
              <linearGradient id='chartGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                <stop offset='0%' stopColor='var(--color-primary-500)' stopOpacity='0.3' />
                <stop offset='100%' stopColor='var(--color-primary-500)' stopOpacity='0.05' />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 50, 100, 150, 200].map((y) => (
              <line key={y} x1='50' y1={y} x2='350' y2={y} stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth='1' />
            ))}
            {[50, 100, 150, 200, 250, 300, 350].map((x) => (
              <line key={x} x1={x} y1='0' x2={x} y2='200' stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth='1' />
            ))}

            {/* Chart area */}
            <path
              d={createChartPathString(chartData)}
              fill='url(#chartGradient)'
              stroke='none'
            />

            {/* Chart line */}
            <path
              d={createChartPathString(chartData)}
              fill='none'
              stroke='var(--color-primary-500)'
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'
            />

            {/* Data points */}
            {chartData.map(([x, y], index) => (
              <circle key={index} cx={x} cy={y} r='4' fill='var(--color-primary-500)' stroke='white' strokeWidth='2' />
            ))}

            {/* Y-axis labels */}
            <text x='30' y='15' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>8h</text>
            <text x='30' y='65' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>6h</text>
            <text x='30' y='115' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>4h</text>
            <text x='30' y='165' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>2h</text>

            {/* X-axis labels */}
            <text x='35' y='215' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Mon</text>
            <text x='90' y='215' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Tue</text>
            <text x='140' y='215' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Wed</text>
            <text x='190' y='215' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Thu</text>
            <text x='240' y='215' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Fri</text>
            <text x='290' y='215' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Sat</text>
            <text x='340' y='215' className={`text-xs ${darkMode ? 'fill-gray-400' : 'fill-gray-600'}`}>Sun</text>
          </svg>
        </div>

        <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex items-center space-x-4 text-sm'>
            <div className='flex items-center space-x-2'>
              <div className='w-3 h-3 bg-primary-500 rounded-full' />
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