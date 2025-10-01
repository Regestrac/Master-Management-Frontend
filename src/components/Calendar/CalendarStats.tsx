import { Clock, Flame, Target, User } from 'lucide-react';

import { useSettingsStore } from 'stores/settingsStore';

const CalendarStats = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8'>
      {[
        {
          title: 'This Week',
          value: '32h',
          subtitle: 'Total scheduled',
          trend: '+5h vs last week',
          icon: Clock,
          color: 'from-blue-500 to-blue-600',
        },
        {
          title: 'Focus Time',
          value: '18h',
          subtitle: 'Deep work blocks',
          trend: '+3h vs last week',
          icon: Target,
          color: 'from-purple-500 to-purple-600',
        },
        {
          title: 'Meetings',
          value: '8h',
          subtitle: 'Collaboration time',
          trend: '+2h vs last week',
          icon: User,
          color: 'from-green-500 to-green-600',
        },
        {
          title: 'Free Time',
          value: '14h',
          subtitle: 'Available slots',
          trend: '-2h vs last week',
          icon: Flame,
          color: 'from-orange-500 to-orange-600',
        },
      ].map(({ title, value, subtitle, trend, icon: Icon, color }, index) => (
        <div key={index} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
          <div className='flex items-center justify-between mb-4'>
            <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
              <Icon className='w-6 h-6 text-white' />
            </div>
            <div className='text-right'>
              <div className='text-2xl font-bold'>{value}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</div>
            </div>
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{subtitle}</div>
          <div className='text-xs text-green-600 font-medium'>{trend}</div>
        </div>
      ))}
    </div>
  );
};

export default CalendarStats;