import { useRef, useState } from 'react';

import PlusIcon from 'icons/PlusIcon';

type TaskType = {
  id: number;
  task: string;
  status: 'incomplete' | 'completed';
};

const Tasks = () => {
  const [openForm, setOpenForm] = useState(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreateTask = () => {
    setOpenForm(true);
  };

  const handleSaveTask = () => {
    const element = inputRef.current;

    if (element?.value) {
      setTasks([...tasks, { id: tasks.length + 1, task: element?.value || '', status: 'incomplete' as const }]);
      element.value = '';
    }
  };

  const totalTasks = tasks.length || 0;

  return (
    <div className='tasks'>
      <div className='flex justify-between items-end'>
        <h3>
          {totalTasks}
          {` ${totalTasks === 1 ? 'Task' : 'Tasks'} Available`}
        </h3>
        <button className='create-task-button' onClick={handleCreateTask}>
          <PlusIcon />
          Create New Task
        </button>
      </div>
      <div className='border-1 rounded-2xl p-2 mt-5'>
        {tasks.map((task) => (
          <div key={task?.id}>
            {task?.task}
          </div>
        ))}
        {openForm ? (
          <div className='w-full flex justify-between'>
            <input placeholder='Enter Task Name' className='h-10 w-full' ref={inputRef} />
            <button onClick={handleSaveTask} className='rounded-l h-10 w-32 border-1'>Save</button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Tasks;