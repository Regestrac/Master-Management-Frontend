import { useRef, useState } from 'react';

import { Plus, Tag, X, Check } from 'lucide-react';
import clsx from 'clsx';

import { useProfileStore } from 'stores/profileStore';
import { useTaskStore } from 'stores/taskStore';

const Tags = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);
  const updateTaskDetails = useTaskStore((state) => state.updateCurrentTaskDetails);

  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const tags = taskDetails.tags || [];

  const handleAddClick = () => {
    setAdding(true);
    setError('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setError(''); // Clear error on input
  };

  const addTag = (newTag: string) => {
    const trimmed = newTag.trim().toLowerCase();
    if (!trimmed) {
      return;
    }

    if (tags.some((tag) => tag.toLowerCase() === trimmed)) {
      setError('Tag already exists');
      return;
    }

    const updatedTags = [...tags, newTag.trim()];
    updateTaskDetails({ ...taskDetails, tags: updatedTags });
    setInput('');
    // keep adding mode active for next tag
    setTimeout(() => inputRef.current?.focus(), 0);
    setError('');
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    updateTaskDetails({ ...taskDetails, tags: updatedTags });
  };

  const handleInputBlur = () => {
    if (!input.trim()) {
      setAdding(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Escape') {
      setAdding(false);
      setInput('');
      setError('');
    }
  };

  return (
    <div className={clsx('rounded-xl border transition-all duration-200', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
      <div className={clsx('p-6 border-b', darkMode ? 'border-gray-700' : 'border-gray-200')}>
        <div className='flex items-center justify-between'>
          <h3 className={clsx('text-lg font-semibold flex items-center', darkMode ? 'text-white' : 'text-gray-900')}>
            <Tag className='w-5 h-5 mr-2' />
            Tags
          </h3>
          <div className='flex items-center gap-3'>
            <span className={clsx('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>
              {tags.length}
              {' '}
              tag
              {tags.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className='p-6 min-h-56'>
        {tags.length === 0 && !adding ? (
          <div className='flex flex-col items-center gap-4 py-8'>
            <div className={clsx('text-center', darkMode ? 'text-gray-500' : 'text-gray-400')}>
              <Tag className='w-8 h-8 mx-auto mb-2 opacity-50' />
              <p className='text-sm'>No tags yet. Add your first tag to get started.</p>
            </div>
            {adding ? (
              <input
                ref={inputRef}
                type='text'
                className={clsx(
                  'px-3 py-1.5 border-2 border-dashed rounded-full text-sm font-medium outline-none transition-all duration-200 min-w-[120px]',
                  error
                    ? darkMode
                      ? 'border-red-600 bg-red-900/20 text-red-400 placeholder-red-500'
                      : 'border-red-400 bg-red-50 text-red-700 placeholder-red-400'
                    : darkMode
                      ? 'border-purple-600 bg-gray-800 text-purple-300 placeholder-gray-500 focus:border-purple-500'
                      : 'border-purple-400 bg-white text-purple-700 placeholder-gray-400 focus:border-purple-500',
                )}
                placeholder='Enter tag name'
                value={input}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                maxLength={24}
              />
            ) : (
              <button
                type='button'
                className={clsx(
                  'inline-flex items-center px-3 py-1.5 border-2 border-dashed rounded-full text-sm font-medium transition-all duration-200 hover:scale-105',
                  darkMode
                    ? 'border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-900/20'
                    : 'border-gray-300 text-gray-500 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50',
                )}
                onClick={handleAddClick}
              >
                <Plus className='w-3 h-3 mr-1' />
                Add tag
              </button>
            )}
          </div>
        ) : (
          <div className='flex flex-wrap gap-2'>
            {tags.map((tag, index) => (
              <div
                key={`${tag}-${index}`}
                className={clsx(
                  'group inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105',
                  darkMode
                    ? 'bg-gradient-to-r from-purple-900/40 to-blue-900/40 text-purple-300 border border-purple-700/50 hover:border-purple-600'
                    : 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border border-purple-200 hover:border-purple-300',
                )}
              >
                <span className='mr-1 opacity-75'>#</span>
                {tag}
                <button
                  type='button'
                  onClick={() => removeTag(tag)}
                  className={clsx(
                    'ml-1.5 p-0.5 rounded-full opacity-60 hover:opacity-100 transition-all duration-200 hover:scale-110',
                    darkMode
                      ? 'hover:bg-red-900/50 text-red-400'
                      : 'hover:bg-red-100 text-red-600',
                  )}
                >
                  <X className='w-3 h-3' />
                </button>
              </div>
            ))}
            {adding ? (
              <div className='relative'>
                <div className='flex items-center'>
                  <input
                    ref={inputRef}
                    type='text'
                    className={clsx(
                      'px-3 py-1.5 pr-10 border-2 border-dashed rounded-full text-sm font-medium outline-none transition-all duration-200 min-w-[120px]',
                      error
                        ? darkMode
                          ? 'border-red-600 bg-red-900/20 text-red-400 placeholder-red-500'
                          : 'border-red-400 bg-red-50 text-red-700 placeholder-red-400'
                        : darkMode
                          ? 'border-purple-600 bg-gray-800 text-purple-300 placeholder-gray-500 focus:border-purple-500'
                          : 'border-purple-400 bg-white text-purple-700 placeholder-gray-400 focus:border-purple-500',
                    )}
                    placeholder='Enter tag name'
                    value={input}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleInputKeyDown}
                    maxLength={24}
                  />
                  <button
                    type='button'
                    disabled={!input.trim()}
                    onClick={() => addTag(input)}
                    className={clsx(
                      'absolute right-2 p-1 rounded-full transition-transform hover:scale-110',
                      darkMode ? 'text-green-400 hover:bg-green-900/30' : 'text-green-600 hover:bg-green-100',
                    )}
                  >
                    <Check className='w-4 h-4' />
                  </button>
                </div>
                {error && (
                  <div className={clsx(
                    'absolute top-full left-0 mt-1 px-2 py-1 text-xs rounded whitespace-nowrap z-10',
                    darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700',
                  )}
                  >
                    {error}
                  </div>
                )}
              </div>
            ) : (
              <button
                type='button'
                className={clsx(
                  'inline-flex items-center px-3 py-1.5 border-2 border-dashed rounded-full text-sm font-medium transition-all duration-200 hover:scale-105',
                  darkMode
                    ? 'border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-900/20'
                    : 'border-gray-300 text-gray-500 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50',
                )}
                onClick={handleAddClick}
              >
                <Plus className='w-3 h-3 mr-1' />
                Add tag
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tags;