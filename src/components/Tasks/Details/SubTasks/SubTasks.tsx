import { useEffect, useRef, useState } from 'react';

import { Check, CheckSquare, Edit3, Plus, Trash2 } from 'lucide-react';
import { useProfileStore } from 'stores/profileStore';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getSubTasks } from 'src/services/tasks';

type SubTaskType = {
  title: string;
  id: number;
  completed: boolean;
  completed_at: string;
  due_date: string;
};

const SubTasks = () => {
  const [newSubtask, setNewSubtask] = useState('');
  const [subtasks, setSubtasks] = useState<SubTaskType[]>([]);

  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  const subtasksFetchedRef = useRef(false);

  const { id } = useParams();

  const addSubtask = () => { };

  const removeSubtask = (_id: number) => { };

  const toggleSubtask = (_id: number) => { };

  useEffect(() => {
    if (id && !subtasksFetchedRef.current) {
      getSubTasks(id).then((res) => {
        setSubtasks(res?.data || []);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch subtasks');
      });
      subtasksFetchedRef.current = true;
    }
  }, [id]);

  return (
    <div className={`rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold flex items-center'>
            <CheckSquare className='w-5 h-5 mr-2' />
            Subtasks (
            {subtasks.filter((st) => st.completed).length}
            /
            {subtasks.length}
            )
          </h3>
          <div className='text-sm'>
            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {Math.round((subtasks.filter((st) => st.completed).length / subtasks.length) * 100)}
              % Complete
            </span>
          </div>
        </div>
      </div>
      <div className='p-6'>
        {/* Add new subtask */}
        <div className='flex space-x-2 mb-6'>
          <input
            type='text'
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
            placeholder='Add a new subtask...'
            className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300'}`}
          />
          <button
            onClick={addSubtask}
            className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
          >
            <Plus className='w-4 h-4' />
          </button>
        </div>

        {/* Subtasks list */}
        <div className='space-y-3'>
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${subtask.completed ? 'opacity-75' : ''}`}
            >
              <div className='flex items-center space-x-3 flex-1'>
                <button
                  onClick={() => toggleSubtask(subtask.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${subtask.completed
                    ? 'bg-green-500 border-green-500'
                    : darkMode
                      ? 'border-gray-500 hover:border-green-500'
                      : 'border-gray-300 hover:border-green-500'}`}
                >
                  {subtask.completed && <Check className='w-3 h-3 text-white' />}
                </button>
                <div className='flex-1'>
                  <p className={`font-medium ${subtask.completed ? 'line-through' : ''}`}>
                    {subtask.title}
                  </p>
                  <div className='flex items-center space-x-4 mt-1 text-sm'>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Due:
                      {' '}
                      {dayjs(subtask.due_date || new Date()).format('MMM DD, YYYY')}
                    </span>
                    {subtask.completed && subtask.completed_at && (
                      <span className='text-green-600 dark:text-green-400'>
                        Completed:
                        {' '}
                        {dayjs(subtask.completed_at || new Date()).format('MMM DD, YYYY')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <Edit3 className='w-4 h-4' />
                </button>
                <button
                  onClick={() => removeSubtask(subtask.id)}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-500'}`}
                >
                  <Trash2 className='w-4 h-4' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubTasks;