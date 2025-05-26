import { useNavigate } from 'react-router-dom';

import { useTaskStore } from 'zustandStore/taskStore';

import ResumeIcon from 'icons/ResumeIcon';

const RecentTasks = () => {
  const recentTasks = useTaskStore((state) => state.recentTasks);
  const updateRecentTask = useTaskStore((state) => state.updateRecentTask);

  const navigate = useNavigate();

  const onTaskClick = (taskId: number) => {
    navigate(`/tasks/${taskId}`);
    const currentTask = recentTasks?.find((task) => task?.id === taskId);
    if (currentTask) {
      updateRecentTask(currentTask);
    }
  };

  const onResumeTaskClick = (taskId: number) => {
    onTaskClick(taskId);
  };

  return (
    <div className='recent-task-box'>
      <h3>Recents</h3>
      {recentTasks.map((task) => (
        <div key={task?.id} className='recent-task flex justify-between flex-wrap items-center'>
          <span className='me-2'>{task.status}</span>
          <div className='w-200'>{task?.task}</div>
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