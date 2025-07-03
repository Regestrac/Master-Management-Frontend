import { CheckSquare, Clock, Flame, Trophy } from 'lucide-react';
import { useProfileStore } from 'stores/profileStore';

const userStats = {
  totalTasks: 47,
  completedToday: 8,
  currentStreak: 12,
  totalHours: 156,
};

const taskStats = [
  { icon: CheckSquare, label: 'Total Tasks', value: userStats.totalTasks, color: 'from-blue-500 to-blue-600' },
  { icon: Trophy, label: 'Completed Today', value: userStats.completedToday, color: 'from-green-500 to-green-600' },
  { icon: Flame, label: 'Current Streak', value: `${userStats.currentStreak} days`, color: 'from-orange-500 to-orange-600' },
  { icon: Clock, label: 'Total Hours', value: `${userStats.totalHours}h`, color: 'from-purple-500 to-purple-600' },
];

const TaskQuickStats = () => {
  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';

  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
      {taskStats.map(({ icon: Icon, label, value, color }, index) => (
        <div key={index} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className='flex items-center justify-between'>
            <div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>{label}</p>
              <p className='text-2xl font-bold mt-1'>{value}</p>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
              <Icon className='w-6 h-6 text-white' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskQuickStats;