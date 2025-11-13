import { formatDuration } from 'helpers/utils';

import { useSettingsStore } from 'stores/settingsStore';
import { useTaskStore } from 'stores/taskStore';

import TargetProgressTracker from 'components/Tasks/Details/TargetProgressTracker';

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

// const getTaskProgress = (progress: number, total: number, targetType?: string | null) => {
//   if (!targetType) {
//     return 0;
//   }

//   // For percentage type, progress is already a percentage
//   if (targetType === 'percentage') {
//     return Math.min(progress, 100);
//   }

//   // For time-based and count-based targets
//   if (['hours', 'days', 'weeks', 'months', 'repetition', 'sessions', 'points'].includes(targetType)) {
//     if (total <= 0) {
//       return 0; // Prevent division by zero
//     }
//     const percentage = (progress / total) * 100;
//     return Math.min(percentage, 100);
//   }

//   return 0;
// };

const getProgressLabel = (progress: number, timeSpend: number, targetType?: string | null) => {
  if (!targetType) {
    return progress;
  }

  switch (targetType) {
    case 'hours':
    case 'days':
    case 'weeks':
    case 'months':
      return formatDuration(timeSpend);

    case 'percentage':
      return `${progress.toFixed(0)}%`;

    case 'repetition':
      return `${Math.round(progress)} rep${progress !== 1 ? 's' : ''}`;

    case 'sessions':
      return `${Math.round(progress)} session${progress !== 1 ? 's' : ''}`;

    case 'points':
      return `${progress.toFixed(1)} pts`;

    default:
      return progress;
  }
};

const TaskProgress = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);
  const updateProgressInStore = useTaskStore((state) => state.updateTaskProgress);

  const progress = taskDetails?.progress || 0;
  const timeSpend = taskDetails?.time_spend || 0;
  const targetValue = taskDetails?.target_value || 1; // Prevent division by zero
  const targetType = taskDetails?.target_type;

  const isTimeBased = ['hours', 'days', 'weeks', 'months'].includes(targetType || '');
  const isCountBased = ['repetition', 'sessions', 'points', 'percentage'].includes(targetType || '');

  const estimatedTarget = getEstimatedTime(targetValue, targetType);

  // Determine current progress based on target type
  const currentProgress = isTimeBased ? timeSpend : progress;

  // Calculate progress percentage for the progress bar
  // const taskProgress = getTaskProgress(
  //   currentProgress,
  //   estimatedTarget.value,
  //   targetType,
  // );

  // Get the appropriate progress label
  const progressLabel = getProgressLabel(
    currentProgress,
    timeSpend,
    targetType,
  );

  return (
    <div className='mt-4 2xl:mx-12'>
      <div className='flex items-center justify-between text-sm mb-2'>
        <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Progress:
          {' '}
          {progress?.toFixed(0)}
          %
        </span>
        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {progressLabel}
          {targetType && (
            <>
              &nbsp;of&nbsp;
              {targetType === 'percentage' ? '100%' : estimatedTarget.label}
            </>
          )}
        </span>
      </div>
      <div className='flex items-center gap-3'>
        <div className='flex-1'>
          <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className='h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Progress controls for non-time-based targets */}
        {isCountBased && targetValue > 0 && (
          <TargetProgressTracker
            taskId={taskDetails?.id?.toString() || ''}
            currentProgress={currentProgress}
            targetValue={targetValue}
            onProgressUpdate={(newProgress) => {
              updateProgressInStore(taskDetails?.id, newProgress);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TaskProgress;