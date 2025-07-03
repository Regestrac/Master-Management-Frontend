import { useState } from 'react';

import { BarChart3, Calendar, CheckSquare, Clock, Flame, Pause, Play, Plus } from 'lucide-react';
import { useThemeStore } from 'stores/themeStore';
import { useTaskStore } from 'stores/taskStore';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Dropdown from 'components/Shared/Dropdown';
import Outline from 'components/Shared/Outline';

import { formatTimeElapsed } from 'src/helpers/utils';
import { updateTask } from 'src/services/tasks';
import { TaskType } from 'src/helpers/sharedTypes';
import { updateActiveTask } from 'src/services/profile';

const priorityOptions = [
  { label: 'High', value: 'high', color: '#fb2c36' },
  { label: 'Normal', value: 'normal', color: '#efb100' },
  { label: 'Low', value: 'low', color: '#00c951' },
];

const statusOptions = [
  { label: 'To Do', value: 'todo', color: '#3b82f6' },
  { label: 'In Progress', value: 'inprogress', color: '#f59e0b' },
  { label: 'Pending', value: 'pending', color: '#a855f7' },
  { label: 'Paused', value: 'paused', color: '#6b7280' },
  { label: 'Completed', value: 'completed', color: '#22c55e' },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'normal':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-400 bg-green-400/10';
    case 'todo':
      return 'text-blue-400 bg-blue-400/10';
    case 'inprogress':
      return 'text-yellow-400 bg-blue-400/10';
    case 'pending':
      return 'text-violet-400 bg-gray-400/10';
    case 'paused':
      return 'text-gray-400 bg-yellow-400/10';
    default:
      return 'text-gray-400 bg-gray-400/10';
  }
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

const TaskList = () => {
  const [taskFilter, setTaskFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [viewMode, setViewMode] = useState('list');
  const [_showCreateTask, setShowCreateTask] = useState(false);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [activeTask, setActiveTask] = useState<number | null>(null);

  const darkMode = useThemeStore((state) => state.theme) === 'dark';
  const allTasks = useTaskStore((state) => state.tasks);
  const updateTaskState = useTaskStore((state) => state.updateTask);

  const navigate = useNavigate();

  const getFilteredTasks = () => {
    let filtered = allTasks;

    if (taskFilter !== 'all') {
      filtered = filtered.filter((task) => task.status === taskFilter);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return (() => {
            const priorityOrder: Record<string, number> = { high: 3, normal: 2, low: 1 };
            return (priorityOrder[b.priority] - priorityOrder[a.priority]);
          })();
        case 'dueDate':
          return (new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  };

  const handleUpdateTask = (id: string, payload: object) => {
    updateTask(id, payload).then((res) => {
      // reset(getValues());
      toast.success(res?.message || 'Updated successfully');
    }).catch((err) => {
      toast.error(err?.error || 'Failed to update task');
    });
  };

  const toggleTaskExpanded = (taskId: number) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const toggleTimer = (taskId: number) => {
    updateActiveTask({ active_task: activeTask === taskId ? null : taskId }).then((res) => {
      toast.success(res?.message);
      setActiveTask(activeTask === taskId ? null : taskId);
    }).catch((err) => {
      toast.error(err?.error);
    });
  };

  return (
    <>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
        <div className='flex flex-wrap items-center gap-4'>
          <select
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${darkMode
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value='all'>All Tasks</option>
            <option value='pending'>Pending</option>
            <option value='in-progress'>In Progress</option>
            <option value='completed'>Completed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${darkMode
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value='priority'>Sort by Priority</option>
            <option value='dueDate'>Sort by Due Date</option>
            <option value='status'>Sort by Status</option>
          </select>

          <div className='flex rounded-lg border border-gray-300 overflow-hidden'>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}
            >
              <CheckSquare className='w-4 h-4' />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 ${viewMode === 'kanban' ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}
            >
              <BarChart3 className='w-4 h-4' />
            </button>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          {/* {selectedTasks.length > 0 && (
            <div className='flex items-center gap-2'>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {selectedTasks.length}
                {' '}
                selected
              </span>
              <button className='px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600'>
                Delete
              </button>
              <button className='px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600'>
                Complete
              </button>
            </div>
          )} */}
          <button
            onClick={() => setShowCreateTask(true)}
            className='flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
          >
            <Plus className='w-4 h-4' />
            <span>New Task</span>
          </button>
        </div>
      </div>
      <div className='space-y-4'>
        {getFilteredTasks().map((task) => {
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
            navigate(`/tasks/${task?.id}`);
          };

          return (
            <Outline colors={['bg-primary-500', 'bg-secondary-500']} width='3px' variant='rotate' key={task.id} disabled={activeTask !== task?.id}>
              <div
                key={task.id}
                className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
                onClick={handleTaskClick}
              >
                <div className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-4 flex-1'>
                      {/* <input
                      type='checkbox'
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => toggleTaskSelection(task.id)}
                      className='w-4 h-4 text-purple-600 rounded focus:ring-purple-500'
                    /> */}
                      <Dropdown options={priorityOptions} onSelect={handlePrioritySelect} value={task.priority}>
                        <div className={`w-3 h-3 rounded-full cursor-pointer hover:scale-120 ${getPriorityColor(task.priority)}`} />
                      </Dropdown>
                      <div className='flex-1'>
                        <div className='flex items-center gap-3 mb-2'>
                          <h4 className='font-semibold text-lg cursor-text'>{task.title}</h4>
                          {task.category && (
                            <span className={`px-2 py-1 rounded text-xs font-medium cursor-default ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                              {task.category}
                            </span>
                          )}
                        </div>
                        {/* <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-3`}>
                        {task.description}
                      </p> */}
                        <div className='flex flex-wrap items-center gap-4 text-sm'>
                          <Dropdown options={statusOptions} onSelect={handleStatusSelect} value={task.status} hideClear>
                            <span className={`px-3 py-1 rounded-full font-medium cursor-grab ${getStatusColor(task.status)}`}>
                              {task?.status?.toUpperCase()}
                            </span>
                          </Dropdown>
                          <span className={` cursor-default ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center`}>
                            <Clock className='w-4 h-4 mr-1' />
                            {formatTimeElapsed(task.time_spend)}
                          </span>
                          {task.due_date && (
                            <span className={` cursor-default ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center`}>
                              <Calendar className='w-4 h-4 mr-1' />
                              {formatDate(task.due_date)}
                            </span>
                          )}
                          {task.streak > 0 && (
                            <span className='text-orange-500 flex items-center cursor-default'>
                              <Flame className='w-4 h-4 mr-1' />
                              {task.streak}
                              {' '}
                              day streak
                            </span>
                          )}
                          {/* <div className='flex gap-1'>
                          {task.tags.map((tag, index) => (
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
                      {('notes' in task && task?.notes) || ('checklist' in task && task.checklist) || ('sub_tasks' in task && task.sub_tasks) ? (
                        <button
                          onClick={() => toggleTaskExpanded(task.id)}
                          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                        >
                          <svg className={`w-5 h-5 transform transition-transform ${expandedTask === task.id ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                          </svg>
                        </button>
                      ) : null}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTimer(task.id);
                        }}
                        className={`p-3 rounded-lg transition-colors ${activeTask === task.id
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'}`}
                      >
                        {activeTask === task.id ? <Pause className='w-5 h-5' /> : <Play className='w-5 h-5' />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Task Details */}
                {expandedTask === task.id && (
                  <div className={`border-t px-6 py-4 ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                      {/* Subtasks */}
                      {/* <div>
                    <h5 className='font-semibold mb-3 flex items-center'>
                      <CheckSquare className='w-4 h-4 mr-2' />
                      Subtasks (
                      {task.subtasks.filter((st) => st.completed).length}
                      /
                      {task.subtasks.length}
                      )
                    </h5>
                    <div className='space-y-2'>
                      {task.subtasks.map((subtask) => (
                        <div key={subtask.id} className='flex items-center space-x-3'>
                          <input
                            type='checkbox'
                            checked={subtask.completed}
                            className='w-4 h-4 text-green-600 rounded'
                            readOnly
                          />
                          <span className={`${subtask.completed ? 'line-through text-gray-500' : ''}`}>
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                      {task.subtasks.length === 0 && (
                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No subtasks</p>
                      )}
                    </div>
                  </div> */}

                      {/* Checklist */}
                      {/* <div>
                    <h5 className='font-semibold mb-3 flex items-center'>
                      <Trophy className='w-4 h-4 mr-2' />
                      Checklist (
                      {task.checklist.filter((item) => item.completed).length}
                      /
                      {task.checklist.length}
                      )
                    </h5>
                    <div className='space-y-2'>
                      {task.checklist.map((item) => (
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
                  </div> */}
                    </div>

                    {/* Notes */}
                    {/* {task.notes && (
                  <div className='mt-4'>
                    <h5 className='font-semibold mb-2'>Notes</h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} bg-gradient-to-r from-purple-50 to-pink-50 ${darkMode ? 'from-purple-900/20 to-pink-900/20' : ''} p-3 rounded-lg`}>
                      {task.notes}
                    </p>
                  </div>
                )} */}
                  </div>
                )}
              </div>
            </Outline>
          );
        })}
      </div>
    </>
  );
};

export default TaskList;