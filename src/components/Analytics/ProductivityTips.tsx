import { useSettingsStore } from 'stores/settingsStore';

const ProductivityTips = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <div className='mb-6'>
        <h4 className='text-xl font-bold mb-1'>AI Insights</h4>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Personalized recommendations</p>
      </div>

      <div className='space-y-4'>
        {[
          {
            type: 'tip',
            icon: '💡',
            title: 'Optimize Your Schedule',
            message: 'Your peak productivity is 10-11 AM. Schedule important tasks during this time.',
            action: 'Schedule Now',
          },
          {
            type: 'warning',
            icon: '⚠️',
            title: 'Goal Risk Alert',
            message: 'TypeScript goal is behind schedule. Consider increasing weekly hours.',
            action: 'Adjust Goal',
          },
          {
            type: 'success',
            icon: '🎉',
            title: 'Great Progress!',
            message: 'You\'re 18% more productive than last week. Keep it up!',
            action: 'View Details',
          },
          {
            type: 'suggestion',
            icon: '🔄',
            title: 'Break Suggestion',
            message: 'Take a 15-minute break. You\'ve been focused for 2.5 hours.',
            action: 'Start Break',
          },
        ].map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-l-4 ${insight.type === 'tip' ? `border-blue-500 ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}` :
              insight.type === 'warning' ? `border-yellow-500 ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}` :
                insight.type === 'success' ? `border-green-500 ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}` :
                  `border-purple-500 ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}`}
          >
            <div className='flex items-start space-x-3'>
              <span className='text-lg'>{insight.icon}</span>
              <div className='flex-1'>
                <h6 className='font-medium text-sm mb-1'>{insight.title}</h6>
                <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{insight.message}</p>
                <button className={`text-xs font-medium px-2 py-1 rounded ${insight.type === 'tip' ? 'text-blue-600 hover:bg-blue-100' :
                  insight.type === 'warning' ? 'text-yellow-600 hover:bg-yellow-100' :
                    insight.type === 'success' ? 'text-green-600 hover:bg-green-100' :
                      'text-purple-600 hover:bg-purple-100'} transition-colors`}
                >
                  {insight.action}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductivityTips;