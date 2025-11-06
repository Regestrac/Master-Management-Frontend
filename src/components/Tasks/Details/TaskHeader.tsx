import { useEffect, useRef, useState, useCallback } from 'react';

import dayjs from 'dayjs';
import { Archive, ArrowLeft, Check, CheckSquare, Copy, Eraser, Moon, MoreVertical, MoveRight, Star, Sun, Trash2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormProvider, useForm } from 'react-hook-form';

import { capitalize, getPriorityColor, getStatusColor } from 'helpers/utils';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from 'helpers/configs';
import { TaskType, TargetType, TargetFrequency } from 'helpers/sharedTypes';
import { navigateBack } from 'helpers/navigationUtils';

import { useTaskStore } from 'stores/taskStore';
import { useSettingsStore } from 'stores/settingsStore';

import { updateTask, getCategories } from 'services/tasks';
import { updateTheme } from 'services/settings';

import DropDown from 'components/Shared/Dropdown';
import DatePicker from 'components/Shared/DatePicker';
import InlineEditableTitle from 'components/Shared/InlineEditableTitle';
import TaskCategory from 'components/Tasks/Details/TaskCategory';

type DueDateFormType = {
  due_date: Date | null;
};

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

const defaultCategories = [
  'Personal',
  'Work',
  'Health',
  'Education',
  'Entertainment',
  'Hobbies',
  'Other',
];

const TaskHeader = () => {
  const [editingField, setEditingField] = useState<any>(null);
  const [tempValues, setTempValues] = useState({} as Record<string, string>);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const targetValueRef = useRef<HTMLDivElement>(null);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);
  const updateTaskState = useTaskStore((state) => state.updateTask);
  const updateCurrentTaskDetails = useTaskStore((state) => state.updateCurrentTaskDetails);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  const shouldFetchCategoriesRef = useRef(true);

  const methods = useForm<DueDateFormType>({
    defaultValues: {
      due_date: taskDetails?.due_date ? new Date(taskDetails.due_date) : null,
    },
  });

  const { setValue } = methods;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleBackClick = () => {
    navigateBack(navigate, searchParams, '/dashboard');
  };

  const handleUpdateTask = (id: string, payload: object) => {
    updateTask(id, payload).then((res) => {
      toast.success(res?.message || 'Updated successfully');
    }).catch((err) => {
      toast.error(err?.error || 'Failed to update task');
    });
  };

  const handleDueDateChange = (date: Date | null) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    handleUpdateTask(taskDetails?.id?.toString(), { due_date: formattedDate || null });
    updateTaskState({ id: taskDetails?.id, due_date: formattedDate || '' });
    updateCurrentTaskDetails({ due_date: formattedDate || '' });
  };

  const handlePriorityChange = (value: string | null) => {
    if (taskDetails?.priority !== value) {
      handleUpdateTask(taskDetails?.id?.toString(), { priority: value || '' });
      updateTaskState({ id: taskDetails?.id, priority: value as TaskType['priority'] });
      updateCurrentTaskDetails({ priority: value as TaskType['priority'] });
    }
  };

  const handleStatusChange = (value: string | null) => {
    if (taskDetails?.status !== value) {
      handleUpdateTask(taskDetails?.id?.toString(), { status: value });
      updateTaskState({ id: taskDetails?.id, status: value as TaskType['status'] });
      updateCurrentTaskDetails({ status: value as TaskType['status'] });
    }
  };

  const handleTargetTypeChange = (value: string | null) => {
    if (taskDetails?.target_type !== value) {
      handleUpdateTask(taskDetails?.id?.toString(), { target_type: value });
      updateTaskState({ id: taskDetails?.id, target_type: value as TargetType });
      updateCurrentTaskDetails({ target_type: value as TargetType });
    }
  };

  const handleTargetFrequencyChange = (value: string | null) => {
    if (taskDetails?.target_frequency !== value) {
      handleUpdateTask(taskDetails?.id?.toString(), { target_frequency: value });
      updateTaskState({ id: taskDetails?.id, target_frequency: value as TargetFrequency });
      updateCurrentTaskDetails({ target_frequency: value as TargetFrequency });
    }
  };

  const startEditing = (field: any, currentValue: any) => {
    setEditingField(field);
    setTempValues((prev) => ({ ...prev, [field]: currentValue }));
  };

  const saveField = useCallback((field: any) => {
    const value = tempValues[field];
    let shouldSave = false;

    if (field === 'targetValue') {
      const newValue = value ? Number(value) : null;
      if (newValue !== taskDetails.target_value) {
        handleUpdateTask(taskDetails?.id?.toString(), { target_value: newValue });
        updateTaskState({ id: taskDetails?.id, target_value: newValue });
        updateCurrentTaskDetails({ target_value: newValue });
        shouldSave = true;
      }
    } else if (field === 'dueDate') {
      if (value !== taskDetails.due_date) {
        handleUpdateTask(taskDetails?.id?.toString(), { due_date: value });
        updateTaskState({ id: taskDetails?.id, due_date: value });
        updateCurrentTaskDetails({ due_date: value });
        shouldSave = true;
      }
    } else if (field === 'title') {
      const newTitle = value?.trim();
      if (newTitle && newTitle !== taskDetails.title) {
        handleUpdateTask(taskDetails?.id?.toString(), { title: newTitle });
        updateTaskState({ id: taskDetails?.id, title: newTitle });
        updateCurrentTaskDetails({ title: newTitle });
        shouldSave = true;
      }
    }

    setEditingField(null);
    setTempValues((prev) => ({ ...prev, [field]: undefined }));

    if (shouldSave) {
      toast.success('Changes saved');
    } else {
      toast.info('No changes to save');
    }
  }, [taskDetails, tempValues, updateCurrentTaskDetails, updateTaskState]);

  const cancelEditing = useCallback(() => {
    setEditingField(null);
    setTempValues({});
  }, []);

  // Handle click outside to close the popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (targetValueRef.current && !targetValueRef.current.contains(event.target as Node)) {
        if (editingField === 'targetValue') {
          const value = tempValues.targetValue;
          if (value && !isNaN(Number(value)) && Number(value) > 0) {
            // Only save if the value is different from the current one
            if (Number(value) !== taskDetails.target_value) {
              saveField('targetValue');
            } else {
              cancelEditing();
            }
          } else {
            cancelEditing();
          }
        }
      }
    };

    // Handle Escape key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancelEditing();
      } else if (event.key === 'Enter' && editingField === 'targetValue') {
        const value = tempValues.targetValue;
        if (value && !isNaN(Number(value)) && Number(value) > 0) {
          // Only save if the value is different from the current one
          if (Number(value) !== taskDetails.target_value) {
            saveField('targetValue');
          } else {
            cancelEditing();
          }
        } else {
          cancelEditing();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editingField, tempValues, cancelEditing, saveField, taskDetails.target_value]);

  const handleTitleSave = async (newTitle: string) => {
    await updateTask(taskDetails?.id?.toString(), { title: newTitle });
    updateTaskState({ id: taskDetails?.id, title: newTitle });
    updateCurrentTaskDetails({ title: newTitle });
    toast.success('Task title updated successfully');
  };

  const handleMoreOptionSelect = (_option: any) => {
  };

  useEffect(() => {
    setValue('due_date', taskDetails?.due_date ? new Date(taskDetails.due_date) : null);
  }, [setValue, taskDetails?.due_date]);

  useEffect(() => {
    // Fetch categories on component mount
    if (shouldFetchCategoriesRef.current) {
      getCategories().then((res) => {
        if (res?.categories) {
          setCategories(res.categories);
        }
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch categories');
      });
      shouldFetchCategoriesRef.current = false;
    }
  }, []);

  const handleCategoryChange = (category: string | null) => {
    if (taskDetails?.category !== category) {
      handleUpdateTask(taskDetails?.id?.toString(), { category: category || '' });
      updateTaskState({ id: taskDetails?.id, category: category || '' });
      updateCurrentTaskDetails({ category: category || '' });
    }
  };

  const updateAppTheme = () => {
    updateSettings({ theme: darkMode ? 'light' : 'dark' });
    updateTheme({ theme: darkMode ? 'light' : 'dark' }).then((res) => {
      updateSettings({ theme: res?.theme });
    }).catch((err) => {
      toast.error(err?.error);
    });
  };

  return (
    <FormProvider {...methods}>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between 2xl:me-12 gap-4'>
        <div className='flex items-start lg:items-center space-x-3 lg:space-x-4'>
          <button
            className={`p-2 rounded-lg transition-colors cursor-pointer flex-shrink-0 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            aria-label='Back'
            onClick={handleBackClick}
          >
            <ArrowLeft className='w-5 h-5' />
          </button>
          <div className='flex items-start lg:items-center space-x-3 flex-1 min-w-0'>
            <div className='w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0'>
              <CheckSquare className='w-4 h-4 text-white' />
            </div>
            <div className='flex-1 min-w-0'>
              <InlineEditableTitle
                title={taskDetails.title}
                onSave={handleTitleSave}
                fontSize='text-lg lg:text-xl'
                className='font-bold'
                placeholder='Enter task title...'
              />
              <div className='flex flex-wrap items-center gap-2 mt-1'>
                <DropDown options={STATUS_OPTIONS} onSelect={handleStatusChange} hideClear value={taskDetails?.status} isMulti={false}>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(taskDetails.status, darkMode)}`}>
                    {taskDetails?.status?.toUpperCase()}
                  </span>
                </DropDown>
                <DropDown options={PRIORITY_OPTIONS} onSelect={handlePriorityChange} value={taskDetails?.priority} isMulti={false}>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityColor(taskDetails.priority)}`}>
                    {capitalize(taskDetails.priority) || 'No'}
                    {' '}
                    priority
                  </span>
                </DropDown>

                <TaskCategory
                  value={taskDetails?.category || ''}
                  categories={categories}
                  onChange={handleCategoryChange}
                  onCreateCategory={handleCategoryChange}
                  placeholder='Add category'
                />

                {/* Target Configuration Display */}
                {taskDetails?.type === 'goal' && (
                  <div className={`relative flex items-center space-x-2 px-2 py-1 rounded-lg w-full sm:w-auto ${darkMode ? 'bg-primary-900/40 border border-primary-700/50' : 'bg-primary-50 border border-primary-200'}`}>
                    <span className='w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0' />
                    <div className='flex flex-wrap items-center gap-1 text-xs'>
                      {/* Target Value - Always show for goals */}
                      <div className='relative'>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing('targetValue', taskDetails.target_value || '');
                          }}
                          className={`px-2 py-1 text-xs rounded-md transition-colors whitespace-nowrap ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'} ${taskDetails?.target_value ? (darkMode ? 'text-primary-300' : 'text-primary-700') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                        >
                          {taskDetails.target_value || 'Set target'}
                        </button>

                        {/* Popup for editing */}
                        {editingField === 'targetValue' && (
                          <div
                            ref={targetValueRef}
                            className={`absolute z-10 mt-1 p-2 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
                            style={{ width: '220px' }}
                          >
                            <div className='flex items-center gap-2'>
                              <input
                                type='number'
                                value={tempValues.targetValue || ''}
                                onChange={(e) => setTempValues((prev) => ({ ...prev, targetValue: e.target.value }))}
                                className={`no-spinners w-full px-3 py-1.5 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                placeholder='Enter target value'
                                autoFocus
                                min='1'
                                step='1'
                                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                onWheel={(e) => e.currentTarget.blur()}
                              />
                              <button
                                onClick={() => {
                                  const value = tempValues.targetValue;
                                  if (value && !isNaN(Number(value)) && Number(value) > 0) {
                                    // Only save if the value is different from the current one
                                    if (Number(value) !== taskDetails.target_value) {
                                      saveField('targetValue');
                                    } else {
                                      cancelEditing();
                                    }
                                  } else {
                                    cancelEditing();
                                  }
                                }}
                                className={`p-1.5 rounded-md ${darkMode ? 'text-green-400 hover:bg-gray-700' : 'text-green-600 hover:bg-gray-100'}`}
                                aria-label='Save'
                              >
                                <Check className='w-4 h-4' />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Target Type - Always show for goals */}
                      <DropDown options={TARGET_TYPE_OPTIONS} onSelect={handleTargetTypeChange} value={taskDetails?.target_type} isMulti={false}>
                        <span
                          className={`font-medium cursor-pointer hover:underline whitespace-nowrap ${taskDetails?.target_type
                            ? (darkMode ? 'text-primary-400' : 'text-primary-600')
                            : (darkMode ? 'text-gray-500' : 'text-gray-400')}`}
                        >
                          {taskDetails?.target_type
                            ? TARGET_TYPE_OPTIONS.find((opt) => opt.value === taskDetails.target_type)?.label
                            : 'Select type'
                          }
                        </span>
                      </DropDown>

                      {/* Target Frequency - Always show for goals */}
                      <span className={`flex-shrink-0 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>•</span>
                      <DropDown options={TARGET_FREQUENCY_OPTIONS} onSelect={handleTargetFrequencyChange} value={taskDetails?.target_frequency} isMulti={false}>
                        <span
                          className={`font-medium cursor-pointer hover:underline whitespace-nowrap ${taskDetails?.target_frequency
                            ? (darkMode ? 'text-primary-400' : 'text-primary-600')
                            : (darkMode ? 'text-gray-500' : 'text-gray-400')}`}
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

                {/* Due Date with DatePicker */}
                <div className='flex items-center gap-2'>
                  <span className={`text-sm whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Due:</span>
                  <div className='min-w-[120px] sm:min-w-[140px]'>
                    <DatePicker
                      name='due_date'
                      placeholder='Set due date'
                      className='text-xs'
                      onChange={handleDueDateChange}
                    />
                  </div>
                </div>

                <div className='flex items-center gap-1'>
                  <span className={`text-sm whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Streak:</span>
                  <span className='text-sm font-medium hover:text-purple-500 transition-colors whitespace-nowrap'>
                    {taskDetails.streak}
                    🔥
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2 flex-shrink-0 max-sm:hidden'>
          <button
            onClick={updateAppTheme}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            aria-label='Theme'
          >
            {darkMode ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
          </button>
          <DropDown options={moreOptions} onSelect={handleMoreOptionSelect} hideClear value={null}>
            <div className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <MoreVertical className='w-5 h-5' />
            </div>
          </DropDown>
        </div>

      </div>
    </FormProvider>
  );
};

export default TaskHeader;