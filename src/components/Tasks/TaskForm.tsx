import { useEffect, useRef, useState } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useTaskStore } from 'stores/taskStore';

import Input from 'components/Shared/Input';
import TaskTimer from 'components/Tasks/TaskTimer';

import { generateDescription, getTask, updateTask } from 'src/services/tasks';

type TaskDetailsType = {
  description: string;
  id: number;
  status: string;
  streak: number;
  time_spend: number;
  title: string;
};

const TaskForm = () => {
  const [taskDetails, setTaskDetails] = useState({} as TaskDetailsType);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const updateCurrentTaskDetails = useTaskStore((state) => state.updateCurrentTaskDetails);

  const shouldFetchTask = useRef(true);

  const { id } = useParams();

  const methods = useForm();
  const { reset, formState: { dirtyFields }, getValues, setValue } = methods;

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

  const handleGenerateDescription = () => {
    if (id) {
      generateDescription(id, { topic: getValues('title') }).then((res) => {
        setShowConfirmation(true);
        setValue('description', res?.description);
        toast.success(res?.message || 'Description generated successfully');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to generate description');
      });
    }
  };

  const handleAcceptGeneration = () => {
    handleUpdateTask(getValues());
    setShowConfirmation(false);
  };

  const handleRejectGeneration = () => {
    reset();
    setShowConfirmation(false);
  };

  useEffect(() => {
    if (id && shouldFetchTask.current) {
      getTask(id).then((fetchedTask) => {
        if (fetchedTask) {
          setTaskDetails(fetchedTask?.data);
          reset({
            title: fetchedTask?.data?.title,
            description: fetchedTask?.data?.description,
          });
          updateCurrentTaskDetails({
            description: fetchedTask?.data?.description,
            id: fetchedTask?.data?.id,
            startedAt: fetchedTask?.data?.started_at,
            status: fetchedTask?.data?.status,
            timeSpend: fetchedTask?.data?.time_spend,
            title: fetchedTask?.data?.title,
          });
        }
        setIsLoading(false);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch task details.');
        setIsLoading(false);
      });
      shouldFetchTask.current = false;
    }
  }, [id, reset, updateCurrentTaskDetails]);

  return (
    isLoading ? <div>Loading...</div> : (
      <FormProvider {...methods}>
        <div className='flex flex-col gap-3 sm:flex-row'>
          <Input name='title' label='Task Name' className='flex-1' onBlur={handleTitleBlur} />
          <TaskTimer initialTime={taskDetails?.time_spend} />
        </div>
        <div className='flex justify-end gap-2 mb-0'>
          {showConfirmation ? (
            <>
              <button
                type='button'
                onClick={handleAcceptGeneration}
                className='px-2 py-1 text-xs bg-primary text-text rounded hover:bg-hover-secondary transition-colors duration-200 cursor-pointer'
              >
                Accept
              </button>
              <button
                type='button'
                onClick={handleRejectGeneration}
                className='px-2 py-1 text-xs outline-1 text-text rounded hover:outline-1 hover:bg-hover-secondary transition-colors duration-200 cursor-pointer'
              >
                Close
              </button>
            </>
          ) : (
            <button
              type='button'
              onClick={handleGenerateDescription}
              className='px-2 py-1 text-xs bg-primary text-text rounded hover:bg-hover-primary transition-colors duration-200 cursor-pointer'
            >
              Generate
            </button>
          )}
        </div>
        <Input name='description' label='Description' type='textarea' rows={6} onBlur={handleDescriptionBlur} />
      </FormProvider>
    )
  );
};

export default TaskForm;