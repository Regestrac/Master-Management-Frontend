import { useState } from 'react';

import { Plus, Minus, Check } from 'lucide-react';

import { useTaskStore } from 'stores/taskStore';
import { useSettingsStore } from 'stores/settingsStore';

interface TargetProgressTrackerProps {
  taskId: string;
  targetType?: string; // Made optional since we're not using it
  currentProgress: number;
  targetValue: number;
  onProgressUpdate?: (_newProgress: number) => void;
}

const TargetProgressTracker = ({
  taskId,
  targetType: _targetType, // Rename to indicate it's not used
  currentProgress,
  targetValue,
  onProgressUpdate,
}: TargetProgressTrackerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateTaskProgress: updateProgressInStore } = useTaskStore();
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const handleIncrement = async () => {
    if (currentProgress >= targetValue) {
      return;
    }
    const newProgress = currentProgress + 1;
    await updateProgress(newProgress);
  };

  const handleDecrement = async () => {
    if (currentProgress <= 0) {
      return;
    }
    const newProgress = currentProgress - 1;
    await updateProgress(newProgress);
  };

  const handleComplete = async () => {
    if (currentProgress >= targetValue) {
      return;
    }
    await updateProgress(targetValue);
  };

  const updateProgress = async (progressValue: number) => {
    try {
      setIsLoading(true);
      // Update progress in the store
      updateProgressInStore(parseInt(taskId, 10), progressValue);
      // Call the callback if provided
      if (onProgressUpdate) {
        onProgressUpdate(progressValue);
      }
    } catch (error) {
      // Using console.error for error logging is acceptable here
      // as it's important for debugging
      // eslint-disable-next-line no-console
      console.error('Error updating progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center gap-1.5 ml-3'>
      <button
        onClick={handleDecrement}
        disabled={isLoading || currentProgress <= 0}
        className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${isLoading || currentProgress <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label='Decrement'
      >
        <Minus className='w-3.5 h-3.5' />
      </button>
      <span className='text-sm font-medium whitespace-nowrap'>
        {currentProgress}
      </span>
      <button
        onClick={handleIncrement}
        disabled={isLoading || currentProgress >= targetValue}
        className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${isLoading || currentProgress >= targetValue ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label='Increment'
      >
        <Plus className='w-3.5 h-3.5' />
      </button>
      <button
        onClick={handleComplete}
        disabled={isLoading || currentProgress >= targetValue}
        className={`ml-1 px-1.5 py-0.5 rounded text-xs font-medium ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600 text-white'} ${isLoading || currentProgress >= targetValue ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label='Complete'
      >
        <Check className='w-3 h-3' />
      </button>
    </div>
  );
};

export default TargetProgressTracker;
