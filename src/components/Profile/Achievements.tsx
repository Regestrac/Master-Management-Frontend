import { useSettingsStore } from 'stores/settingsStore';

const Achievements = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <div className='flex items-center justify-between mb-4'>
        <h5 className='font-semibold'>Recent Achievements</h5>
        <button className='text-purple-500 hover:text-purple-600 text-sm font-medium'>View All</button>
      </div>
      <div className='space-y-3'>
        {[
          { title: 'Week Warrior', description: 'Completed all tasks this week', icon: '⚡', date: 'Today' },
          { title: 'Goal Crusher', description: 'Achieved 3 goals this month', icon: '🎯', date: '2 days ago' },
          { title: 'Focus Master', description: '25+ hours of deep work', icon: '🧠', date: '1 week ago' },
          { title: 'Streak King', description: '30-day activity streak', icon: '🔥', date: '2 weeks ago' },
        ].map((achievement, index) => (
          <div key={index} className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
            <div className='flex items-center space-x-3'>
              <div className='text-2xl'>{achievement.icon}</div>
              <div className='flex-1'>
                <h6 className='font-medium text-sm'>{achievement.title}</h6>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {achievement.description}
                </p>
              </div>
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {achievement.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;