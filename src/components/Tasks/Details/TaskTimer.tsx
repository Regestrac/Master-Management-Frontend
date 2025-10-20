import { useState, useEffect, useRef, useCallback } from 'react';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { Pause, Play } from 'lucide-react';

import {
  formatTime,
  getTimerState,
  startTimer,
  stopTimer,
  getCurrentSessionTime,
  syncWithApiTime,
  saveTimerState,
  type TimerStateType,
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

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize timer state when component mounts or taskId changes
  useEffect(() => {
    const state = syncWithApiTime(taskId, apiTimeSpend);
    setTimerState(state);

    // Calculate initial display time
    const totalSessionTime = state.isRunning ? getCurrentSessionTime(state) : 0;
    const totalDisplayTime = apiTimeSpend + state.totalTime + totalSessionTime;
    setDisplayTime(formatTime(totalDisplayTime));
  }, [taskId, apiTimeSpend]);

  // Update timer display
  const updateDisplay = useCallback(() => {
    if (!timerState) { return; }

    const currentSessionTime = timerState.isRunning ? getCurrentSessionTime(timerState) : 0;
    const totalDisplayTime = apiTimeSpend + timerState.totalTime + currentSessionTime;
    setDisplayTime(formatTime(totalDisplayTime));
  }, [timerState, apiTimeSpend]);

  // Handle timer start/stop based on isRunning prop
  useEffect(() => {
    if (!timerState) { return; }

    if (isRunning && !timerState.isRunning) {
      // Start timer
      const newState = startTimer(taskId, apiTimeSpend);
      setTimerState(newState);
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
            // Clear local session time after successful sync
            const state = getTimerState(taskId);
            if (state) {
              state.totalTime = 0; // Reset session time since it's now in API
              saveTimerState(state);
            }
          }).catch(() => {
            // API sync failed, but timer state is preserved locally
          });
        }
      }
    }
  }, [isRunning, timerState, taskId, apiTimeSpend]);

  // Set up interval for running timer
  useEffect(() => {
    if (isRunning && timerState?.isRunning) {
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
  }, [isRunning, timerState?.isRunning, updateDisplay]);

  // Handle visibility change (tab becomes active/inactive)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && timerState?.isRunning) {
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
  }, [taskId, timerState?.isRunning, updateDisplay]);

  // Handle page unload (save current state)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (timerState?.isRunning) {
        // Update the timer state one final time before page unloads
        const updatedState = getTimerState(taskId);
        if (updatedState) {
          const currentSessionTime = getCurrentSessionTime(updatedState);
          updatedState.totalTime += currentSessionTime;
          updatedState.startTime = Date.now(); // Reset start time for next session
          // Note: We can't reliably save to localStorage in beforeunload,
          // but the visibilitychange handler should have handled most cases
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [taskId, timerState]);

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
    <div className='flex items-center space-x-4'>
      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Created on&nbsp;
        {taskDetails?.created_at ? dayjs(taskDetails.created_at).format('MMM DD, YYYY') : null}
      </span>
      <div
        onClick={() => toggleTimer(taskDetails.id)}
        className={`flex items-center cursor-pointer space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTask === Number(id) ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
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