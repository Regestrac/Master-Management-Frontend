import { useEffect, useRef, useState } from 'react';

import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

import { useTaskStore } from 'stores/taskStore';

import { getAllTasks } from 'services/tasks';

import TaskFilters from 'components/Tasks/TaskFilters';
import TaskCard from 'components/Tasks/TaskCard';
import CreateTaskCard from 'components/Tasks/CreateTaskCard';
import TaskFiltersSkeleton from 'components/Tasks/TaskFiltersSkeleton';
import TaskListSkeleton from 'components/Tasks/TaskListSkeleton';

const TaskList = () => {
  const [createTask, setCreateTask] = useState(false);
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
      getAllTasks(searchParams.toString()).then((res) => {
        addTask(res?.data, 'replace');
        setLoading(false);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to get tasks');
        setLoading(false);
      });
      previousParams.current = searchParams.toString();
    }
  }, [addTask, searchParams]);

  return (
    <>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
        {loading ? (
          <TaskFiltersSkeleton />
        ) : (
          <TaskFilters />
        )}

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

      {loading ? (
        <TaskListSkeleton />
      ) : (
        <div className='space-y-4'>
          {createTask && <CreateTaskCard handleCancel={handleCancel} />}
          {allTasks.map((task) => <TaskCard key={task.id} task={task} />)}
        </div>
      )}
    </>
  );
};

export default TaskList;