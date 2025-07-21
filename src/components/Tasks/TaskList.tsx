import { useEffect, useRef, useState } from 'react';

import { Plus } from 'lucide-react';
import { useTaskStore } from 'stores/taskStore';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

import { getAllTasks } from 'src/services/tasks';

import TaskFilters from './TaskFilters';
import TaskCard from './TaskCard';
import CreateTaskCard from './CreateTaskCard';

const TaskList = () => {
  const [createTask, setCreateTask] = useState(false);

  const allTasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);

  const previousParams = useRef('');

  // const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const handleCreateTask = () => {
    // navigate('/task/create');
    setCreateTask(true);
  };

  const handleCancel = () => {
    setCreateTask(false);
  };

  useEffect(() => {
    if (previousParams.current !== searchParams.toString()) {
      getAllTasks(searchParams.toString()).then((res) => {
        addTask(res?.data, 'replace');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to get tasks');
      });
      previousParams.current = searchParams.toString();
    }
  }, [addTask, searchParams]);

  return (
    <>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>

        <TaskFilters />

        <div className='flex items-center gap-4'>
          <button
            onClick={handleCreateTask}
            className='flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
          >
            <Plus className='w-4 h-4' />
            <span>New Task</span>
          </button>
        </div>
      </div>
      <div className='space-y-4'>
        {createTask && <CreateTaskCard handleCancel={handleCancel} />}
        {allTasks.map((task) => <TaskCard key={task.id} task={task} />)}
      </div>
    </>
  );
};

export default TaskList;