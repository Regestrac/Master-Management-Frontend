import { useSettingsStore } from 'stores/settingsStore';

import Switch from 'components/Shared/Switch';

type NotificationSettingType = {
  id: string;
  name: string;
  title: string;
  description: string;
  enabled: boolean;
  frequency: string;
};

const notifications: NotificationSettingType[] = [
  {
    id: 'task-reminders',
    name: 'taskReminder',
    title: 'Task Reminders',
    description: 'Get notified when tasks are due',
    enabled: true,
    frequency: 'immediate',
  },
  {
    id: 'goal-progress',
    name: 'goalProgress',
    title: 'Goal Progress Updates',
    description: 'Weekly summaries of your goal progress',
    enabled: true,
    frequency: 'weekly',
  },
  {
    id: 'focus-session-breaks',
    name: 'sessionBreaks',
    title: 'Focus Session Breaks',
    description: 'Reminders to take breaks during focus sessions',
    enabled: true,
    frequency: 'session',
  },
  {
    id: 'daily-summary',
    name: 'dailySummary',
    title: 'Daily Summary',
    description: 'End-of-day productivity report',
    enabled: true,
    frequency: 'daily',
  },
  {
    id: 'streak-milestones',
    name: 'milestone',
    title: 'Streak Milestones',
    description: 'Celebrate your productivity streaks',
    enabled: true,
    frequency: 'milestone',
  },
  {
    id: 'new-features',
    name: 'newFeature',
    title: 'New Features',
    description: 'Updates about new Master Management features',
    enabled: true,
    frequency: 'every release',
  },
];

const NotificationSettings = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <h4 className='text-xl font-bold mb-6'>Notification Settings</h4>

      <div className='space-y-4'>
        {notifications.map((notification) => (
          <div key={notification.id} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
            <div className='flex items-start justify-between'>
              <div className='flex-1 pr-4'>
                <h6 className='font-medium'>{notification.title}</h6>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {notification.description}
                </p>
                <div className='mt-2'>
                  <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                    {notification.frequency}
                  </span>
                </div>
              </div>
              <Switch
                name={notification?.name}
                className='mt-1'
                disabled={!notification?.enabled}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;