import React, { useState, useRef, useEffect } from 'react';

import { X, Palette } from 'lucide-react';

import { StickyNoteDataType } from 'helpers/sharedTypes';

type StickyNotePropsType = {
  note: StickyNoteDataType;
  onUpdate: (_id: string, _updates: Partial<StickyNoteDataType>) => void;
  onDelete: (_id: string) => void;
  scale: number;
  isDarkMode: boolean;
  onBlur?: (_note: StickyNoteDataType) => void;
};

const colorOptions = [
  { name: 'Yellow', value: '#fef3c7', border: '#f59e0b' },
  { name: 'Pink', value: '#fce7f3', border: '#ec4899' },
  { name: 'Blue', value: '#dbeafe', border: '#3b82f6' },
  { name: 'Green', value: '#d1fae5', border: '#10b981' },
  { name: 'Purple', value: '#e9d5ff', border: '#8b5cf6' },
  { name: 'Orange', value: '#fed7aa', border: '#f97316' },
];

const StickyNote = ({ note, onUpdate, onDelete, scale, isDarkMode, onBlur }: StickyNotePropsType) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [resizeHandle, setResizeHandle] = useState('');

  const noteRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
    }
  }, [isEditing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('note-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - note.x * scale,
        y: e.clientY - note.y * scale,
      });
      e.preventDefault();
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: note.width,
      height: note.height,
    });
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = (e.clientX - dragStart.x) / scale;
        const newY = (e.clientY - dragStart.y) / scale;
        onUpdate(note.id, { x: newX, y: newY });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = note.x;
        let newY = note.y;

        if (resizeHandle.includes('right')) {
          newWidth = Math.max(150, resizeStart.width + deltaX / scale);
        }
        if (resizeHandle.includes('left')) {
          newWidth = Math.max(150, resizeStart.width - deltaX / scale);
          newX = note.x + (resizeStart.width - newWidth);
        }
        if (resizeHandle.includes('bottom')) {
          newHeight = Math.max(100, resizeStart.height + deltaY / scale);
        }
        if (resizeHandle.includes('top')) {
          newHeight = Math.max(100, resizeStart.height - deltaY / scale);
          newY = note.y + (resizeStart.height - newHeight);
        }

        onUpdate(note.id, {
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle('');
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, note, onUpdate, scale, resizeHandle]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTextareaBlur = () => {
    setIsEditing(false);
    if (onBlur) {
      onBlur(note);
    }
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
    e.stopPropagation();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(note.id, { content: e.target.value });
  };

  const handleColorChange = (color: string, border: string) => {
    onUpdate(note.id, { bgColor: color, borderColor: border });
    setShowColorPicker(false);
  };

  return (
    <>
      <div
        ref={noteRef}
        className={`absolute select-none shadow-lg rounded-lg overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${isResizing ? 'cursor-nw-resize' : ''}`}
        style={{
          left: note.x * scale,
          top: note.y * scale,
          width: note.width,
          height: note.height,
          backgroundColor: note.bgColor,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          border: `1px solid ${note.borderColor}`,
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        {/* Header */}
        <div className='note-header flex justify-between items-center p-1 bg-black bg-opacity-10'>
          <div className='flex items-center space-x-1'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowColorPicker(!showColorPicker);
              }}
              className='p-1 rounded hover:bg-black hover:bg-opacity-20 transition-colors'
            >
              <Palette className='w-3 h-3' />
            </button>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className='p-1 rounded hover:bg-red-500 hover:text-white transition-colors'
          >
            <X className='w-3 h-3' />
          </button>
        </div>

        {/* Content */}
        <div className='p-3 h-full text-gray-800'>
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={note.content}
              onChange={handleContentChange}
              onBlur={handleTextareaBlur}
              onKeyDown={handleTextareaKeyDown}
              className='w-full h-full resize-none border-none outline-none bg-transparent text-sm'
              style={{ fontSize: `${12 * scale}px` }}
              placeholder='Type your note...'
            />
          ) : (
            <div
              className='w-full h-full text-sm whitespace-pre-wrap break-words overflow-hidden'
              style={{ fontSize: `${12 * scale}px` }}
            >
              {note.content || 'Double-click to edit'}
            </div>
          )}
        </div>

        {/* Resize handles */}
        {!isEditing && (
          <>
            {/* Corner handles */}
            <div
              className='absolute top-0 left-0 w-2 h-2 cursor-nw-resize'
              onMouseDown={(e) => handleResizeMouseDown(e, 'top-left')}
            />
            <div
              className='absolute top-0 right-0 w-2 h-2 cursor-ne-resize'
              onMouseDown={(e) => handleResizeMouseDown(e, 'top-right')}
            />
            <div
              className='absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize'
              onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')}
            />
            <div
              className='absolute bottom-0 right-0 w-2 h-2 cursor-se-resize'
              onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')}
            />

            {/* Edge handles */}
            <div
              className='absolute top-0 left-2 right-2 h-1 cursor-n-resize'
              onMouseDown={(e) => handleResizeMouseDown(e, 'top')}
            />
            <div
              className='absolute bottom-0 left-2 right-2 h-1 cursor-s-resize'
              onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')}
            />
            <div
              className='absolute left-0 top-2 bottom-2 w-1 cursor-w-resize'
              onMouseDown={(e) => handleResizeMouseDown(e, 'left')}
            />
            <div
              className='absolute right-0 top-2 bottom-2 w-1 cursor-e-resize'
              onMouseDown={(e) => handleResizeMouseDown(e, 'right')}
            />
          </>
        )}
      </div>

      {/* Color picker dropdown */}
      {showColorPicker && (
        <div
          className={`absolute z-50 p-2 rounded-lg shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}
          style={{
            left: (note.x + 20) * scale,
            top: (note.y + 40) * scale,
          }}
        >
          <div className='grid grid-cols-3 gap-2'>
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorChange(color.value, color.border)}
                className='w-8 h-8 rounded border-2 hover:scale-110 transition-transform'
                style={{
                  backgroundColor: color.value,
                  borderColor: color.border,
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default StickyNote;
