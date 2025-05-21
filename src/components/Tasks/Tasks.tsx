import { useRef, useState } from 'react';

import PlusIcon from 'icons/PlusIcon';

import { capitalize, formatDuration } from 'src/helpers/utils';

type TaskType = {
  id: number;
  task: string;
  status: 'incomplete' | 'completed';
  timeSpend: number,
};

const Tasks = () => {
  const [openForm, setOpenForm] = useState(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreateTask = () => {
    setOpenForm(true);
  };

  const handleCancel = () => {
    setOpenForm(false);
  };

  const handleSaveTask = () => {
    const element = inputRef.current;

    if (element?.value) {
      setTasks([...tasks, { id: tasks.length + 1, task: element?.value || '', status: 'incomplete' as const, timeSpend: 707330 }]);
      element.value = '';
    }
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleStartTask = (_id: number) => {

  };

  const totalTasks = tasks.length || 0;

  return (
    <div className='tasks'>
      <div className='flex justify-between items-end'>
        <h3>
          {totalTasks}
          {` ${totalTasks === 1 ? 'Task' : 'Tasks'} Available`}
        </h3>
        <input placeholder='Search Task' className='border-1' />
        <button className='create-task-button' onClick={handleCreateTask}>
          <PlusIcon />
          Create New Task
        </button>
      </div>
      <div className='border-1 rounded-2xl p-2 mt-5'>
        {tasks.map((task) => (
          <div key={task?.id} className='flex justify-between mb-1'>
            <div className='flex'>
              <span className={`${task.status} me-3`}>{capitalize(task?.status)}</span>
              {task?.task}
              <div>{formatDuration(task?.timeSpend)}</div>
            </div>
            <div>
              <button className='bg-blue-500 ms-2 p-1 rounded-sm' onClick={() => handleStartTask(task?.id)}>Start</button>
              <button className='bg-red-500 ms-2 p-1 rounded-sm' onClick={() => handleDeleteTask(task?.id)}>Delete</button>
            </div>
          </div>
        ))}
        {openForm ? (
          <div className='w-full flex justify-between mt-3'>
            <input placeholder='Enter Task Name' className='h-10 w-full border-1' ref={inputRef} />
            <button onClick={handleSaveTask} className='rounded-l h-10 w-32 border-1'>Save</button>
            <button onClick={handleCancel} className='rounded-l h-10 w-32 border-1 ms-2'>Cancel</button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Tasks;