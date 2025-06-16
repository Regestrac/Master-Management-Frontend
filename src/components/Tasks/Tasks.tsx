import { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import PlusIcon from 'icons/PlusIcon';

import { useTaskStore } from 'src/stores/taskStore';
import { capitalize, formatDuration } from 'src/helpers/utils';
import { getAllTasks } from 'src/services/tasks';

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
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const updateRecentTask = useTaskStore((state) => state.updateRecentTask);

  const taskInputRef = useRef<HTMLInputElement>(null);
  const shouldFetchTasks = useRef(true);

  const navigate = useNavigate();

  const handleCreateTask = () => {
    setOpenForm(true);
  };

  const handleCancel = () => {
    setOpenForm(false);
  };

  const handleSaveTask = () => {
    const element = taskInputRef.current;

    if (element?.value) {
      addTask({ id: tasks.length + 1, title: element?.value || '', status: 'incomplete' as const, timeSpend: 707330 });
      element.value = '';
    }
  };

  const handleDeleteTask = (id: number) => {
    deleteTask(id);
  };

  const handleStartTask = (id: number) => {
    navigate(`/tasks/${id}`);
    const currentTask = tasks?.find((task) => task?.id === id);
    if (currentTask) {
      updateRecentTask(currentTask);
    }
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
          className='border-1 flex-grow md:flex-grow-0 md:order-2 md:mx-auto'
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
              {task?.title}
            </div>
            <div className='flex items-center'>
              <div>{formatDuration(task?.timeSpend)}</div>
              <button className='bg-blue-500 ms-2 p-1 rounded-sm' onClick={() => handleStartTask(task?.id)}>Start</button>
              <button className='bg-red-500 ms-2 p-1 rounded-sm' onClick={() => handleDeleteTask(task?.id)}>Delete</button>
            </div>
          </div>
        ))}
        {openForm ? (
          <div className='w-full flex justify-between mt-3'>
            <input placeholder='Enter Task Name' className='h-10 w-full border-1' ref={taskInputRef} />
            <button onClick={handleSaveTask} className='rounded-l h-10 w-32 border-1'>Save</button>
            <button onClick={handleCancel} className='rounded-l h-10 w-32 border-1 ms-2'>Cancel</button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Tasks;