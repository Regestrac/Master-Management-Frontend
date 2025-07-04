import { Plus, Tag } from 'lucide-react';
import { useProfileStore } from 'stores/profileStore';
import { useTaskStore } from 'stores/taskStore';

const Tags = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);

  return (
    <div className={`rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
        <h3 className='text-lg font-semibold flex items-center'>
          <Tag className='w-5 h-5 mr-2' />
          Tags
        </h3>
      </div>
      <div className='p-6'>
        <div className='flex flex-wrap gap-2'>
          {taskDetails.tags?.map((tag) => (
            <span
              key={tag}
              className='inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-sm font-medium'
            >
              #
              {tag}
            </span>
          ))}
          <button className={`inline-flex items-center px-3 py-1 border-2 border-dashed rounded-full text-sm transition-colors ${darkMode
            ? 'border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-400'
            : 'border-gray-300 text-gray-500 hover:border-purple-500 hover:text-purple-600'}`}
          >
            <Plus className='w-3 h-3 mr-1' />
            Add tag
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tags;