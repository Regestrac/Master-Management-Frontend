import { useState } from 'react';

import { Edit3, Save } from 'lucide-react';
import { useProfileStore } from 'stores/profileStore';
import { useTaskStore } from 'stores/taskStore';

const TaskDescription = () => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState('');

  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);

  const saveDescription = () => {

  };

  return (
    <div className={`rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>Description</h3>
          <button
            onClick={() => {
              if (isEditingDescription) {
                saveDescription();
              } else {
                setIsEditingDescription(true);
                setDescription(taskDetails.description);
              }
            }}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${isEditingDescription
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            {isEditingDescription ? <Save className='w-4 h-4' /> : <Edit3 className='w-4 h-4' />}
            <span className='text-sm'>{isEditingDescription ? 'Save' : 'Edit'}</span>
          </button>
        </div>
      </div>
      <div className='p-6'>
        {isEditingDescription ? (
          <div className='space-y-4'>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full h-32 p-4 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-gray-50 border-gray-300'}`}
              placeholder='Enter task description...'
            />
            <div className='flex space-x-2'>
              <button
                onClick={saveDescription}
                className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditingDescription(false);
                  setDescription(taskDetails.description);
                }}
                className={`px-4 py-2 rounded-lg border transition-colors ${darkMode
                  ? 'border-gray-600 hover:bg-gray-700'
                  : 'border-gray-300 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {taskDetails.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskDescription;