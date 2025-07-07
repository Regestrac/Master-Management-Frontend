import { useState } from 'react';

import dayjs from 'dayjs';
import { ArrowLeft, Check, CheckSquare, MoreVertical, Pause, Play, Settings, X } from 'lucide-react';
import { useProfileStore } from 'stores/profileStore';
import { useTaskStore } from 'stores/taskStore';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import DropDown from 'components/Shared/Dropdown';

import { getPriorityColor, getStatusColor } from 'src/helpers/utils';
import { updateActiveTask, updateProfile } from 'src/services/profile';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from 'src/helpers/configs';
import { updateTask } from 'src/services/tasks';
import { TaskType } from 'src/helpers/sharedTypes';

const TaskHeader = () => {
  const [editingField, setEditingField] = useState<any>(null);
  const [tempValues, setTempValues] = useState({} as Record<string, string>);

  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);
  const activeTask = useProfileStore((state) => state.data.active_task);
  const updateTaskState = useTaskStore((state) => state.updateTask);
  const updateCurrentTaskDetails = useTaskStore((state) => state.updateCurrentTaskDetails);

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

  const handleUpdateTask = (id: string, payload: object) => {
    updateTask(id, payload).then((res) => {
      toast.success(res?.message || 'Updated successfully');
    }).catch((err) => {
      toast.error(err?.error || 'Failed to update task');
    });
  };

  const handlePriorityChange = (value: string | null) => {
    if (taskDetails?.priority !== value) {
      handleUpdateTask(taskDetails?.id?.toString(), { priority: value || '' });
      updateTaskState({ id: taskDetails?.id, priority: value as TaskType['priority'] });
      updateCurrentTaskDetails({ ...taskDetails, priority: value as TaskType['priority'] });
    }
  };

  const handleStatusChange = (value: string | null) => {
    if (taskDetails?.status !== value) {
      handleUpdateTask(taskDetails?.id?.toString(), { status: value });
      updateTaskState({ id: taskDetails?.id, status: value as TaskType['status'] });
      updateCurrentTaskDetails({ ...taskDetails, status: value as TaskType['status'] });
    }
  };

  const startEditing = (field: any, currentValue: any) => {
    setEditingField(field);
    setTempValues((prev) => ({ ...prev, [field]: currentValue }));
  };

  const saveField = (field: any) => {
    setEditingField(null);
    setTempValues((prev) => ({ ...prev, [field]: undefined }));
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValues({});
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
              <DropDown options={STATUS_OPTIONS} onSelect={handleStatusChange} hideClear value={taskDetails?.status}>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(taskDetails.status)}`}>
                  {taskDetails?.status?.toUpperCase()}
                </span>
              </DropDown>
              <DropDown options={PRIORITY_OPTIONS} onSelect={handlePriorityChange} value={taskDetails?.priority}>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(taskDetails.priority)}`}>
                  {taskDetails.priority || 'No'}
                  {' '}
                  priority
                </span>
              </DropDown>
              {taskDetails?.due_date ? (
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Due
                  {' '}
                  {dayjs(taskDetails.due_date).format('MMM DD, YYYY')}
                </span>
              ) : null}

              {/* Due Date Editable */}
              <div className='flex justify-between items-center'>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Due Date</span>
                {editingField === 'dueDate' ? (
                  <div className='flex items-center space-x-2'>
                    <input
                      type='date'
                      value={tempValues.dueDate}
                      onChange={(e) => setTempValues((prev) => ({ ...prev, dueDate: e.target.value }))}
                      className={`px-2 py-1 text-xs rounded border focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                    <button onClick={() => saveField('dueDate')} className='text-green-500 hover:text-green-600'>
                      <Check className='w-3 h-3' />
                    </button>
                    <button onClick={cancelEditing} className='text-red-500 hover:text-red-600'>
                      <X className='w-3 h-3' />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditing('dueDate', taskDetails.due_date)}
                    className='text-sm font-medium hover:text-purple-500 transition-colors'
                  >
                    {dayjs(taskDetails.due_date).format('MMM DD, YYYY')}
                  </button>
                )}
              </div>
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