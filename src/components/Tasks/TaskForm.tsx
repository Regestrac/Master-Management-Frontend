import { useEffect, useRef, useState } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useTaskStore } from 'stores/taskStore';

import Input from 'components/Shared/Input';
import TaskTimer from 'components/Tasks/TaskTimer';
import SelectField from 'components/Shared/SelectField';

import { getTask, updateTask } from 'src/services/tasks';
import { capitalize } from 'src/helpers/utils';
import { SelectOptionType } from 'src/helpers/sharedTypes';

import GenerateDescriptionButtons from './GenerateDescriptionButtons';

type FormDataType = {
  title: string;
  description: string;
  status: { label: string; value: string; };
};

type TaskDetailsType = {
  description: string;
  id: number;
  status: string;
  streak: number;
  time_spend: number;
  title: string;
};

const statusOptions = [
  { label: 'To Do', value: 'todo' },
  { label: 'Incomplete', value: 'incomplete' },
  { label: 'In Progress', value: 'inprogress' },
  { label: 'Complete', value: 'complete' },
];

const TaskForm = () => {
  const [taskDetails, setTaskDetails] = useState({} as TaskDetailsType);
  const [isLoading, setIsLoading] = useState(true);

  const updateCurrentTaskDetails = useTaskStore((state) => state.updateCurrentTaskDetails);

  const shouldFetchTask = useRef(true);

  const { id } = useParams();

  const methods = useForm<FormDataType>();
  const { reset, formState: { dirtyFields }, getValues } = methods;

  const handleUpdateTask = (payload: object) => {
    if (id) {
      updateTask(id, payload).then((res) => {
        reset(getValues());
        toast.success(res?.message || 'Updated successfully');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to update task');
      });
    }
  };

  const handleTitleBlur = (value: string) => {
    if ('title' in dirtyFields) {
      handleUpdateTask({ title: value });
    }
  };

  const handleDescriptionBlur = (value: string) => {
    if ('description' in dirtyFields) {
      handleUpdateTask({ description: value });
    }
  };

  const handleStatusChange = (value: SelectOptionType) => {
    if ('status' in dirtyFields) {
      handleUpdateTask({ status: value?.value });
    }
  };

  useEffect(() => {
    if (id && shouldFetchTask.current) {
      getTask(id).then((fetchedTask) => {
        if (fetchedTask) {
          setTaskDetails(fetchedTask?.data);
          reset({
            title: fetchedTask?.data?.title,
            description: fetchedTask?.data?.description,
            status: { label: capitalize(fetchedTask?.data?.status), value: fetchedTask?.data?.status },
          });
          updateCurrentTaskDetails(fetchedTask?.data);
        }
        setIsLoading(false);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch task details.');
        setIsLoading(false);
      });
      shouldFetchTask.current = false;
    }

    return () => {
      shouldFetchTask.current = true;
    };
  }, [id, reset, updateCurrentTaskDetails]);

  return (
    isLoading ? <div>Loading...</div> : (
      <FormProvider {...methods}>
        <div className='flex flex-col gap-3 sm:flex-row'>
          <Input name='title' label='Task Name' className='flex-1' onBlur={handleTitleBlur} />
          <div className='flex flex-col p-1 rounded-lg shadow-md w-fit'>
            <h3 className='block mb-2 font-medium text-text-light tracking-wide whitespace-nowrap'>Streak:</h3>
            <div className='flex items-center justify-center mt-1'>
              <p className='text-2xl font-mono mt-1'>
                {taskDetails?.streak}
                🔥
              </p>
            </div>
          </div>
        </div>
        <div className='flex gap-10'>
          <div className='flex gap-2'>
            <h3 className='block font-medium text-text-light tracking-wide whitespace-nowrap'>Status:</h3>
            <SelectField name='status' options={statusOptions} isMulti={false} onChange={handleStatusChange} />
          </div>
          <TaskTimer initialTime={taskDetails?.time_spend} />
        </div>
        <GenerateDescriptionButtons />
        <Input name='description' label='Description' type='textarea' rows={6} onBlur={handleDescriptionBlur} />
      </FormProvider>
    )
  );
};

export default TaskForm;