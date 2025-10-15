import dayjs from 'dayjs';
import { Activity, Calendar, Clock, Target } from 'lucide-react';

import { capitalize, formatDuration, getStatusColor } from 'helpers/utils';

import { useSettingsStore } from 'stores/settingsStore';
import { useTaskStore } from 'stores/taskStore';

const TaskStatus = () => {
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  if (!taskDetails) {
    return null;
  }

  return (
    <div className={`rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
        <h3 className='text-lg font-semibold flex items-center'>
          <Activity className='w-5 h-5 mr-2' />
          Task Status
        </h3>
      </div>
      <div className='p-6 space-y-4'>
        {/* Current Status */}
        <div className='flex items-center justify-between'>
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Current Status
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(taskDetails.status)}`}>
            {taskDetails.status?.toUpperCase()}
          </span>
        </div>

        {/* Time Spent */}
        <div className='flex items-center justify-between'>
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
            <Clock className='w-4 h-4 mr-1' />
            Time Spent
          </span>
          <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatDuration(taskDetails.time_spend || 0)}
          </span>
        </div>

        {/* Created Date */}
        <div className='flex items-center justify-between'>
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
            <Calendar className='w-4 h-4 mr-1' />
            Created
          </span>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {taskDetails.created_at ? dayjs(taskDetails.created_at).format('MMM DD, YYYY') : 'N/A'}
          </span>
        </div>

        {/* Due Date */}
        {taskDetails.due_date && (
          <div className='flex items-center justify-between'>
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Due Date
            </span>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {dayjs(taskDetails.due_date).format('MMM DD, YYYY')}
            </span>
          </div>
        )}

        {/* Goal Target Info */}
        {taskDetails.type === 'goal' && (
          <>
            {taskDetails.target_value && (
              <div className='flex items-center justify-between'>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                  <Target className='w-4 h-4 mr-1' />
                  Target
                </span>
                <span className={`text-sm font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {taskDetails.target_value}
                  {' '}
                  {capitalize(taskDetails.target_type || '')}
                </span>
              </div>
            )}
            {taskDetails.target_frequency && (
              <div className='flex items-center justify-between'>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Frequency
                </span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {capitalize(taskDetails.target_frequency.replace('_', ' '))}
                </span>
              </div>
            )}
          </>
        )}

        {/* Streak */}
        <div className='flex items-center justify-between'>
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Streak
          </span>
          <span className='text-sm font-semibold text-orange-500'>
            {taskDetails.streak || 0}
            {' '}
            🔥
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskStatus;