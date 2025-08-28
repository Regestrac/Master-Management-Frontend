import { useState } from 'react';

import { useProfileStore } from 'stores/profileStore';

import Switch from '../Shared/Switch';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  frequency: string;
}

const NotificationSettings = () => {
  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'task-reminders',
      title: 'Task Reminders',
      description: 'Get notified when tasks are due',
      enabled: true,
      frequency: 'immediate',
    },
    {
      id: 'goal-progress',
      title: 'Goal Progress Updates',
      description: 'Weekly summaries of your goal progress',
      enabled: true,
      frequency: 'weekly',
    },
    {
      id: 'focus-session-breaks',
      title: 'Focus Session Breaks',
      description: 'Reminders to take breaks during focus sessions',
      enabled: true,
      frequency: 'session',
    },
    {
      id: 'daily-summary',
      title: 'Daily Summary',
      description: 'End-of-day productivity report',
      enabled: false,
      frequency: 'daily',
    },
    {
      id: 'streak-milestones',
      title: 'Streak Milestones',
      description: 'Celebrate your productivity streaks',
      enabled: true,
      frequency: 'milestone',
    },
    {
      id: 'new-features',
      title: 'New Features',
      description: 'Updates about new TaskFlow Pro features',
      enabled: false,
      frequency: 'as-needed',
    },
  ]);

  const handleToggle = (id: string, value: boolean) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, enabled: value } : notif,
      ),
    );
  };

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
                name={`${notification.id}-switch`}
                onChange={(value) => handleToggle(notification.id, value)}
                className='mt-1'
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;