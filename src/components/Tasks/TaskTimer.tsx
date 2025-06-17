import React, { useState, useEffect, useCallback } from 'react';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTaskStore } from 'stores/taskStore';

import PauseIcon from 'icons/PauseIcon';
import ResumeIcon from 'icons/ResumeIcon';

import { updateTask } from 'src/services/tasks';

type TaskTimerProps = {
  initialTime?: number; // in seconds
};

const TaskTimer: React.FC<TaskTimerProps> = ({ initialTime = 0 }) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  const shouldStartTimer = useTaskStore((state) => state.shouldStartTimer);
  const updateStartTimer = useTaskStore((state) => state.updateStartTimer);
  const startedAt = useTaskStore((state) => state.currentTaskDetails.startedAt);
  const timeSpend = useTaskStore((state) => state.currentTaskDetails.timeSpend);
  const updateStartedAtState = useTaskStore((state) => state.updateStartedAt);

  const { id } = useParams();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isRunning) {
      timer = setInterval(() => {
        setTime(timeSpend + (Math.floor((Date.now() - new Date(startedAt ?? null).getTime()) / 1000)));
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRunning, startedAt, timeSpend]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const updateStartedAt = useCallback(() => {
    if (id) {
      updateStartedAtState(new Date().toISOString());
      updateTask(id, { started_at: new Date().toISOString() }).then((res) => {
        toast.success(res?.message || 'Updated successfully');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to update task');
      });
    }
  }, [id, updateStartedAtState]);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
    if (id && isRunning) {
      updateTask(id, { time_spend: time, started_at: '' }).then((res) => {
        toast.success(res?.message || 'Updated successfully');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to update task');
      });
    }
    if (!isRunning) {
      updateStartedAt();
    }
  }, [id, isRunning, time, updateStartedAt]);

  useEffect(() => {
    if (shouldStartTimer) {
      setIsRunning(true);
      updateStartTimer(false);
      updateStartedAt();
    }
  }, [updateStartedAt, shouldStartTimer, updateStartTimer]);

  useEffect(() => {
    if (startedAt) {
      setIsRunning(true);
    }
  }, [startedAt]);

  return (
    <div className='flex flex-col p-1 rounded-lg shadow-md w-fit'>
      <h3 className='block mb-2 font-medium text-text-light tracking-wide whitespace-nowrap'>Time Spent:&nbsp;</h3>
      <div className='flex items-center justify-center mt-1'>
        <p className='text-2xl font-mono mt-1'>{formatTime(time)}</p>
        <button
          onClick={toggleTimer}
          className={`px-2 py-1 ms-3 rounded-md text-white font-medium ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isRunning ? <PauseIcon /> : <ResumeIcon />}
        </button>
      </div>
    </div>
  );
};

export default TaskTimer;