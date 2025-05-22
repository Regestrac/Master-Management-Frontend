import { useState } from 'react';

import TaskTimer from './TaskTimer';

const TaskDetail = () => {
  const [taskName, setTaskName] = useState('Task 1 - Do Something');
  const [description, setDescription] = useState(
    'This task is about doing this, that and the other thing also',
  );
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState('');

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, newSubtask]);
      setNewSubtask('');
    }
  };

  return (
    <div className='p-8'>
      <div className='max-w-4xl mx-auto rounded-xl shadow-md p-6 space-y-6'>
        <div className='flex gap-3'>
          <div className='w-full'>
            <label className='block text-sm font-medium'>Task Name</label>
            <input
              type='text'
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
          </div>
          <TaskTimer />
        </div>
        <div>
          <label className='block text-sm font-medium'>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
          />
        </div>
        <div>
          <h3 className='text-lg font-semibold'>Subtasks</h3>
          <ul className='space-y-2'>
            {subtasks.map((subtask, index) => (
              <li
                key={index}
                className='flex justify-between items-center p-2 rounded-md'
              >
                <span>{subtask}</span>
              </li>
            ))}
          </ul>
          <div className='mt-4 flex space-x-2'>
            <input
              type='text'
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder='Add a new subtask'
              className='flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
            <button
              onClick={handleAddSubtask}
              className='bg-indigo-500 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-600'
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;