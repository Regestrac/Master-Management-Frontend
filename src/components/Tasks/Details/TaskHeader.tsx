import { useEffect, useRef, useState } from 'react';

import dayjs from 'dayjs';
import { Archive, ArrowLeft, Check, CheckSquare, Copy, Eraser, Moon, MoreVertical, MoveRight, Star, Sun, Trash2, X } from 'lucide-react';
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
    updateCurrentTaskDetails({ ...taskDetails, due_date: formattedDate || '' });
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
    } else if (field === 'title') {
      if (value && value.trim()) {
        handleUpdateTask(taskDetails?.id?.toString(), { title: value.trim() });
        updateTaskState({ id: taskDetails?.id, title: value.trim() });
        updateCurrentTaskDetails({ ...taskDetails, title: value.trim() });
      }
    }
    setEditingField(null);
    setTempValues((prev) => ({ ...prev, [field]: undefined }));
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValues({});
  };

  const handleTitleSave = async (newTitle: string) => {
    await updateTask(taskDetails?.id?.toString(), { title: newTitle });
    updateTaskState({ id: taskDetails?.id, title: newTitle });
    updateCurrentTaskDetails({ ...taskDetails, title: newTitle });
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
      updateCurrentTaskDetails({ ...taskDetails, category: category || '' });
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(taskDetails.status)}`}>
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
                  <div className={`flex items-center space-x-2 px-2 py-1 rounded-lg w-full sm:w-auto ${darkMode ? 'bg-blue-900/30 border border-blue-700/50' : 'bg-blue-50 border border-blue-200'}`}>
                    <span className='w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0' />
                    <div className='flex flex-wrap items-center gap-1 text-xs'>
                      {/* Target Value - Always show for goals */}
                      {editingField === 'targetValue' ? (
                        <div className='flex items-center gap-1'>
                          <input
                            type='number'
                            value={tempValues.targetValue || ''}
                            onChange={(e) => setTempValues((prev) => ({ ...prev, targetValue: e.target.value }))}
                            className={`w-16 px-1 py-0.5 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                            placeholder='0'
                          />
                          <button onClick={() => saveField('targetValue')} className='text-green-500 hover:text-green-600 flex-shrink-0'>
                            <Check className='w-3 h-3' />
                          </button>
                          <button onClick={cancelEditing} className='text-red-500 hover:text-red-600 flex-shrink-0'>
                            <X className='w-3 h-3' />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing('targetValue', taskDetails.target_value || '')}
                          className={`font-medium hover:underline whitespace-nowrap ${taskDetails?.target_value
                            ? (darkMode ? 'text-blue-300' : 'text-blue-700')
                            : (darkMode ? 'text-gray-500' : 'text-gray-400')}`}
                        >
                          {taskDetails.target_value || 'Set target'}
                        </button>
                      )}

                      {/* Target Type - Always show for goals */}
                      <DropDown options={TARGET_TYPE_OPTIONS} onSelect={handleTargetTypeChange} value={taskDetails?.target_type} isMulti={false}>
                        <span
                          className={`font-medium cursor-pointer hover:underline whitespace-nowrap ${taskDetails?.target_type
                            ? (darkMode ? 'text-blue-300' : 'text-blue-700')
                            : (darkMode ? 'text-gray-500' : 'text-gray-400')}`}
                        >
                          {taskDetails?.target_type
                            ? TARGET_TYPE_OPTIONS.find((opt) => opt.value === taskDetails.target_type)?.label
                            : 'Select type'
                          }
                        </span>
                      </DropDown>

                      {/* Target Frequency - Always show for goals */}
                      <span className={`flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>•</span>
                      <DropDown options={TARGET_FREQUENCY_OPTIONS} onSelect={handleTargetFrequencyChange} value={taskDetails?.target_frequency} isMulti={false}>
                        <span
                          className={`font-medium cursor-pointer hover:underline whitespace-nowrap ${taskDetails?.target_frequency
                            ? (darkMode ? 'text-blue-300' : 'text-blue-700')
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