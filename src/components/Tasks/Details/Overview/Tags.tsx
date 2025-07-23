import { useRef, useState } from 'react';

import { Plus, Tag } from 'lucide-react';
import { useProfileStore } from 'stores/profileStore';
import { useTaskStore } from 'stores/taskStore';

const Tags = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);
  // const addTag = useTaskStore((state) => state.addTag); // You need to implement this in your store
  const [tag, addTag] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddClick = () => {
    setAdding(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputBlur = () => {
    setAdding(false);
    setInput('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      if (!taskDetails.tags?.includes(input.trim())) {
        addTag((prev) => [...prev, input.trim()]);
      }
      setAdding(false);
      setInput('');
    } else if (e.key === 'Escape') {
      setAdding(false);
      setInput('');
    }
  };

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
          {tag?.map((tag) => (
            <span
              key={tag}
              className='inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-sm font-medium'
            >
              #
              {tag}
            </span>
          ))}
          {adding ? (
            <input
              ref={inputRef}
              type='text'
              className={`inline-flex items-center px-3 py-1 border-2 border-dashed rounded-full text-sm font-medium outline-none transition-colors ${darkMode
                ? 'border-gray-600 bg-gray-800 text-purple-400 placeholder-gray-500'
                : 'border-gray-300 bg-white text-purple-800 placeholder-gray-400'}`}
              placeholder='New tag'
              value={input}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              maxLength={32}
            />
          ) : (
            <button
              type='button'
              className={`inline-flex items-center px-3 py-1 border-2 border-dashed rounded-full text-sm transition-colors ${darkMode
                ? 'border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-400'
                : 'border-gray-300 text-gray-500 hover:border-purple-500 hover:text-purple-600'}`}
              onClick={handleAddClick}
            >
              <Plus className='w-3 h-3 mr-1' />
              Add tag
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tags;