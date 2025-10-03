import { useSettingsStore } from 'stores/settingsStore';

const StreaksAndAchievements = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <div className='mb-6'>
        <h4 className='text-xl font-bold mb-1'>Streaks & Achievements</h4>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your milestones and wins</p>
      </div>

      <div className='space-y-4'>
        {[
          { title: 'Current Streak', value: '12 days', icon: '🔥', color: 'text-orange-500' },
          { title: 'Longest Streak', value: '28 days', icon: '⚡', color: 'text-yellow-500' },
          { title: 'Tasks Completed', value: '847', icon: '✅', color: 'text-green-500' },
          { title: 'Goals Achieved', value: '23', icon: '🎯', color: 'text-purple-500' },
        ].map((achievement, index) => (
          <div key={index} className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <span className='text-xl'>{achievement.icon}</span>
              <span className='font-medium'>{achievement.title}</span>
            </div>
            <span className={`font-bold ${achievement.color}`}>{achievement.value}</span>
          </div>
        ))}
      </div>

      <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
        <h5 className='font-medium mb-3'>Recent Badges</h5>
        <div className='flex flex-wrap gap-2'>
          {['Week Warrior', 'Goal Crusher', 'Focus Master', 'Consistency King'].map((badge, index) => (
            <span key={index} className='inline-flex items-center px-2 py-1 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-600 rounded-full text-xs font-medium'>
              🏆
              {' '}
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreaksAndAchievements;