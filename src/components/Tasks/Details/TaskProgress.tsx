import { formatDuration } from 'helpers/utils';

import { useSettingsStore } from 'stores/settingsStore';
import { useTaskStore } from 'stores/taskStore';

const getEstimatedTime = (targetValue?: number | null, targetType?: string | null) => {
  if (!targetValue || !targetType) {
    return { value: targetValue || 0, label: targetValue || '0' };
  }

  if (targetType === 'hours') {
    return { value: targetValue * 60 * 60, label: `${targetValue.toFixed(2)}h` };
  }

  if (targetType === 'days') {
    return { value: targetValue * 60 * 60 * 24, label: `${targetValue.toFixed(2)}d` };
  }

  if (targetType === 'weeks') {
    return { value: targetValue * 60 * 60 * 24 * 7, label: `${targetValue.toFixed(2)}w` };
  }

  if (targetType === 'months') {
    return { value: targetValue * 60 * 60 * 24 * 30, label: `${targetValue.toFixed(2)}m` };
  }

  if (targetType === 'percentage') {
    return { value: targetValue, label: `${targetValue.toFixed(2)}%` };
  }

  return { value: targetValue, label: targetValue };
};

const getTaskProgress = (progress: number, total: number, targetType?: string | null) => {
  let taskProgress = Math.min(progress, 100);

  if (!targetType) {
    taskProgress = Math.min(progress, 100);
  } else if (['hours', 'days', 'weeks', 'months'].includes(targetType)) {
    taskProgress = Math.min((progress / total) * 100, 100);
  }

  return taskProgress;
};

const getProgressLabel = (progress: number, timeSpend: number, targetType?: string | null) => {
  if (!targetType) {
    return progress;
  }

  if (['hours', 'days', 'weeks', 'months'].includes(targetType)) {
    return formatDuration(timeSpend);
  }

  return progress;
};

const TaskProgress = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);

  const estimatedTime = getEstimatedTime(taskDetails?.target_value, taskDetails?.target_type);
  const taskProgress = getTaskProgress(taskDetails?.time_spend, estimatedTime.value, taskDetails?.target_type);
  const progressLabel = getProgressLabel(taskProgress, taskDetails?.time_spend, taskDetails?.target_type);

  return (
    <div className='mt-4 2xl:mx-12'>
      <div className='flex items-center justify-between text-sm mb-2'>
        <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Progress:
          {' '}
          {taskProgress?.toFixed(2)}
          %
        </span>
        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {progressLabel}
          &nbsp;of&nbsp;
          {estimatedTime.label}
        </span>
      </div>
      <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <div
          className='h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500'
          style={{ width: `${taskProgress}%` }}
        />
      </div>
    </div>
  );
};

export default TaskProgress;