import { useState } from 'react';

import { toast } from 'react-toastify';
import { FormProvider, useForm } from 'react-hook-form';

import Input from 'components/Shared/Input';
import TaskStats from 'components/Tasks/TaskStats';
import TaskList from 'components/Tasks/TaskList';

import PlusIcon from 'icons/PlusIcon';

import { useTaskStore } from 'src/stores/taskStore';
import { createTask } from 'src/services/tasks';

const Tasks = () => {
  const [openForm, setOpenForm] = useState(false);

  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);

  const methods = useForm({
    defaultValues: { title: '' },
  });

  const { handleSubmit, setValue } = methods;

  const handleCreateTask = () => {
    setOpenForm(true);
  };

  const handleCancel = () => {
    setOpenForm(false);
  };

  const handleSaveTask = (formData: { title: string; }) => {
    if (formData?.title) {
      const payload = {
        title: formData.title,
        status: 'todo' as const,
        time_spend: 0,
      };
      createTask(payload).then((res) => {
        toast.success(res?.message || 'Successfully created task');
        addTask(res?.data);
        setValue('title', '');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to create task');
      });
    }
  };

  const totalTasks = tasks.length || 0;

  return (
    <>
      <TaskStats />
      <TaskList />
      <div className='tasks mt-10'>
        <div className='flex flex-wrap justify-between items-end gap-4'>
          <h3 className='order-2 md:order-1'>
            {totalTasks}
            {` ${totalTasks === 1 ? 'Task' : 'Tasks'} Available`}
          </h3>
          <button
            className='create-task-button order-1 md:order-3 w-full md:w-auto'
            onClick={handleCreateTask}
          >
            <PlusIcon />
            Create New Task
          </button>
        </div>
        <div className='mt-5'>
          {openForm ? (
            <FormProvider {...methods}>
              <div className='w-full flex justify-between mt-3'>
                <Input name='title' label='' placeholder='Enter Task Title' className='h-10 w-full border-1' />
                <button onClick={handleSubmit(handleSaveTask)} className='rounded-l h-10 w-32 border-1'>Save</button>
                <button onClick={handleCancel} className='rounded-l h-10 w-32 border-1 ms-2'>Cancel</button>
              </div>
            </FormProvider>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Tasks;