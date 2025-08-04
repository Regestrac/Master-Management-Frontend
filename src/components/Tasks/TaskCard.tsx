import { useState } from 'react';

import { Calendar, Clock, Flame, Pause, Play } from 'lucide-react';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';

import { TaskType } from 'helpers/sharedTypes';
import { formatTimeElapsed, getPriorityColor, getStatusColor } from 'helpers/utils';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from 'helpers/configs';

import { useTaskStore } from 'stores/taskStore';
import { useProfileStore } from 'stores/profileStore';
import useModalStore from 'stores/modalStore';
import { useNavbarStore } from 'stores/navbarStore';

import { updateTask } from 'services/tasks';
import { updateActiveTask } from 'services/profile';

import Input from 'components/Shared/Input';
import Dropdown from 'components/Shared/Dropdown';
import Outline from 'components/Shared/Outline';

type TaskCardPropsType = {
  task: TaskType
};

const formatDate = (dateString: string) => {
  const date = dayjs(dateString);
  const today = dayjs();
  const diffDays = today.diff(date, 'days');

  if (diffDays === 0) { return 'Today'; }
  if (diffDays === 1) { return 'Tomorrow'; }
  if (diffDays === -1) { return 'Yesterday'; }
  if (diffDays < 0) { return `${Math.abs(diffDays)} days overdue`; }
  return `${diffDays} days left`;
};

const TaskCard = ({ task }: TaskCardPropsType) => {
  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';
  const updateTaskState = useTaskStore((state) => state.updateTask);
  const activeTask = useProfileStore((state) => state.data.active_task);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const updateVisibility = useModalStore((state) => state.updateVisibility);
  const updatePrevPath = useNavbarStore((state) => state.updatePrevPath);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const methods = useForm({
    defaultValues: {
      title: task.title,
    },
  });

  const handleUpdateTask = (id: string, payload: object) => {
    updateTask(id, payload).then((res) => {
      toast.success(res?.message || 'Updated successfully');
    }).catch((err) => {
      toast.error(err?.error || 'Failed to update task');
    });
  };

  // const toggleTaskExpanded = (taskId: number) => {
  //   setExpandedTask(expandedTask === taskId ? null : taskId);
  // };

  const handleToggleTimer = (taskId: number) => {
    const toggleTimer = () => {
      updateActiveTask({ active_task: activeTask === taskId ? null : taskId }).then((res) => {
        updateVisibility({ modalType: 'switchTaskModal', isVisible: false });
        toast.success(res?.message);
        updateProfile({ active_task: res?.active_task });
      }).catch((err) => {
        toast.error(err?.error);
      });
    };

    if (activeTask !== taskId) {
      updateVisibility({ modalType: 'switchTaskModal', isVisible: true, extraProps: { onSuccess: toggleTimer } });
    } else {
      toggleTimer();
    }
  };

  const handlePrioritySelect = (value: string | null) => {
    if (task?.priority !== value) {
      handleUpdateTask(task?.id?.toString(), { priority: value || '' });
      updateTaskState({ id: task?.id, priority: value as TaskType['priority'] });
    }
  };

  const handleStatusSelect = (value: string | null) => {
    if (task?.status !== value) {
      handleUpdateTask(task?.id?.toString(), { status: value });
      updateTaskState({ id: task?.id, status: value as TaskType['status'] });
    }
  };

  const handleTaskClick = () => {
    updatePrevPath(pathname.includes('dashboard') ? '/dashboard' : '/tasks');
    navigate(`/tasks/${task?.id}`);
  };

  const [editName, setEditName] = useState(false);

  return (
    <Outline colors={['bg-primary-500', 'bg-secondary-500']} width='3px' variant='rotate' disabled={activeTask !== task?.id}>
      <div
        className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
        onClick={handleTaskClick}
        key={task?.id}
      >
        <div className='py-4 px-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4 flex-1'>
              {/* <input
                      type='checkbox'
                      checked={selectedTasks.includes(task?.id)}
                      onChange={() => toggleTaskSelection(task?.id)}
                      className='w-4 h-4 text-purple-600 rounded focus:ring-purple-500'
                    /> */}
              <Dropdown options={PRIORITY_OPTIONS} onSelect={handlePrioritySelect} value={task?.priority}>
                <div className={`w-3 h-3 rounded-full cursor-pointer hover:scale-120 ${getPriorityColor(task?.priority)}`} />
              </Dropdown>
              <div className='flex-1'>
                <FormProvider {...methods}>
                  <div className='flex items-center gap-3 mb-2'>
                    {editName ? (
                      <Input
                        name='title'
                        label=''
                        className='font-semibold text-lg cursor-text outline-none p-0! border-none focus:ring-0!'
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                        onBlur={(value) => {
                          if (value !== task?.title) {
                            handleUpdateTask(task?.id?.toString(), { title: value });
                            updateTaskState({ id: task?.id, title: value });
                          }
                          setEditName(false);
                        }}
                      />
                    ) : (
                      <h4
                        className='font-semibold text-lg cursor-text outline-none p-0! border-none focus:ring-0!'
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditName(true);
                        }}
                      >
                        {task?.title}
                      </h4>
                    )}
                  </div>
                </FormProvider>
                {/* <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3`}>
                        {task?.description}
                      </p> */}
                <div className='flex flex-wrap items-center gap-4 text-sm'>
                  <Dropdown options={STATUS_OPTIONS} onSelect={handleStatusSelect} value={task?.status} hideClear>
                    <span className={`px-3 py-1 rounded-full font-medium cursor-grab ${getStatusColor(task?.status)}`}>
                      {task?.status?.toUpperCase()}
                    </span>
                  </Dropdown>
                  {task?.category && (
                    <span className={`px-2 py-1 rounded text-xs font-medium cursor-default ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      {task?.category}
                    </span>
                  )}
                  <span className={` cursor-default ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center`}>
                    <Clock className='w-4 h-4 mr-1' />
                    {formatTimeElapsed(task?.time_spend)}
                  </span>
                  {task?.due_date && (
                    <span className={` cursor-default ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center`}>
                      <Calendar className='w-4 h-4 mr-1' />
                      {formatDate(task?.due_date)}
                    </span>
                  )}
                  {task?.streak > 0 && (
                    <span className='text-orange-500 flex items-center cursor-default'>
                      <Flame className='w-4 h-4 mr-1' />
                      {task?.streak}
                      {' '}
                      day streak
                    </span>
                  )}
                  {/* <div className='flex gap-1'>
                          {task?.tags.map((tag, index) => (
                            <span key={index} className='px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs'>
                              #
                              {tag}
                            </span>
                          ))}
                        </div> */}
                </div>
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              {/* {('notes' in task && task?.notes) || ('checklist' in task && task?.checklist) || ('sub_tasks' in task && task?.sub_tasks) ? (
                        <button
                          onClick={() => toggleTaskExpanded(task?.id)}
                          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                        >
                          <svg className={`w-5 h-5 transform transition-transform ${expandedTask === task?.id ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                          </svg>
                        </button>
                      ) : null} */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleTimer(task?.id);
                }}
                className={`p-3 rounded-lg transition-colors ${activeTask === task?.id
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'}`}
              >
                {activeTask === task?.id ? <Pause className='w-5 h-5' /> : <Play className='w-5 h-5' />}
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Task Details */}
        {/* {expandedTask === task?.id && (
                  <div className={`border-t px-6 py-4 ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                      Subtasks
                      <div>
                    <h5 className='font-semibold mb-3 flex items-center'>
                      <CheckSquare className='w-4 h-4 mr-2' />
                      Subtasks (
                      {task?.subtasks.filter((st) => st.completed).length}
                      /
                      {task?.subtasks.length}
                      )
                    </h5>
                    <div className='space-y-2'>
                      {task?.subtasks.map((subtask) => (
                        <div key={subtask?.id} className='flex items-center space-x-3'>
                          <input
                            type='checkbox'
                            checked={subtask?.completed}
                            className='w-4 h-4 text-green-600 rounded'
                            readOnly
                          />
                          <span className={`${subtask?.completed ? 'line-through text-gray-500' : ''}`}>
                            {subtask?.title}
                          </span>
                        </div>
                      ))}
                      {task?.subtasks.length === 0 && (
                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No subtasks</p>
                      )}
                    </div>
                  </div>

                      Checklist
                      <div>
                    <h5 className='font-semibold mb-3 flex items-center'>
                      <Trophy className='w-4 h-4 mr-2' />
                      Checklist (
                      {task?.checklist.filter((item) => item.completed).length}
                      /
                      {task?.checklist.length}
                      )
                    </h5>
                    <div className='space-y-2'>
                      {task?.checklist.map((item) => (
                        <div key={item.id} className='flex items-center space-x-3'>
                          <input
                            type='checkbox'
                            checked={item.completed}
                            className='w-4 h-4 text-purple-600 rounded'
                            readOnly
                          />
                          <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : ''}`}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                    </div>

                    Notes
                    {task?.notes && (
                  <div className='mt-4'>
                    <h5 className='font-semibold mb-2'>Notes</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} bg-gradient-to-r from-purple-50 to-pink-50 ${darkMode ? 'from-purple-900/20 to-pink-900/20' : ''} p-3 rounded-lg`}>
                      {task?.notes}
                    </p>
                  </div>
                )}
                  </div>
                )} */}
      </div>
    </Outline>
  );
};

export default TaskCard;