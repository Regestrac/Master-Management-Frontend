import { useEffect, useRef, useState } from 'react';

import { CheckSquare, Plus, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormProvider, useForm } from 'react-hook-form';
import clsx from 'clsx';

import { StatusType } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';
import { useTaskStore } from 'stores/taskStore';

import { createTask, deleteTask, getSubTasks } from 'services/tasks';

import Input from 'components/Shared/Input';
import GenerateSubtasksButtons from 'components/Tasks/ai/GenerateSubtasksButtons';

type SubTaskType = {
  title: string;
  id: number;
  completed_at?: string;
  due_date?: string;
  parent_id: number;
  status: StatusType;
};

type GeneratedTaskType = {
  title: string;
  description: string;
};

const SubTasks = () => {
  const [subtasks, setSubtasks] = useState<SubTaskType[]>([]);
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTaskType[]>([]);

  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const parentTaskId = useTaskStore((state) => state.currentTaskDetails?.parent_id);

  const subtasksFetchedRef = useRef(false);

  const { id } = useParams();

  const navigate = useNavigate();

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
        type: 'task',
      };
      createTask(payload).then((res) => {
        toast.success(res?.message || 'Successfully created task');
        setSubtasks([...subtasks, { ...payload, id: res?.data?.id }]);
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
    }).catch((err) => {
      toast.error(err?.error || 'Failed to delete sub task');
    });
  };

  const handleSubtaskClick = (id: number) => {
    navigate(`/tasks/${id}`);
  };

  useEffect(() => {
    if (!parentTaskId && id && !subtasksFetchedRef.current) {
      getSubTasks(id).then((res) => {
        setSubtasks(res?.data || []);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch subtasks');
      });
      subtasksFetchedRef.current = true;
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
              {Math.round((subtasks.filter((st) => st.status === 'completed').length / subtasks.length) * 100)}
              % Complete
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
              className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300'}`}
            />
            <button
              onClick={handleSubmit(addSubtask)}
              className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
            >
              <Plus className='w-4 h-4' />
            </button>
          </div>
        </FormProvider>

        {/* Subtasks list */}
        <div className='space-y-3'>
          {generatedTasks.length ? (
            <ul className='space-y-2 bg-secondary-bg rounded-xl p-2 mb-4'>
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
                  <p className='font-medium'>
                    {subtask.title}
                  </p>
                  <div className='flex items-center space-x-4 mt-1 text-sm'>
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