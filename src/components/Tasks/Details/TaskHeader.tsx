import { useState } from 'react';

import dayjs from 'dayjs';
import { Archive, ArrowLeft, Check, CheckSquare, Copy, Eraser, MoreVertical, MoveRight, Pause, Play, Star, Trash2, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { capitalize, getPriorityColor, getStatusColor } from 'helpers/utils';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from 'helpers/configs';
import { TaskType, TargetType, TargetFrequency } from 'helpers/sharedTypes';

import { useTaskStore } from 'stores/taskStore';
import { useProfileStore } from 'stores/profileStore';
import { useNavbarStore } from 'stores/navbarStore';
import { useSettingsStore } from 'stores/settingsStore';

import { updateTask } from 'services/tasks';
import { updateActiveTask } from 'services/profile';

import DropDown from 'components/Shared/Dropdown';

const TARGET_TYPE_OPTIONS = [
  { label: 'Repetition', value: 'repetition' },
  { label: 'Hours', value: 'hours' },
  { label: 'Days', value: 'days' },
  { label: 'Weeks', value: 'weeks' },
  { label: 'Months', value: 'months' },
  { label: 'Sessions', value: 'sessions' },
  { label: 'Points', value: 'points' },
  { label: 'Percentage', value: 'percentage' },
];

const TARGET_FREQUENCY_OPTIONS = [
  { label: 'Daily', value: 'daily' },
  { label: 'Alternate Days', value: 'alternate_days' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Custom', value: 'custom' },
];

const moreOptions = [
  { label: 'Mark As Completed', value: 'mark_completed', bgColor: 'text-green-600 bg-green-500/20', icon: <Check className='w-4 h-4' /> },
  { label: 'Clear stats', value: 'clear_stats', bgColor: 'text-white', icon: <Eraser className='w-4 h-4' /> },
  { label: 'Move Task', value: 'move_task', bgColor: 'text-white', icon: <MoveRight className='w-4 h-4' /> },
  { label: 'Duplicate Task', value: 'duplicate_task', bgColor: 'text-white', icon: <CheckSquare className='w-4 h-4' /> },
  { label: 'Copy Link', value: 'copy_link', bgColor: 'text-white', icon: <Copy className='w-4 h-4' /> },
  { label: 'Add to Favorites', value: 'add_favorite', bgColor: 'text-white', icon: <Star className='w-4 h-4' /> },
  { label: 'Archive', value: 'archive_task', bgColor: 'text-white', icon: <Archive className='w-4 h-4' /> },
  { label: 'Delete Task', value: 'delete_task', bgColor: 'text-red-600 bg-red-500/20', icon: <Trash2 className='w-4 h-4' /> },
];

const TaskHeader = () => {
  const [editingField, setEditingField] = useState<any>(null);
  const [tempValues, setTempValues] = useState({} as Record<string, string>);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);
  const activeTask = useProfileStore((state) => state.data.active_task);
  const updateTaskState = useTaskStore((state) => state.updateTask);
  const updateCurrentTaskDetails = useTaskStore((state) => state.updateCurrentTaskDetails);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const prevPath = useNavbarStore((state) => state.prevPath);
  const updatePrevPath = useNavbarStore((state) => state.updatePrevPath);

  const navigate = useNavigate();

  const { id } = useParams();

  const toggleTimer = (taskId: number) => {
    updateActiveTask({ active_task: activeTask === taskId ? null : taskId }).then((res) => {
      updateProfile({ active_task: res?.active_task });
    }).catch((err) => {
      toast.error(err?.error);
    });
  };

  const handleBackClick = () => {
    navigate(prevPath || '/dashboard');
    updatePrevPath('');
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

  const handleTargetTypeChange = (value: string | null) => {
    if (taskDetails?.target_type !== value) {
      handleUpdateTask(taskDetails?.id?.toString(), { target_type: value });
      updateTaskState({ id: taskDetails?.id, target_type: value as TargetType });
      updateCurrentTaskDetails({ ...taskDetails, target_type: value as TargetType });
    }
  };

  const handleTargetFrequencyChange = (value: string | null) => {
    if (taskDetails?.target_frequency !== value) {
      handleUpdateTask(taskDetails?.id?.toString(), { target_frequency: value });
      updateTaskState({ id: taskDetails?.id, target_frequency: value as TargetFrequency });
      updateCurrentTaskDetails({ ...taskDetails, target_frequency: value as TargetFrequency });
    }
  };

  const startEditing = (field: any, currentValue: any) => {
    setEditingField(field);
    setTempValues((prev) => ({ ...prev, [field]: currentValue }));
  };

  const saveField = (field: any) => {
    const value = tempValues[field];
    if (field === 'targetValue') {
      handleUpdateTask(taskDetails?.id?.toString(), { target_value: value ? Number(value) : null });
      updateTaskState({ id: taskDetails?.id, target_value: value ? Number(value) : null });
      updateCurrentTaskDetails({ ...taskDetails, target_value: value ? Number(value) : null });
    } else if (field === 'dueDate') {
      handleUpdateTask(taskDetails?.id?.toString(), { due_date: value });
      updateTaskState({ id: taskDetails?.id, due_date: value });
      updateCurrentTaskDetails({ ...taskDetails, due_date: value });
    }
    setEditingField(null);
    setTempValues((prev) => ({ ...prev, [field]: undefined }));
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValues({});
  };

  const handleMoreOptionSelect = (_option: any) => {
  };

  return (
    <div className='flex items-center justify-between 2xl:me-12'>
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
              <DropDown options={STATUS_OPTIONS} onSelect={handleStatusChange} hideClear value={taskDetails?.status} isMulti={false}>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(taskDetails.status)}`}>
                  {taskDetails?.status?.toUpperCase()}
                </span>
              </DropDown>
              <DropDown options={PRIORITY_OPTIONS} onSelect={handlePriorityChange} value={taskDetails?.priority} isMulti={false}>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(taskDetails.priority)}`}>
                  {capitalize(taskDetails.priority) || 'No'}
                  {' '}
                  priority
                </span>
              </DropDown>

              {/* Target Configuration Display */}
              {taskDetails?.type === 'goal' && (
                <div className={`flex items-center space-x-2 px-2 py-1 rounded-lg ${darkMode ? 'bg-blue-900/30 border border-blue-700/50' : 'bg-blue-50 border border-blue-200'}`}>
                  <span className='w-1.5 h-1.5 rounded-full bg-blue-500' />
                  <div className='flex items-center space-x-1 text-xs'>
                    {/* Target Value - Always show for goals */}
                    {editingField === 'targetValue' ? (
                      <div className='flex items-center space-x-1'>
                        <input
                          type='number'
                          value={tempValues.targetValue || ''}
                          onChange={(e) => setTempValues((prev) => ({ ...prev, targetValue: e.target.value }))}
                          className={`w-16 px-1 py-0.5 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                          placeholder='0'
                        />
                        <button onClick={() => saveField('targetValue')} className='text-green-500 hover:text-green-600'>
                          <Check className='w-3 h-3' />
                        </button>
                        <button onClick={cancelEditing} className='text-red-500 hover:text-red-600'>
                          <X className='w-3 h-3' />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing('targetValue', taskDetails.target_value || '')}
                        className={`font-medium hover:underline ${
                          taskDetails?.target_value
                            ? (darkMode ? 'text-blue-300' : 'text-blue-700')
                            : (darkMode ? 'text-gray-500' : 'text-gray-400')
                        }`}
                      >
                        {taskDetails.target_value || 'Set target'}
                      </button>
                    )}

                    {/* Target Type - Always show for goals */}
                    <DropDown options={TARGET_TYPE_OPTIONS} onSelect={handleTargetTypeChange} value={taskDetails?.target_type} isMulti={false}>
                      <span
                        className={`font-medium cursor-pointer hover:underline ${
                          taskDetails?.target_type
                            ? (darkMode ? 'text-blue-300' : 'text-blue-700')
                            : (darkMode ? 'text-gray-500' : 'text-gray-400')
                        }`}
                      >
                        {taskDetails?.target_type
                          ? TARGET_TYPE_OPTIONS.find((opt) => opt.value === taskDetails.target_type)?.label
                          : 'Select type'
                        }
                      </span>
                    </DropDown>

                    {/* Target Frequency - Always show for goals */}
                    <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>•</span>
                    <DropDown options={TARGET_FREQUENCY_OPTIONS} onSelect={handleTargetFrequencyChange} value={taskDetails?.target_frequency} isMulti={false}>
                      <span
                        className={`font-medium cursor-pointer hover:underline ${
                          taskDetails?.target_frequency
                            ? (darkMode ? 'text-blue-300' : 'text-blue-700')
                            : (darkMode ? 'text-gray-500' : 'text-gray-400')
                        }`}
                      >
                        {taskDetails?.target_frequency
                          ? TARGET_FREQUENCY_OPTIONS.find((opt) => opt.value === taskDetails.target_frequency)?.label
                          : 'Select frequency'
                        }
                      </span>
                    </DropDown>
                  </div>
                </div>
              )}
              {taskDetails?.due_date ? (
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Due
                  {' '}
                  {dayjs(taskDetails.due_date).format('MMM DD, YYYY')}
                </span>
              ) : null}

              {/* Due Date Editable */}
              <div className='flex justify-between items-center'>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Due Date:&nbsp;</span>
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

              <div className='flex justify-between items-center'>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Streak:&nbsp;</span>
                <span className='text-sm font-medium hover:text-purple-500 transition-colors'>
                  {taskDetails.streak}
                  🔥
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center space-x-3'>
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Created on&nbsp;
          {taskDetails?.created_at ? dayjs(taskDetails.created_at).format('MMM DD, YYYY') : null}
        </span>
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
        <DropDown options={moreOptions} onSelect={handleMoreOptionSelect} hideClear value={null}>
          <div className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <MoreVertical className='w-5 h-5' />
          </div>
        </DropDown>
      </div>
    </div>
  );
};

export default TaskHeader;