import { useState } from 'react';

type Props = {}

const SubTasks = (_props: Props) => {
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState('');

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, newSubtask]);
      setNewSubtask('');
    }
  };

  return (
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
  );
};

export default SubTasks;