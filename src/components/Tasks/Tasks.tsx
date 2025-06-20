import { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormProvider, useForm } from 'react-hook-form';

import Input from 'components/Shared/Input';

import PlusIcon from 'icons/PlusIcon';
import DeleteIcon from 'icons/DeleteIcon';
import ResumeIcon from 'icons/ResumeIcon';

import { useTaskStore } from 'src/stores/taskStore';
import { capitalize, formatTimeElapsed } from 'src/helpers/utils';
import { createTask, deleteTask, getAllTasks } from 'src/services/tasks';

type TaskType = {
  id: number;
  title: string;
  status: 'incomplete' | 'completed';
  timeSpend: number,
};

const Tasks = () => {
  const [openForm, setOpenForm] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState<TaskType[]>([]);

  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const deleteTaskFromStore = useTaskStore((state) => state.deleteTask);
  const updateRecentTask = useTaskStore((state) => state.updateRecentTask);
  const updateStartTimer = useTaskStore((state) => state.updateStartTimer);

  const shouldFetchTasks = useRef(true);

  const navigate = useNavigate();

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
        status: 'incomplete' as const,
        time_spend: 0,
      };
      createTask(payload).then((res) => {
        toast.success(res?.message || 'Successfully created task');
        addTask({ id: res?.data?.id, title: formData?.title || '', status: 'incomplete' as const, timeSpend: 0 });
        setValue('title', '');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to create task');
      });
    }
  };

  const handleDeleteTask = (id: number) => {
    deleteTask(id).then((res) => {
      toast.success(res.message || 'Task deleted successfully');
      deleteTaskFromStore(id);
    }).catch((err) => {
      toast.error(err.error || 'Failed to delete task!');
    });
  };

  const handleStartTask = (id: number) => {
    navigate(`/tasks/${id}`);
    updateStartTimer(true);
    const currentTask = tasks?.find((task) => task?.id === id);
    if (currentTask) {
      updateRecentTask(currentTask);
    }
  };

  const handleTaskClick = (id: number) => {
    navigate(`/tasks/${id}`);
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setFilteredTasks(tasks?.filter((item) => item.title?.toLowerCase().includes(e?.target?.value?.toLowerCase())));
    } else {
      setFilteredTasks(tasks);
    }
  };

  const totalTasks = tasks.length || 0;

  useEffect(() => {
    if (tasks.length > 0) {
      setFilteredTasks(tasks);
    }
  }, [tasks]);

  useEffect(() => {
    if (shouldFetchTasks.current) {
      getAllTasks().then((res) => {
        addTask(res.data.map((item: any) => ({
          id: item.id,
          status: item.status,
          timeSpend: item.time_spend,
          title: item.title,
        })));
      }).catch((err) => {
        toast.error(err?.error || 'Failed to get tasks');
      });
      shouldFetchTasks.current = false;
    }
  }, [addTask]);

  return (
    <div className='tasks'>
      <div className='flex flex-wrap justify-between items-end gap-4'>
        <input
          placeholder='Search Task'
          className='border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 bg-secondary-bg text-text flex-grow min-w-[220px] sm:min-w-[300px] md:min-w-[400px] lg:min-w-[500px] max-w-full md:flex-grow-0 md:order-2 md:mx-auto'
          onChange={onSearch}
        />
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
      <div className='border-1 rounded-2xl p-2 mt-5'>
        {filteredTasks.map((task) => (
          <div key={task?.id} className='flex justify-between mb-1'>
            <div className='flex'>
              <span className={`${task.status} me-3`}>{capitalize(task?.status)}</span>
              <div className='cursor-pointer' onClick={() => handleTaskClick(task?.id)}>{task?.title}</div>
            </div>
            <div className='flex items-center'>
              <div>{formatTimeElapsed(task?.timeSpend)}</div>
              <button className='bg-blue-500 ms-2 p-1 rounded-sm' onClick={() => handleStartTask(task?.id)}>
                <ResumeIcon />
              </button>
              <button className='bg-red-500 ms-2 p-1 rounded-sm' onClick={() => handleDeleteTask(task?.id)}>
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
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
  );
};

export default Tasks;