import React, { useState, useCallback } from 'react';

type CreateFormProps = {
  placeholder?: string;
  onSubmit: (_title: string) => void;
  onCancle: () => void;
};

const CreateForm = ({ onSubmit, onCancle, placeholder = 'Enter Title' }: CreateFormProps) => {
  const [title, setTitle] = useState('');

  const handleSubmit = useCallback(() => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }
    onSubmit(trimmedTitle);
    setTitle('');
  }, [title, onSubmit]);

  const handleCancel = useCallback(() => {
    setTitle('');
    onCancle();
  }, [onCancle]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSubmit, handleCancel]);

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
        className='text-xs px-3 py-2 rounded bg-primary-600 hover:bg-primary-700 text-white'
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
};

export default CreateForm;
