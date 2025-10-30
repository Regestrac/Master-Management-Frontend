import { useEffect, useRef, useState } from 'react';

import { CheckCircle2, CheckSquare, Plus, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormProvider, useForm } from 'react-hook-form';
import clsx from 'clsx';

import { TaskType } from 'helpers/sharedTypes';
import { getStatusColor } from 'helpers/utils';
import { navigateWithHistory } from 'helpers/navigationUtils';
import { STATUS_OPTIONS } from 'helpers/configs';

import { useTaskStore } from 'stores/taskStore';
import { useSettingsStore } from 'stores/settingsStore';

import { createTask, deleteTask, getSubTasks, updateTask } from 'services/tasks';

import Input from 'components/Shared/Input';
import InlineEditableTitle from 'components/Shared/InlineEditableTitle';
import ProgressBar from 'components/Tasks/Details/SubTasks/ProgressBar';
import GenerateSubtasksButtons from 'components/Tasks/ai/GenerateSubtasksButtons';
import Dropdown from 'components/Shared/Dropdown';

type GeneratedTaskType = {
  title: string;
  description: string;
};

const SubTasks = () => {
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTaskType[]>([]);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const parentTaskId = useTaskStore((state) => state.currentTaskDetails?.parent_id);
  const taskType = useTaskStore((state) => state.currentTaskDetails.type);
  const subtasks = useTaskStore((state) => state.currentTaskDetails.subtasks);
  const currentTaskId = useTaskStore((state) => state.currentTaskDetails.id);
  const updateTaskState = useTaskStore((state) => state.updateTask);
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
      } as any;
      createTask(payload).then((res) => {
        toast.success(res?.message || 'Successfully created task');
        updateTaskDetails({ subtasks: [...subtasks, { ...payload, id: res?.data?.id }] });
        updateTaskDetails({ progress: res?.parent_progress });
        setValue('title', '');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to create task');
      });
    }
  };

  const removeSubtask = (id: number) => {
    deleteTask(id).then((res) => {
      toast.success(res?.message || 'Successfully deleted sub task');
      updateTaskDetails({ subtasks: subtasks.filter((st) => st.id !== id) });
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
    updateTaskDetails({
      subtasks: subtasks.map((st) =>
        st.id === subtaskId ? { ...st, title: newTitle } : st,
      ),
    });
    toast.success('Subtask title updated successfully');
  };

  const handleUpdateTask = (id: string, payload: object) => {
    updateTask(id, payload).then((res) => {
      updateTaskDetails({ progress: res?.parent_progress });
      updateTaskDetails({
        subtasks: subtasks.map((st) =>
          st.id === Number(id) ? { ...st, ...payload } : st,
        ),
      });
      toast.success(res?.message || 'Updated successfully');
    }).catch((err) => {
      toast.error(err?.error || 'Failed to update task');
    });
  };

  const handleStatusSelect = (value: string | null, id: number) => {
    const currStatus = subtasks.find((st) => st.id === id)?.status;

    if (id && currStatus !== value) {
      handleUpdateTask(id.toString(), { status: value });
      updateTaskState({ id, status: value as TaskType['status'] });
    }
  };

  useEffect(() => {
    if (!parentTaskId && id && id !== prevTaskIdRef.current && currentTaskId === Number(id)) {
      updateTaskDetails({ subtasks: [] });
      getSubTasks(id).then((res) => {
        updateTaskDetails({ subtasks: res?.data || [] });
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch subtasks');
      });
      prevTaskIdRef.current = id;
    }
  }, [id, parentTaskId, updateTaskDetails, currentTaskId]);

  if (parentTaskId) {
    return null;
  }

  return (
    <div
      className={clsx(
        'rounded-xl border transition-colors',
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
      )}
    >
      <div className={clsx('p-6 border-b', darkMode ? 'border-gray-700' : 'border-gray-200')}>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold flex items-center'>
            <CheckSquare className='w-5 h-5 mr-2' />
            Subtasks (
            {subtasks?.filter((st) => st.status === 'completed').length}
            /
            {subtasks?.length}
            )
          </h3>
          <div className='flex flex-row gap-4 text-sm'>
            <GenerateSubtasksButtons generatedTasks={generatedTasks} setGeneratedTasks={setGeneratedTasks} />
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {subtasks?.length ? (
                (Math.round((subtasks?.filter((st) => st.status === 'completed').length / subtasks?.length) * 100) || 0) + '% Complete'
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
              className={clsx(
                'flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500',
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300',
              )}
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
          {generatedTasks?.length ? (
            <ul className={clsx('space-y-2 rounded-xl p-2 mb-4', darkMode ? 'bg-gray-800' : 'bg-gray-50')}>
              <div className={clsx('text-sm mb-2', darkMode ? 'text-gray-400' : 'text-gray-500')}>
                {generatedTasks?.length}
                &nbsp;tasks (with description) generated:
              </div>
              {generatedTasks?.map((subtask) => (
                <div
                  key={subtask.title}
                  className={clsx(
                    'flex items-center justify-between p-4 rounded-lg border transition-colors',
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
                          <span className={clsx(darkMode ? 'text-gray-400' : 'text-gray-600')}>
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
          {subtasks?.map((subtask) => (
            <div
              key={subtask.id}
              onClick={() => handleSubtaskClick(subtask.id)}
              className={clsx(
                'flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer',
                darkMode ? 'border-gray-700' : 'border-gray-200',
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
                      <span
                        className={clsx(
                          'text-xs font-medium min-w-[4rem]',
                          darkMode ? 'text-gray-400' : 'text-gray-600',
                        )}
                      >
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
                      <Dropdown
                        options={STATUS_OPTIONS}
                        onSelect={(value) => handleStatusSelect(value, subtask?.id)}
                        value={subtask?.status}
                        hideClear
                        isMulti={false}
                      >
                        <span className={clsx('px-3 py-1 rounded-full text-xs font-medium cursor-grab', getStatusColor(subtask?.status, darkMode))}>
                          {subtask?.status?.toUpperCase()}
                        </span>
                      </Dropdown>

                      {/* Checklist Count */}
                      {typeof subtask.checklist_total === 'number' && subtask.checklist_total > 0 && (
                        <div className='flex items-center space-x-1'>
                          <CheckCircle2 className='w-3 h-3 text-blue-500' />
                          <span className={clsx('text-xs', darkMode ? 'text-gray-400' : 'text-gray-600')}>
                            {subtask.checklist_completed || 0}
                            /
                            {subtask.checklist_total}
                            {' '}
                            checklist
                          </span>
                        </div>
                      )}

                      {subtask.due_date ? (
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Due:
                          {' '}
                          {dayjs(subtask.due_date).format('MMM DD, YYYY')}
                        </span>
                      ) : null}
                      {subtask.status === 'completed' && subtask.completed_at && (
                        <span className={darkMode ? 'text-green-400' : 'text-green-600'}>
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
                {/* <button className={clsx('p-2 rounded-lg transition-colors', darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}>
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