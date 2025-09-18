import { useProfileStore } from 'stores/profileStore';

const MiniCalendar = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <div className='flex items-center justify-between mb-4'>
        <h4 className='font-semibold'>June 2025</h4>
        <div className='flex space-x-2'>
          <button className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
          </button>
          <button className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </button>
        </div>
      </div>

      {/* Mini Calendar Grid */}
      <div className='grid grid-cols-7 gap-1 text-center text-xs mb-2'>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className={`py-2 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {day}
          </div>
        ))}
      </div>
      <div className='grid grid-cols-7 gap-1 text-center text-xs'>
        {Array.from({ length: 35 }, (_, i) => {
          const dayNumber = i - 5; // Start from May 26
          const isCurrentMonth = dayNumber > 0 && dayNumber <= 30;
          const isToday = dayNumber === 27;
          const hasEvents = [15, 18, 22, 27, 29].includes(dayNumber);

          return (
            <button
              key={i}
              className={`relative h-8 rounded flex items-center justify-center transition-colors ${isToday
                ? 'bg-primary-500 text-white font-medium'
                : isCurrentMonth
                  ? `${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${hasEvents ? 'font-medium' : ''}`
                  : `${darkMode ? 'text-gray-600' : 'text-gray-400'}`}`}
            >
              {dayNumber > 0 ? (dayNumber <= 30 ? dayNumber : dayNumber - 30) : 26 + dayNumber}
              {hasEvents && (
                <div className='absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-secondary-500 rounded-full' />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;