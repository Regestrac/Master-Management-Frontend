import { useState } from 'react';

import { Plus, Minus, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

import { useTaskStore } from 'stores/taskStore';
import { useSettingsStore } from 'stores/settingsStore';

import { updateTask } from 'services/tasks';

const TargetProgressTracker = () => {
  const [isLoading, setIsLoading] = useState(false);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const targetProgress = useTaskStore((state) => state.currentTaskDetails?.target_progress) || 0;
  const targetValue = useTaskStore((state) => state.currentTaskDetails?.target_value) || 0;
  const updateTaskInStore = useTaskStore((state) => state.updateCurrentTaskDetails);

  const { id } = useParams();

  const updateProgress = (progressValue: number) => {
    if (id) {
      setIsLoading(true);
      updateTaskInStore({ target_progress: progressValue });
      updateTask(id, { target_progress: progressValue }).then((res) => {
        updateTaskInStore({ progress: res?.progress || 0 });
      }).catch((error) => {
        toast.error(error.error || 'Failed to update progress');
      }).finally(() => {
        setIsLoading(false);
      });
    }
  };

  const handleIncrement = () => {
    if (targetProgress >= targetValue) {
      return;
    }
    const newProgress = targetProgress + 1;
    updateProgress(newProgress);
  };

  const handleDecrement = () => {
    if (targetProgress <= 0) {
      return;
    }
    const newProgress = targetProgress - 1;
    updateProgress(newProgress);
  };

  const handleComplete = () => {
    if (targetProgress >= targetValue) {
      return;
    }
    updateProgress(targetValue);
  };

  return (
    <div className='flex items-center gap-1.5 ml-3'>
      <button
        onClick={handleDecrement}
        disabled={isLoading || targetProgress <= 0}
        className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${isLoading || targetProgress <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label='Decrement'
      >
        <Minus className='w-3.5 h-3.5' />
      </button>
      <span className='text-sm font-medium whitespace-nowrap'>
        {targetProgress}
      </span>
      <button
        onClick={handleIncrement}
        disabled={isLoading || targetProgress >= targetValue}
        className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${isLoading || targetProgress >= targetValue ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label='Increment'
      >
        <Plus className='w-3.5 h-3.5' />
      </button>
      <button
        onClick={handleComplete}
        disabled={isLoading || targetProgress >= targetValue}
        className={`ml-1 px-1.5 py-0.5 rounded text-xs font-medium ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600 text-white'} ${isLoading || targetProgress >= targetValue ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label='Complete'
      >
        <Check className='w-3 h-3' />
      </button>
    </div>
  );
};

export default TargetProgressTracker;
