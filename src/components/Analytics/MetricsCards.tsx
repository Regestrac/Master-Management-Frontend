import { useProfileStore } from 'stores/profileStore';

const MetricsCards = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pt-32 lg:pt-20'>
      {[
        {
          title: 'Productivity Score',
          value: '87%',
          change: '+12%',
          trend: 'up',
          icon: '📊',
          color: 'from-blue-500 to-blue-600',
          description: 'Overall productivity this week',
        },
        {
          title: 'Tasks Completed',
          value: '156',
          change: '+8',
          trend: 'up',
          icon: '✅',
          color: 'from-green-500 to-green-600',
          description: 'Tasks completed this month',
        },
        {
          title: 'Focus Time',
          value: '28.5h',
          change: '+3.2h',
          trend: 'up',
          icon: '⏱️',
          color: 'from-purple-500 to-purple-600',
          description: 'Deep work hours this week',
        },
        {
          title: 'Goal Progress',
          value: '73%',
          change: '+15%',
          trend: 'up',
          icon: '🎯',
          color: 'from-orange-500 to-orange-600',
          description: 'Average goal completion',
        },
      ].map((metric, index) => (
        <div key={index} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-200`}>
          <div className='flex items-center justify-between mb-4'>
            <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center text-xl`}>
              {metric.icon}
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${metric.trend === 'up'
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600'}`}
            >
              <svg className={`w-3 h-3 ${metric.trend === 'up' ? 'transform rotate-0' : 'transform rotate-180'}`} fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z' clipRule='evenodd' />
              </svg>
              <span>{metric.change}</span>
            </div>
          </div>
          <div>
            <h4 className='text-2xl font-bold mb-1'>{metric.value}</h4>
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metric.title}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{metric.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;