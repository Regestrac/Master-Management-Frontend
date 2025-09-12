import { useEffect, useRef } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useProfileStore } from 'stores/profileStore';
import { useTaskStore } from 'stores/taskStore';

import { updateTask } from 'services/tasks';

import Input from 'components/Shared/Input';
import GenerateDescriptionButtons from 'components/Tasks/ai/GenerateDescriptionButtons';

const TaskDescription = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);

  const taskDetailsRef = useRef({});

  const { id } = useParams();

  const methods = useForm();

  const { reset, getValues } = methods;

  const handleUpdateTask = (payload: object) => {
    if (id && taskDetails?.description !== getValues('description')) {
      updateTask(id, payload).then((res) => {
        reset(getValues());
        toast.success(res?.message || 'Updated successfully');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to update task');
      });
    }
  };

  const saveDescription = () => {
    if (getValues('description')?.trim() && taskDetails?.description !== getValues('description')) {
      handleUpdateTask({ description: getValues('description') });
    }
  };

  useEffect(() => {
    if (taskDetails !== taskDetailsRef.current) {
      reset(taskDetails);
      taskDetailsRef.current = taskDetails;
    }
  }, [reset, taskDetails]);

  return (
    <FormProvider {...methods}>
      <div className='space-y-3'>
        <div className={`rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Description</h3>
              <div className='flex flex-row gap-3'>
                <GenerateDescriptionButtons />
              </div>
            </div>
          </div>
          <div className='p-6'>
            <Input
              name='description'
              type='textarea'
              label=''
              onBlur={saveDescription}
              className={`w-full min-h-80 p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-gray-50 border-gray-300'}`}
              placeholder='Enter task description...'
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default TaskDescription;