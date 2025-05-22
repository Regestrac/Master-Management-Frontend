import React, { useState, useEffect } from 'react';

import PauseIcon from 'icons/PauseIcon';
import ResumeIcon from 'icons/ResumeIcon';

interface TaskTimerProps {
  initialTime?: string; // Format: "HH:MM:SS"
}

const TaskTimer: React.FC<TaskTimerProps> = ({ initialTime = '00:00:00' }) => {
  const [time, setTime] = useState(() => {
    const [hours, minutes, seconds] = initialTime.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  });
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  return (
    <div className='flex items-center justify-center p-1 rounded-lg shadow-md w-fit'>
      <h3 className='text-lg font-semibold w-full whitespace-nowrap'>Time Spent:&nbsp;</h3>
      <p className='text-2xl font-mono mt-1'>{formatTime(time)}</p>
      <button
        onClick={toggleTimer}
        className={`px-4 py-2 ms-3 rounded-md text-white font-medium ${
          isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {isRunning ? <PauseIcon /> : <ResumeIcon />}
      </button>
    </div>
  );
};

export default TaskTimer;