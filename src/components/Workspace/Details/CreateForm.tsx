import React, { memo, useState, useCallback } from 'react';

import { Plus } from 'lucide-react';

interface CreateFormProps {
  type: 'task' | 'goal';
  onSubmit: (_title: string) => void;
  placeholder?: string;
}

export const CreateForm = memo(({
  type,
  onSubmit,
  placeholder = `${type} title`,
}: CreateFormProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = useCallback(() => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }
    onSubmit(trimmedTitle);
    setTitle('');
    setIsVisible(false);
  }, [title, onSubmit]);

  const handleCancel = useCallback(() => {
    setTitle('');
    setIsVisible(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSubmit, handleCancel]);

  if (!isVisible) {
    return (
      <button
        type='button'
        onClick={() => setIsVisible(true)}
        className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded border transition border-gray-200 text-emerald-700 hover:bg-gray-100 dark:border-gray-700 dark:text-emerald-300 dark:hover:bg-gray-750'
        title={`Create ${type}`}
      >
        <Plus className='w-3 h-3' />
        New
      </button>
    );
  }

  return (
    <div className='mb-4 flex items-center gap-2'>
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className='flex-1 text-sm px-3 py-2 rounded border outline-none bg-white border-gray-300 text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400'
        autoFocus
      />
      <button
        type='button'
        onClick={handleSubmit}
        className='text-xs px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white'
      >
        Create
      </button>
      <button
        type='button'
        onClick={handleCancel}
        className='text-xs px-3 py-2 rounded border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'
      >
        Cancel
      </button>
    </div>
  );
});

CreateForm.displayName = 'CreateForm';
