import { useRef, useEffect, useState } from 'react';

import clsx from 'clsx';

import { useProfileStore } from 'stores/profileStore';

type InlineEditableTitlePropsType = {
  title: string;
  onSave: (_newTitle: string) => void;
  className?: string;
  placeholder?: string;
};

const InlineEditableTitle = ({
  title,
  onSave,
  className = '',
  placeholder = 'Enter title...',
}: InlineEditableTitlePropsType) => {
  const [value, setValue] = useState(title);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  // const [_cursorPosition, setCursorPosition] = useState(0);

  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';

  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  // Update value when title prop changes
  useEffect(() => {
    setValue(title);
  }, [title]);

  const handleSave = async () => {
    if (value.trim() && value !== title) {
      setIsLoading(true);
      try {
        await onSave(value.trim());
      } catch {
        // Error handling is done in parent component
        setValue(title); // Revert on error
      } finally {
        setIsLoading(false);
      }
    } else if (!value.trim()) {
      setValue(title); // Revert if empty
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setValue(title);
      inputRef.current?.blur();
    }
  };

  const handleSpanClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Calculate cursor position based on click location
    if (spanRef.current) {
      const span = spanRef.current;
      const rect = span.getBoundingClientRect();
      const clickX = e.clientX - rect.left;

      // Create a temporary canvas to measure text width
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        // Get computed styles to match the span's font
        const styles = window.getComputedStyle(span);
        context.font = `${styles.fontSize} ${styles.fontFamily}`;

        let position = 0;

        // Find the character position closest to the click
        for (let i = 0; i <= title.length; i++) {
          const textWidth = context.measureText(title.substring(0, i)).width;
          if (textWidth > clickX) {
            // Check if we're closer to the previous or current position
            const prevWidth = i > 0 ? context.measureText(title.substring(0, i - 1)).width : 0;
            position = (clickX - prevWidth) < (textWidth - clickX) ? i - 1 : i;
            break;
          }
          position = i;
        }

        // setCursorPosition(Math.max(0, Math.min(position, title.length)));

        // Set focused state and immediately focus with correct cursor position
        setIsFocused(true);

        // Use requestAnimationFrame to ensure DOM update happens first
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(position, position);
          }
        });
      }
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (isFocused) {
    return (
      <input
        ref={inputRef}
        type='text'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          setIsFocused(false);
          handleSave();
        }}
        onClick={handleInputClick}
        placeholder={placeholder}
        disabled={isLoading}
        className={clsx(
          'font-medium text-sm bg-transparent border-none outline-none resize-none',
          darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500',
          isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-text',
          className,
        )}
        style={{
          width: `${Math.max(value.length * 8 + 20, 100)}px`,
          minWidth: '100px',
        }}
      />
    );
  }

  return (
    <span
      ref={spanRef}
      onClick={handleSpanClick}
      className={clsx(
        'font-medium text-sm cursor-text inline-block',
        darkMode ? 'text-white' : 'text-gray-900',
        className,
      )}
    >
      {title || placeholder}
    </span>
  );
};

export default InlineEditableTitle;
