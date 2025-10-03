import { useSettingsStore } from 'stores/settingsStore';

const QuickStats = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <h5 className='font-semibold mb-4'>This Month</h5>
      <div className='space-y-4'>
        {[
          { label: 'Tasks Completed', value: '156', change: '+23%', color: 'text-green-500' },
          { label: 'Goals Achieved', value: '5', change: '+2', color: 'text-blue-500' },
          { label: 'Focus Hours', value: '89h', change: '+12h', color: 'text-purple-500' },
          { label: 'Productivity Score', value: '87%', change: '+8%', color: 'text-orange-500' },
        ].map((stat, index) => (
          <div key={index} className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium'>{stat.label}</p>
              <p className='text-lg font-bold'>{stat.value}</p>
            </div>
            <span className={`text-sm font-medium ${stat.color}`}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;