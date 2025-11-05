import { useState, useEffect, useRef, useCallback } from 'react';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { Pause, Play } from 'lucide-react';
import clsx from 'clsx';

import {
  formatTime,
  getTimerState,
  startTimer,
  stopTimer,
  getCurrentSessionTime,
  syncWithApiTime,
  TimerStateType,
} from 'helpers/timerUtils';

import { useProfileStore } from 'stores/profileStore';
import { useSettingsStore } from 'stores/settingsStore';
import { useTaskStore } from 'stores/taskStore';

import { updateActiveTask } from 'services/profile';
import { updateTaskTimeSpend } from 'services/tasks';

type TimerPropsType = {
  isRunning: boolean;
  taskId: number;
  apiTimeSpend: number;
}

const Timer = ({ isRunning, taskId, apiTimeSpend }: TimerPropsType) => {
  const [displayTime, setDisplayTime] = useState<string>('00:00:00');
  const [timerState, setTimerState] = useState<TimerStateType | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  const updateCurrentTaskDetails = useTaskStore((state) => state.updateCurrentTaskDetails);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize timer state when component mounts or taskId changes
  useEffect(() => {
    // Load existing timer state from localStorage or create new one
    const existingState = getTimerState(taskId);

    if (existingState) {
      // Timer state exists in localStorage
      setTimerState(existingState);
    } else {
      // Create new timer state synced with API time
      const newState = syncWithApiTime(taskId, apiTimeSpend);
      setTimerState(newState);
    }

    setInitialized(true);
  }, [taskId, apiTimeSpend]);

  // Update timer display
  const updateDisplay = useCallback(() => {
    if (!timerState) {
      // Show API time if no timer state yet
      setDisplayTime(formatTime(apiTimeSpend));
      return;
    }

    const currentSessionTime = timerState.isRunning ? getCurrentSessionTime(timerState) : 0;
    const totalDisplayTime = apiTimeSpend + timerState.totalTime + currentSessionTime;
    setDisplayTime(formatTime(totalDisplayTime));
  }, [timerState, apiTimeSpend]);

  // Handle timer start/stop based on isRunning prop
  useEffect(() => {
    if (!initialized || !timerState) { return; }

    if (isRunning && !timerState.isRunning) {
      // Start timer only if it wasn't already running
      // This prevents resetting startTime when revisiting the page
      const existingState = getTimerState(taskId);
      if (existingState && existingState.isRunning) {
        // Timer is already running in localStorage, just use that state
        setTimerState(existingState);
      } else {
        // Start a new timer session
        const newState = startTimer(taskId, timerState.totalTime);
        setTimerState(newState);
      }
    } else if (!isRunning && timerState.isRunning) {
      // Stop timer and sync with API
      const newState = stopTimer(taskId);

      if (newState) {
        setTimerState(newState);

        // Sync with API when timer stops
        const totalSessionTime = newState.totalTime;
        if (totalSessionTime > 0) {
          // Calculate the total time that should be in the API
          const newApiTimeSpend = apiTimeSpend + totalSessionTime;
          updateTaskTimeSpend(taskId.toString(), newApiTimeSpend).then(() => {
            // Update the task details with new time
            updateCurrentTaskDetails({ time_spend: newApiTimeSpend });

            // Reset local session time after successful sync
            const resetState: TimerStateType = {
              taskId,
              startTime: Date.now(),
              totalTime: 0,
              isRunning: false,
              lastUpdateTime: Date.now(),
            };
            setTimerState(resetState);
          }).catch(() => {
            // API sync failed, but timer state is preserved locally
            toast.error('Failed to sync timer with server');
          });
        }
      }
    }
  }, [isRunning, taskId, apiTimeSpend, updateCurrentTaskDetails, timerState, initialized]);

  // Set up interval for running timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        updateDisplay();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, updateDisplay]);

  // Handle visibility change (tab becomes active/inactive)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isRunning && timerState) {
        // Tab became active, update timer state from localStorage
        const updatedState = getTimerState(taskId);
        if (updatedState) {
          setTimerState(updatedState);
          updateDisplay();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [taskId, isRunning, updateDisplay, timerState]);

  // Update display when API time changes
  useEffect(() => {
    if (initialized) {
      updateDisplay();
    }
  }, [apiTimeSpend, initialized, updateDisplay]);

  // Update display when timer state changes
  useEffect(() => {
    updateDisplay();
  }, [updateDisplay]);

  return (
    <div className='font-mono text-sm font-medium'>
      {displayTime}
    </div>
  );
};

const TaskTimer = () => {
  const activeTask = useProfileStore((state) => state.data.active_task);
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);
  const updateProfile = useProfileStore((state) => state.updateProfile);

  const { id } = useParams();

  const toggleTimer = (taskId: number) => {
    updateActiveTask({ active_task: activeTask === taskId ? null : taskId }).then((res) => {
      updateProfile({ active_task: res?.active_task });
    }).catch((err) => {
      toast.error(err?.error);
    });
  };

  return (
    <div className='flex flex-row items-center justify-end gap-2 2xl:me-12'>
      <span className={clsx('text-xs sm:text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')}>
        Created on&nbsp;
        {taskDetails?.created_at ? dayjs(taskDetails.created_at).format('MMM DD, YYYY') : null}
      </span>
      <div
        onClick={() => toggleTimer(taskDetails.id)}
        className={clsx(
          'flex items-center cursor-pointer space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors text-white',
          activeTask === Number(id) ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600',
        )}
      >
        {activeTask === Number(id) ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4' />}
        <Timer
          isRunning={activeTask === Number(id)}
          taskId={Number(id)}
          apiTimeSpend={taskDetails?.time_spend || 0}
        />
      </div>
    </div>
  );
};

export default TaskTimer;