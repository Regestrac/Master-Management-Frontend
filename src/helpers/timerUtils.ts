/**
 * Timer utilities for task time tracking
 * Handles time formatting, persistence, and background timer calculations
 */

export type TimerStateType = {
  taskId: number;
  startTime: number;
  totalTime: number;
  isRunning: boolean;
  lastUpdateTime: number;
};

/**
 * Format seconds into HH:MM:SS format
 */
export const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Parse time_spend from API (assuming it's in seconds) and add current session time
 */
// export const calculateTotalTime = (apiTimeSpend: number, sessionTime: number): number => {
//   return apiTimeSpend + sessionTime;
// };

/**
 * Get timer state from localStorage
 */
export const getTimerState = (taskId: number): TimerStateType | null => {
  try {
    const stored = localStorage.getItem(`timer_${taskId}`);
    if (!stored) {
      return null;
    }

    const state: TimerStateType = JSON.parse(stored);

    // Calculate time elapsed since last update if timer was running
    if (state.isRunning && state.lastUpdateTime) {
      const now = Date.now();
      const elapsedSinceLastUpdate = Math.floor((now - state.lastUpdateTime) / 1000);
      state.totalTime += elapsedSinceLastUpdate;
      state.lastUpdateTime = now;

      // Update localStorage with calculated time
      localStorage.setItem(`timer_${taskId}`, JSON.stringify(state));
    }

    return state;
  } catch {
    // Silent error handling for timer state
    return null;
  }
};

/**
 * Get current session time for a running timer
 */
export const getCurrentSessionTime = (state: TimerStateType): number => {
  if (!state.isRunning) {
    return 0;
  }
  const now = Date.now();
  return Math.floor((now - state.startTime) / 1000);
};

/**
 * Save timer state to localStorage
 */
export const saveTimerState = (state: TimerStateType): void => {
  try {
    localStorage.setItem(`timer_${state.taskId}`, JSON.stringify({
      ...state,
      lastUpdateTime: Date.now(),
    }));
  } catch {
    // Silent error handling for timer state
  }
};

/**
 * Clear timer state from localStorage
 */
// export const clearTimerState = (taskId: number): void => {
//   try {
//     localStorage.removeItem(`timer_${taskId}`);
//   } catch {
//     // Silent error handling for timer state
//   }
// };

/**
 * Start timer for a task
 */
export const startTimer = (taskId: number, _initialTimeSpend: number = 0): TimerStateType => {
  const existingState = getTimerState(taskId);

  const state: TimerStateType = {
    taskId,
    startTime: Date.now(),
    totalTime: existingState?.totalTime || 0,
    isRunning: true,
    lastUpdateTime: Date.now(),
  };

  saveTimerState(state);

  return state;
};

/**
 * Stop timer for a task
 */
export const stopTimer = (taskId: number): TimerStateType | null => {
  const state = getTimerState(taskId);
  if (!state) {
    return null;
  }

  if (state.isRunning) {
    const now = Date.now();
    // const sessionTime = dayjs(now).diff(dayjs(state.startTime), 'second');
    // state.totalTime += sessionTime;
    state.isRunning = false;
    state.lastUpdateTime = now;

    saveTimerState(state);
  }

  return state;
};

/**
 * Reset timer for a task
 */
// export const resetTimer = (taskId: number): void => {
//   clearTimerState(taskId);
// };

/**
 * Get all active timers (for cleanup or sync purposes)
 */
// export const getAllActiveTimers = (): TimerStateType[] => {
//   const activeTimers: TimerStateType[] = [];

//   try {
//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       if (key && key.startsWith('timer_')) {
//         const stored = localStorage.getItem(key);
//         if (stored) {
//           const state: TimerStateType = JSON.parse(stored);
//           if (state.isRunning) {
//             activeTimers.push(state);
//           }
//         }
//       }
//     }
//   } catch {
//     // Silent error handling for timer state
//   }

//   return activeTimers;
// };

/**
 * Sync timer data with API time_spend value
 * This should be called when task data is loaded from API
 */
export const syncWithApiTime = (taskId: number, _apiTimeSpend: number): TimerStateType => {
  const existingState = getTimerState(taskId);

  if (!existingState) {
    // No local timer state, create one with API time
    const state: TimerStateType = {
      taskId,
      startTime: Date.now(),
      totalTime: 0, // Local session time starts at 0
      isRunning: false,
      lastUpdateTime: Date.now(),
    };
    saveTimerState(state);
    return state;
  }

  // Return existing state (local session time is separate from API time)
  return existingState;
};

/**
 * Calculate total time including API time and local session time
 */
// export const calculateDisplayTime = (apiTimeSpend: number, sessionTime: number): number => {
//   return apiTimeSpend + sessionTime;
// };

/**
 * Sync timer data with backend API
 * This should be called when timer stops to update the backend
 */
// export const syncTimerWithApi = async (
//   taskId: number,
//   apiTimeSpend: number,
//   sessionTime: number,
//   updateApiCallback?: (_taskId: string, _totalTime: number) => Promise<any>,
// ): Promise<number> => {
//   const totalTime = calculateDisplayTime(apiTimeSpend, sessionTime);

//   if (updateApiCallback) {
//     try {
//       await updateApiCallback(taskId.toString(), totalTime);
//       // Clear local session time after successful sync
//       const state = getTimerState(taskId);
//       if (state) {
//         state.totalTime = 0; // Reset session time since it's now in API
//         saveTimerState(state);
//       }
//       return totalTime;
//     } catch {
//       // If API sync fails, keep the session time locally
//       return totalTime;
//     }
//   }

//   return totalTime;
// };
