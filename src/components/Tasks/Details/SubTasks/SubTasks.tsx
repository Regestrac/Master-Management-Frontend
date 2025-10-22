import { useEffect, useRef, useState } from 'react';

import { CheckSquare, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import dayjs from 'dayjs';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormProvider, useForm } from 'react-hook-form';
import clsx from 'clsx';

import { StatusType } from 'helpers/sharedTypes';
import { getStatusColor } from 'helpers/utils';
import { navigateWithHistory } from 'helpers/navigationUtils';

import { useTaskStore } from 'stores/taskStore';
import { useSettingsStore } from 'stores/settingsStore';

import { createTask, deleteTask, getSubTasks, updateTask } from 'services/tasks';

import Input from 'components/Shared/Input';
import InlineEditableTitle from 'components/Shared/InlineEditableTitle';
import ProgressBar from 'components/Tasks/Details/SubTasks/ProgressBar';
import GenerateSubtasksButtons from 'components/Tasks/ai/GenerateSubtasksButtons';

type SubTaskType = {
  title: string;
  id: number;
  completed_at?: string;
  due_date?: string;
  parent_id: number;
  status: StatusType;
  progress?: number;
  checklist_completed?: number;
  checklist_total?: number;
};

type GeneratedTaskType = {
  title: string;
  description: string;
};

const SubTasks = () => {
  const [subtasks, setSubtasks] = useState<SubTaskType[]>([]);
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTaskType[]>([]);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const parentTaskId = useTaskStore((state) => state.currentTaskDetails?.parent_id);
  const taskType = useTaskStore((state) => state.currentTaskDetails.type);
  const updateTaskDetails = useTaskStore((state) => state.updateCurrentTaskDetails);

  const prevTaskIdRef = useRef('');

  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  const methods = useForm({
    defaultValues: { title: '' },
  });

  const { handleSubmit, setValue } = methods;

  const addSubtask = (formData: { title: string; }) => {
    if (formData?.title && id) {
      const payload = {
        title: formData.title,
        status: 'todo' as const,
        time_spend: 0,
        parent_id: Number(id),
        type: taskType,
      };
      createTask(payload).then((res) => {
        toast.success(res?.message || 'Successfully created task');
        setSubtasks([...subtasks, { ...payload, id: res?.data?.id }]);
        updateTaskDetails({ progress: res?.parent_progress });
        // addTask({ id: res?.data?.id, title: formData?.title || '', status: 'todo' as const, timeSpend: 0 });
        setValue('title', '');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to create task');
      });
    }
  };

  const removeSubtask = (id: number) => {
    deleteTask(id).then((res) => {
      toast.success(res?.message || 'Successfully deleted sub task');
      setSubtasks(subtasks.filter((st) => st.id !== id));
      updateTaskDetails({ progress: res?.parent_progress });
    }).catch((err) => {
      toast.error(err?.error || 'Failed to delete sub task');
    });
  };

  const handleSubtaskClick = (subtaskId: number) => {
    navigateWithHistory(
      navigate,
      `/${taskType}s/${subtaskId}`,
      pathname,
      searchParams,
    );
  };

  const handleSubtaskTitleSave = async (subtaskId: number, newTitle: string) => {
    await updateTask(subtaskId.toString(), { title: newTitle });
    setSubtasks(subtasks.map((st) =>
      st.id === subtaskId ? { ...st, title: newTitle } : st,
    ));
    toast.success('Subtask title updated successfully');
  };

  useEffect(() => {
    if (!parentTaskId && id && id !== prevTaskIdRef.current) {
      getSubTasks(id).then((res) => {
        setSubtasks(res?.data || []);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch subtasks');
      });
      prevTaskIdRef.current = id;
    }
  }, [id, parentTaskId]);

  if (parentTaskId) {
    return null;
  }

  return (
    <div className={`rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold flex items-center'>
            <CheckSquare className='w-5 h-5 mr-2' />
            Subtasks (
            {subtasks.filter((st) => st.status === 'completed').length}
            /
            {subtasks.length}
            )
          </h3>
          <div className='flex flex-row gap-4 text-sm'>
            <GenerateSubtasksButtons generatedTasks={generatedTasks} setGeneratedTasks={setGeneratedTasks} />
            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {subtasks.length ? (
                (Math.round((subtasks.filter((st) => st.status === 'completed').length / subtasks.length) * 100) || 0) + '% Complete'
              ) : 'No subtasks'}
            </span>
          </div>
        </div>
      </div>
      <div className='p-6'>
        {/* Add new subtask */}
        <FormProvider {...methods}>
          <div className='flex space-x-2 mb-6'>
            <Input
              name='title'
              type='text'
              label=''
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(addSubtask)()}
              placeholder='Add a new subtask...'
              className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500 ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300'}`}
            />
            <button
              onClick={handleSubmit(addSubtask)}
              aria-label='Add Subtask'
              className='px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors'
            >
              <Plus className='w-4 h-4' />
            </button>
          </div>
        </FormProvider>

        {/* Subtasks list */}
        <div className='space-y-3'>
          {generatedTasks.length ? (
            <ul className='space-y-2 bg-neutral-900 rounded-xl p-2 mb-4'>
              <div className='text-sm text-gray-500 mb-2'>
                {generatedTasks.length}
                &nbsp;tasks (with description) generated:
              </div>
              {generatedTasks.map((subtask) => (
                <div
                  key={subtask.title}
                  className={clsx('flex items-center justify-between p-4 rounded-lg border transition-colors',
                    darkMode ? 'border-gray-700' : 'border-gray-200',
                  )}
                >
                  <div className='flex items-center space-x-3 flex-1'>
                    <div className='flex-1'>
                      <p className='font-medium'>
                        {subtask.title}
                      </p>
                      <div className='flex items-center space-x-4 mt-1 text-sm'>
                        {/* {subtask.due_date && (
                          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Due:
                            {' '}
                            {dayjs(subtask.due_date).format('MMM DD, YYYY')}
                          </span>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ul>
          ) : null}
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              onClick={() => handleSubtaskClick(subtask.id)}
              className={clsx('flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer',
                darkMode ? 'border-gray-700' : 'border-gray-200',
                subtask.status === 'completed' ? 'opacity-75' : '',
              )}
            >
              <div className='flex items-center space-x-3 flex-1'>
                {/* <button
                  onClick={() => toggleSubtask(subtask.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${subtask.completed
                    ? 'bg-green-500 border-green-500'
                    : darkMode
                      ? 'border-gray-500 hover:border-green-500'
                      : 'border-gray-300 hover:border-green-500'}`}
                >
                  {subtask.completed && <Check className='w-3 h-3 text-white' />}
                </button> */}
                <div className='flex-1'>
                  <InlineEditableTitle
                    title={subtask.title}
                    onSave={(newTitle) => handleSubtaskTitleSave(subtask.id, newTitle)}
                    fontSize='text-base'
                    className='font-medium'
                    placeholder='Enter subtask title...'
                  />
                  <div className='mt-2 space-y-2'>
                    <div className='flex items-center space-x-3'>
                      <span className={`text-xs font-medium min-w-[4rem] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Progress:
                      </span>
                      <ProgressBar
                        progress={subtask.progress || 0}
                        size='sm'
                        showPercentage
                        darkMode={darkMode}
                        className='flex-1'
                      />
                    </div>

                    {/* Metadata Row */}
                    <div className='flex items-center space-x-4 text-sm'>
                      {/* Status Badge */}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subtask.status)}`}>
                        {subtask.status?.toUpperCase()}
                      </span>

                      {/* Checklist Count */}
                      {typeof subtask.checklist_total === 'number' && subtask.checklist_total > 0 && (
                        <div className='flex items-center space-x-1'>
                          <CheckCircle2 className='w-3 h-3 text-blue-500' />
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {subtask.checklist_completed || 0}
                            /
                            {subtask.checklist_total}
                            {' '}
                            checklist
                          </span>
                        </div>
                      )}

                      {subtask.due_date && (
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Due:
                          {' '}
                          {dayjs(subtask.due_date).format('MMM DD, YYYY')}
                        </span>
                      )}
                      {subtask.status === 'completed' && subtask.completed_at && (
                        <span className='text-green-600 dark:text-green-400'>
                          Completed:
                          {' '}
                          {dayjs(subtask.completed_at).format('MMM DD, YYYY')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                {/* <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <Edit3 className='w-4 h-4' />
                </button> */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSubtask(subtask.id);
                  }}
                  className={clsx(
                    'p-2 rounded-lg transition-colors cursor-grab',
                    darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-500',
                  )}
                >
                  <Trash2 className='w-4 h-4' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubTasks;