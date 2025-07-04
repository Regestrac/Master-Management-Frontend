import dayjs from 'dayjs';
import { ArrowLeft, CheckSquare, MoreVertical, Pause, Play, Settings } from 'lucide-react';
import { useProfileStore } from 'stores/profileStore';
import { useTaskStore } from 'stores/taskStore';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getPriorityColor, getStatusColor } from 'src/helpers/utils';
import { updateActiveTask, updateProfile } from 'src/services/profile';

const TaskHeader = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);
  const activeTask = useProfileStore((state) => state.data.active_task);

  const navigate = useNavigate();

  const { id } = useParams();

  const toggleTimer = (taskId: number) => {
    updateActiveTask({ active_task: activeTask === taskId ? null : taskId }).then((res) => {
      toast.success(res?.message);
      updateProfile({ active_task: res?.active_task });
    }).catch((err) => {
      toast.error(err?.error);
    });
  };

  const handleBackClick = () => {
    navigate('/tasks');
  };

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center space-x-4'>
        <button className={`p-2 rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} onClick={handleBackClick}>
          <ArrowLeft className='w-5 h-5' />
        </button>
        <div className='flex items-center space-x-3'>
          <div className='w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center'>
            <CheckSquare className='w-4 h-4 text-white' />
          </div>
          <div>
            <h1 className='text-xl font-bold'>{taskDetails.title}</h1>
            <div className='flex items-center space-x-2 mt-1'>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(taskDetails.status)}`}>
                {taskDetails?.status?.toUpperCase()}
              </span>
              {taskDetails?.priority ? (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(taskDetails.priority)}`}>
                  {taskDetails.priority}
                  {' '}
                  priority
                </span>
              ) : null}
              {taskDetails?.due_date ? (
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Due
                  {' '}
                  {dayjs(taskDetails.due_date).format('MMM DD, YYYY')}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center space-x-3'>
        <button
          onClick={() => toggleTimer(taskDetails.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTask === Number(id) ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
        >
          {activeTask === Number(id) ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4' />}
          <span>
            {activeTask === Number(id) ? 'Stop' : 'Start'}
            {' '}
            Timer
          </span>
        </button>
        <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
          <Settings className='w-5 h-5' />
        </button>
        <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
          <MoreVertical className='w-5 h-5' />
        </button>
      </div>
    </div>
  );
};

export default TaskHeader;