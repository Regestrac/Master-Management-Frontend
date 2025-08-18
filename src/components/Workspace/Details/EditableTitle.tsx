import React, { memo, useState, useCallback, useRef, useEffect } from 'react';

type EditableTitleProps = {
  title: string;
  onSave: (_newTitle: string) => Promise<void>;
  isLoading?: boolean;
  className?: string;
};

export const EditableTitle = memo(({ title, onSave, isLoading = false, className = '' }: EditableTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(title);
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(async () => {
    if (!inputValue.trim() || inputValue === title) {
      setIsEditing(false);
      setInputValue(title);
      return;
    }

    try {
      await onSave(inputValue.trim());
      setIsEditing(false);
    } catch {
      setInputValue(title);
      setIsEditing(false);
    }
  }, [inputValue, title, onSave]);

  const handleCancel = useCallback(() => {
    setInputValue(title);
    setIsEditing(false);
  }, [title]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className={`text-2xl font-bold bg-transparent border-b outline-none border-gray-600 text-white dark:border-gray-600 dark:text-white ${className}`}
      />
    );
  }

  return (
    <h1
      className={`text-2xl font-bold truncate cursor-text hover:opacity-80 transition-opacity ${className}`}
      onClick={() => setIsEditing(true)}
      title='Click to rename'
    >
      {title || 'Loading...'}
    </h1>
  );
});

EditableTitle.displayName = 'EditableTitle';
