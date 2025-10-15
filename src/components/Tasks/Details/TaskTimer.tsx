import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { Pause, Play } from 'lucide-react';

import { useProfileStore } from 'stores/profileStore';
import { useSettingsStore } from 'stores/settingsStore';
import { useTaskStore } from 'stores/taskStore';

import { updateActiveTask } from 'services/profile';

const TaskTimer = () => {
  const activeTask = useProfileStore((state) => state.data.active_task);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);

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
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTask === Number(id) ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
      >
        {activeTask === Number(id) ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4' />}
        <span>
          {activeTask === Number(id) ? 'Stop' : 'Start'}
          {' '}
          Timer
        </span>
      </div>
    </div>
  );
};

export default TaskTimer;