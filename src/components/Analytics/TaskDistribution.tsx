import { useProfileStore } from 'stores/profileStore';

const TaskDistribution = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <div className='mb-6'>
        <h4 className='text-xl font-bold mb-1'>Task Distribution</h4>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tasks by category this month</p>
      </div>

      {/* Donut Chart Placeholder */}
      <div className='flex items-center justify-center mb-6'>
        <div className='relative w-40 h-40'>
          <svg className='w-40 h-40 transform -rotate-90' viewBox='0 0 100 100'>
            {/* Background circle */}
            <circle cx='50' cy='50' r='35' stroke={darkMode ? '#374151' : '#E5E7EB'} strokeWidth='8' fill='none' />

            {/* Development - 40% */}
            <circle
              cx='50'
              cy='50'
              r='35'
              stroke='#8B5CF6'
              strokeWidth='8'
              fill='none'
              strokeDasharray='87.96'
              strokeDashoffset='0'
              strokeLinecap='round'
            />

            {/* Design - 25% */}
            <circle
              cx='50'
              cy='50'
              r='35'
              stroke='#06B6D4'
              strokeWidth='8'
              fill='none'
              strokeDasharray='54.98'
              strokeDashoffset='-87.96'
              strokeLinecap='round'
            />

            {/* Meeting - 20% */}
            <circle
              cx='50'
              cy='50'
              r='35'
              stroke='#10B981'
              strokeWidth='8'
              fill='none'
              strokeDasharray='43.98'
              strokeDashoffset='-142.94'
              strokeLinecap='round'
            />

            {/* Others - 15% */}
            <circle
              cx='50'
              cy='50'
              r='35'
              stroke='#F59E0B'
              strokeWidth='8'
              fill='none'
              strokeDasharray='32.99'
              strokeDashoffset='-186.92'
              strokeLinecap='round'
            />
          </svg>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='text-center'>
              <div className='text-2xl font-bold'>156</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Tasks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className='space-y-3'>
        {[
          { label: 'Development', value: '40%', count: '62', color: '#8B5CF6' },
          { label: 'Design', value: '25%', count: '39', color: '#06B6D4' },
          { label: 'Meetings', value: '20%', count: '31', color: '#10B981' },
          { label: 'Others', value: '15%', count: '24', color: '#F59E0B' },
        ].map((item, index) => (
          <div key={index} className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='w-3 h-3 rounded-full' style={{ backgroundColor: item.color }} />
              <span className='text-sm font-medium'>{item.label}</span>
            </div>
            <div className='flex items-center space-x-2 text-sm'>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{item.count}</span>
              <span className='font-medium'>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDistribution;