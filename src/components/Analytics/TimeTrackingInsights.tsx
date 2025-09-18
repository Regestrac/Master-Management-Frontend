import { useProfileStore } from 'stores/profileStore';

const TimeTrackingInsights = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <div className='mb-6'>
        <h4 className='text-xl font-bold mb-1'>Time Insights</h4>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your productivity patterns</p>
      </div>

      {/* Peak Hours */}
      <div className='mb-6'>
        <h5 className='font-medium mb-3'>Peak Productivity Hours</h5>
        <div className='grid grid-cols-12 gap-1 mb-2'>
          {Array.from({ length: 24 }, (_, i) => {
            const hour = i;
            const intensity = hour >= 9 && hour <= 11 ? 0.9 :
              hour >= 14 && hour <= 16 ? 0.7 :
                hour >= 8 && hour <= 17 ? 0.4 : 0.1;
            return (
              <div
                key={i}
                className='h-8 rounded-sm relative group cursor-pointer transition-all hover:scale-110'
                style={{
                  backgroundColor: 'var(--color-primary-500)',
                  opacity: intensity,
                  border: darkMode ? '1px solid #374151' : '1px solid #E5E7EB',
                }}
              >
                <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity'>
                  {hour}
                  :00
                  <br />
                  {Math.round(intensity * 100)}
                  %
                </div>
              </div>
            );
          })}
        </div>
        <div className='flex justify-between text-xs text-gray-500'>
          <span>12 AM</span>
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>11 PM</span>
        </div>
      </div>

      {/* Weekly Pattern */}
      <div className='mb-6'>
        <h5 className='font-medium mb-3'>Weekly Pattern</h5>
        <div className='space-y-2'>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
            const values = [85, 92, 88, 95, 90, 45, 30];
            const value = values[index];
            return (
              <div key={day} className='flex items-center justify-between'>
                <span className='text-sm w-20'>{day.slice(0, 3)}</span>
                <div className='flex-1 mx-3'>
                  <div className={`w-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
                    <div
                      className='h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500'
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
                <span className='text-sm font-medium w-10 text-right'>
                  {value}
                  %
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-2 gap-4'>
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
          <div className='text-lg font-bold text-primary-500'>10:30 AM</div>
          <div className='text-xs text-gray-500'>Peak Hour</div>
        </div>
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
          <div className='text-lg font-bold text-green-500'>Thursday</div>
          <div className='text-xs text-gray-500'>Best Day</div>
        </div>
      </div>
    </div>
  );
};

export default TimeTrackingInsights;