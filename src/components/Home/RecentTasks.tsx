import { useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import ResumeIcon from 'icons/ResumeIcon';

import { useTaskStore } from 'src/stores/taskStore';
import { getRecentTasks } from 'src/services/tasks';

const RecentTasks = () => {
  const recentTasks = useTaskStore((state) => state.recentTasks);
  const updateRecentTask = useTaskStore((state) => state.updateRecentTask);
  const updateStartTimer = useTaskStore((state) => state.updateStartTimer);

  const navigate = useNavigate();

  const shouldFetchRecentTasksRef = useRef(true);

  const handleOnTaskClick = (taskId: number) => {
    navigate(`/tasks/${taskId}`);
  };

  const onResumeTaskClick = (taskId: number) => {
    handleOnTaskClick(taskId);
    updateStartTimer(true);
  };

  useEffect(() => {
    if (shouldFetchRecentTasksRef.current) {
      getRecentTasks().then((res) => {
        updateRecentTask(res?.data || []);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch recent tasks');
      });
      shouldFetchRecentTasksRef.current = false;
    }
  }, [updateRecentTask]);

  return (
    <div className='recent-task-box'>
      <h3>Recents</h3>
      {recentTasks.map((task) => (
        <div key={task?.id} className='recent-task flex justify-between flex-wrap items-center'>
          <span className='me-2'>{task?.status}</span>
          <div className='w-200 cursor-pointer' onClick={() => handleOnTaskClick(task?.id)}>{task?.title}</div>
          <div>{task?.timeSpend}</div>
          <button className='ms-3 p-3 rounded-full text-white font-medium bg-secondary-bg hover:cursor-pointer' onClick={() => onResumeTaskClick(task?.id)}>
            <ResumeIcon />
          </button>
        </div>
      ))}
    </div>
  );
};

export default RecentTasks;