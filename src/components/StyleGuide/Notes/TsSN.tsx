import React, { useState, useRef, useEffect, useCallback } from 'react';

// TypeScript interfaces
interface StickyNoteSize {
  width: number;
  height: number;
}

interface StickyNoteColor {
  id: string;
  name: string;
  bg: string;
  bgTailwind: string;
  border: string;
  borderTailwind: string;
  text: string;
  textTailwind: string;
  shadow: string;
  shadowTailwind: string;
}

interface StickyNoteProps {
  initialText?: string;
  defaultColor?: string;
  initialSize?: StickyNoteSize;
  onChange?: (text: string, size: StickyNoteSize, color: string) => void;
  onDelete?: () => void;
  className?: string;
  style?: React.CSSProperties;
  resizable?: boolean;
  draggable?: boolean;
  visualVariant?: 'default' | 'rounded' | 'shadow' | 'pinned' | 'mock3d';
}

// Color variants
const colorVariants: StickyNoteColor[] = [
  {
    id: 'yellow',
    name: 'Classic Yellow',
    bg: '#fef3c7',
    bgTailwind: 'bg-yellow-200',
    border: '#f59e0b',
    borderTailwind: 'border-yellow-500',
    text: '#92400e',
    textTailwind: 'text-yellow-800',
    shadow: 'rgba(245, 158, 11, 0.3)',
    shadowTailwind: 'shadow-yellow-300/30',
  },
  {
    id: 'pink',
    name: 'Soft Pink',
    bg: '#fce7f3',
    bgTailwind: 'bg-pink-200',
    border: '#ec4899',
    borderTailwind: 'border-pink-500',
    text: '#be185d',
    textTailwind: 'text-pink-700',
    shadow: 'rgba(236, 72, 153, 0.3)',
    shadowTailwind: 'shadow-pink-300/30',
  },
  {
    id: 'blue',
    name: 'Sky Blue',
    bg: '#dbeafe',
    bgTailwind: 'bg-blue-200',
    border: '#3b82f6',
    borderTailwind: 'border-blue-500',
    text: '#1e40af',
    textTailwind: 'text-blue-700',
    shadow: 'rgba(59, 130, 246, 0.3)',
    shadowTailwind: 'shadow-blue-300/30',
  },
  {
    id: 'green',
    name: 'Fresh Green',
    bg: '#d1fae5',
    bgTailwind: 'bg-green-200',
    border: '#10b981',
    borderTailwind: 'border-green-500',
    text: '#065f46',
    textTailwind: 'text-green-700',
    shadow: 'rgba(16, 185, 129, 0.3)',
    shadowTailwind: 'shadow-green-300/30',
  },
  {
    id: 'purple',
    name: 'Lavender',
    bg: '#e9d5ff',
    bgTailwind: 'bg-purple-200',
    border: '#8b5cf6',
    borderTailwind: 'border-purple-500',
    text: '#6b21a8',
    textTailwind: 'text-purple-700',
    shadow: 'rgba(139, 92, 246, 0.3)',
    shadowTailwind: 'shadow-purple-300/30',
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    bg: '#fed7aa',
    bgTailwind: 'bg-orange-200',
    border: '#f97316',
    borderTailwind: 'border-orange-500',
    text: '#c2410c',
    textTailwind: 'text-orange-700',
    shadow: 'rgba(249, 115, 22, 0.3)',
    shadowTailwind: 'shadow-orange-300/30',
  },
  {
    id: 'gray',
    name: 'Silver Gray',
    bg: '#f3f4f6',
    bgTailwind: 'bg-gray-200',
    border: '#6b7280',
    borderTailwind: 'border-gray-500',
    text: '#374151',
    textTailwind: 'text-gray-700',
    shadow: 'rgba(107, 114, 128, 0.3)',
    shadowTailwind: 'shadow-gray-300/30',
  },
];

const TypeScriptStickyNote: React.FC<StickyNoteProps> = ({
  initialText = '',
  defaultColor = 'yellow',
  initialSize = { width: 250, height: 200 },
  onChange,
  onDelete,
  className = '',
  style = {},
  resizable = true,
  draggable = true,
  visualVariant = 'default',
}) => {
  // State management
  const [text, setText] = useState<string>(initialText);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>(defaultColor);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [size, setSize] = useState<StickyNoteSize>(initialSize);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Refs
  const noteRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number }>({
    x: 0, y: 0, width: 0, height: 0,
  });

  // Get current color configuration
  const currentColor = colorVariants.find((c) => c.id === selectedColor) || colorVariants[0];

  // Auto-save functionality
  const saveState = useCallback(() => {
    onChange?.(text, size, selectedColor);
  }, [text, size, selectedColor, onChange]);

  // Handle text changes
  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
  }, []);

  // Handle text blur (auto-save)
  const handleTextBlur = useCallback(() => {
    setIsEditing(false);
    saveState();
  }, [saveState]);

  // Handle double-click to edit
  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => {
      if (textRef.current) {
        textRef.current.focus();
        // Place cursor at end
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(textRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, 10);
  }, []);

  // Handle color change
  const handleColorChange = useCallback((colorId: string) => {
    setSelectedColor(colorId);
    setShowColorPicker(false);
    // Trigger onChange after color change
    setTimeout(() => {
      onChange?.(text, size, colorId);
    }, 0);
  }, [text, size, onChange]);

  // Handle mouse down for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isEditing || isResizing) { return; }

    const target = e.target as HTMLElement;
    if (target.classList.contains('resize-handle')) { return; }

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }, [isEditing, isResizing, position]);

  // Handle resize start
  const handleResizeStart = useCallback((e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    };
  }, [size]);

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && draggable) {
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    } else if (isResizing && resizable) {
      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;

      let newWidth = resizeStartRef.current.width;
      let newHeight = resizeStartRef.current.height;

      if (resizeHandle.includes('e')) { newWidth += deltaX; }
      if (resizeHandle.includes('w')) { newWidth -= deltaX; }
      if (resizeHandle.includes('s')) { newHeight += deltaY; }
      if (resizeHandle.includes('n')) { newHeight -= deltaY; }

      // Minimum size constraints
      newWidth = Math.max(150, newWidth);
      newHeight = Math.max(100, newHeight);

      setSize({ width: newWidth, height: newHeight });
    }
  }, [isDragging, isResizing, resizeHandle, draggable, resizable]);

  // Mouse up handler
  const handleMouseUp = useCallback(() => {
    if (isDragging || isResizing) {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle('');
      saveState();
    }
  }, [isDragging, isResizing, saveState]);

  // Global event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
    return undefined;
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  // Handle click outside to close color picker
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [showColorPicker]);

  // Handle contentEditable input
  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const newText = (e.target as HTMLDivElement).textContent || '';
    handleTextChange(newText);
  }, [handleTextChange]);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      saveState();
    }
  }, [saveState]);

  // Generate visual variant styles
  const getVisualVariantStyles = useCallback(() => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: currentColor.bg,
      borderColor: currentColor.border,
      color: currentColor.text,
      ...style,
    };

    switch (visualVariant) {
      case 'rounded':
        return {
          ...baseStyles,
          borderRadius: '16px',
          boxShadow: `0 4px 12px ${currentColor.shadow}`,
        };
      case 'shadow':
        return {
          ...baseStyles,
          boxShadow: `0 8px 25px ${currentColor.shadow}, 0 0 0 1px ${currentColor.border}20`,
        };
      case 'pinned':
        return {
          ...baseStyles,
          transform: `${isDragging ? 'scale(1.05)' : 'scale(1)'} rotate(${isDragging ? '0deg' : '1deg'})`,
          boxShadow: `0 4px 8px ${currentColor.shadow}`,
        };
      case 'mock3d':
        return {
          ...baseStyles,
          boxShadow: `
            0 1px 3px ${currentColor.shadow},
            0 0 0 1px ${currentColor.border}40,
            inset 0 1px 0 rgba(255,255,255,0.5)
          `,
          borderWidth: '2px',
          borderStyle: 'solid',
        };
      default:
        return {
          ...baseStyles,
          boxShadow: `0 2px 8px ${currentColor.shadow}`,
        };
    }
  }, [currentColor, visualVariant, isDragging, style]);

  // Generate Tailwind classes
  const getTailwindClasses = useCallback(() => {
    const baseClasses = [
      'relative',
      'border-2',
      'transition-all',
      'duration-200',
      'select-none',
      currentColor.bgTailwind,
      currentColor.borderTailwind,
      currentColor.textTailwind,
      currentColor.shadowTailwind,
    ];

    switch (visualVariant) {
      case 'rounded':
        baseClasses.push('rounded-2xl', 'shadow-lg');
        break;
      case 'shadow':
        baseClasses.push('shadow-xl', 'rounded-lg');
        break;
      case 'pinned':
        baseClasses.push('shadow-md', 'rounded-lg');
        if (isDragging) { baseClasses.push('scale-105'); }
        break;
      case 'mock3d':
        baseClasses.push('shadow-lg', 'rounded-lg', 'border-2');
        break;
      default:
        baseClasses.push('shadow-md', 'rounded-lg');
    }

    if (isDragging) { baseClasses.push('cursor-grabbing'); }
    else if (draggable) { baseClasses.push('cursor-grab'); }

    return baseClasses.join(' ');
  }, [currentColor, visualVariant, isDragging, draggable]);

  return (
    <div
      ref={noteRef}
      className={`${getTailwindClasses()} ${className}`}
      style={{
        width: size.width,
        height: size.height,
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: isDragging || isResizing ? 1000 : 1,
        ...getVisualVariantStyles(),
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with controls */}
      <div className='flex items-center justify-between p-2 border-b border-current border-opacity-20'>
        {/* Color picker button */}
        <div className='relative' ref={colorPickerRef}>
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className='w-6 h-6 rounded-full border-2 border-current border-opacity-30 hover:border-opacity-50 transition-all duration-200 flex items-center justify-center'
            style={{ backgroundColor: currentColor.bg }}
            title='Change color'
          >
            <div className='w-4 h-4 rounded-full' style={{ backgroundColor: currentColor.border }} />
          </button>

          {/* Color picker dropdown */}
          {showColorPicker && (
            <div className='absolute top-8 left-0 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50 grid grid-cols-4 gap-1'>
              {colorVariants.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorChange(color.id)}
                  className={`w-8 h-8 rounded-lg border-2 hover:scale-110 transition-all duration-200 ${selectedColor === color.id ? 'ring-2 ring-gray-400' : ''}`}
                  style={{
                    backgroundColor: color.bg,
                    borderColor: color.border,
                  }}
                  title={color.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={onDelete}
            className='w-6 h-6 rounded-full hover:bg-red-100 flex items-center justify-center transition-all duration-200 text-red-500 hover:text-red-700'
            title='Delete note'
          >
            <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <path d='M18 6L6 18M6 6l12 12' />
            </svg>
          </button>
        )}
      </div>

      {/* Main content area */}
      <div
        className='flex-1 p-4 overflow-hidden'
        style={{ height: size.height - 50 }}
      >
        <div
          ref={textRef}
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onDoubleClick={handleDoubleClick}
          onInput={handleInput}
          onBlur={handleTextBlur}
          onKeyDown={handleKeyDown}
          className={`w-full h-full outline-none resize-none ${isEditing ? 'cursor-text' : 'cursor-pointer'} ${text ? '' : 'opacity-60'}`}
          style={{
            fontSize: '14px',
            lineHeight: '1.5',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: currentColor.text,
          }}
        >
          {text || 'Double-click to edit...'}
        </div>
      </div>

      {/* Resize handles */}
      {resizable && isHovered && (
        <>
          {/* Corner handles */}
          <div
            className='resize-handle absolute bottom-0 right-0 w-3 h-3 cursor-se-resize opacity-50 hover:opacity-100 transition-opacity'
            style={{
              background: `linear-gradient(-45deg, transparent 40%, ${currentColor.border} 40%, ${currentColor.border} 60%, transparent 60%)`,
            }}
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />
          <div
            className='resize-handle absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize opacity-50 hover:opacity-100 transition-opacity'
            style={{
              background: `linear-gradient(45deg, transparent 40%, ${currentColor.border} 40%, ${currentColor.border} 60%, transparent 60%)`,
            }}
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />
          <div
            className='resize-handle absolute top-0 right-0 w-3 h-3 cursor-ne-resize opacity-50 hover:opacity-100 transition-opacity'
            style={{
              background: `linear-gradient(45deg, transparent 40%, ${currentColor.border} 40%, ${currentColor.border} 60%, transparent 60%)`,
            }}
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          <div
            className='resize-handle absolute top-0 left-0 w-3 h-3 cursor-nw-resize opacity-50 hover:opacity-100 transition-opacity'
            style={{
              background: `linear-gradient(-45deg, transparent 40%, ${currentColor.border} 40%, ${currentColor.border} 60%, transparent 60%)`,
            }}
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />

          {/* Edge handles */}
          <div
            className='resize-handle absolute bottom-0 left-3 right-3 h-1 cursor-s-resize opacity-30 hover:opacity-60 transition-opacity'
            style={{ backgroundColor: currentColor.border }}
            onMouseDown={(e) => handleResizeStart(e, 's')}
          />
          <div
            className='resize-handle absolute top-0 left-3 right-3 h-1 cursor-n-resize opacity-30 hover:opacity-60 transition-opacity'
            style={{ backgroundColor: currentColor.border }}
            onMouseDown={(e) => handleResizeStart(e, 'n')}
          />
          <div
            className='resize-handle absolute right-0 top-3 bottom-3 w-1 cursor-e-resize opacity-30 hover:opacity-60 transition-opacity'
            style={{ backgroundColor: currentColor.border }}
            onMouseDown={(e) => handleResizeStart(e, 'e')}
          />
          <div
            className='resize-handle absolute left-0 top-3 bottom-3 w-1 cursor-w-resize opacity-30 hover:opacity-60 transition-opacity'
            style={{ backgroundColor: currentColor.border }}
            onMouseDown={(e) => handleResizeStart(e, 'w')}
          />
        </>
      )}

      {/* Pin effect for pinned variant */}
      {visualVariant === 'pinned' && (
        <div
          className='absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full shadow-md'
          style={{
            backgroundColor: '#ef4444',
            background: 'radial-gradient(circle at 30% 30%, #fca5a5, #ef4444)',
          }}
        />
      )}
    </div>
  );
};

// Demo component
const TypeScriptStickyNoteDemo: React.FC = () => {
  const [notes, setNotes] = useState<Array<{
    id: string;
    text: string;
    color: string;
    size: StickyNoteSize;
    variant: 'default' | 'rounded' | 'shadow' | 'pinned' | 'mock3d';
  }>>([
    {
      id: '1',
      text: 'Welcome to TypeScript Sticky Notes!\n\nDouble-click to edit this text.\nDrag corners to resize.\nClick the color button to change colors.',
      color: 'yellow',
      size: { width: 300, height: 200 },
      variant: 'default',
    },
    {
      id: '2',
      text: 'This is a rounded variant with soft shadows.\n\nTry different visual styles!',
      color: 'pink',
      size: { width: 250, height: 180 },
      variant: 'rounded',
    },
    {
      id: '3',
      text: 'Shadow variant with enhanced depth.\n\nPerfect for important notes!',
      color: 'blue',
      size: { width: 280, height: 160 },
      variant: 'shadow',
    },
    {
      id: '4',
      text: 'Pinned note with rotation effect.\n\nLooks like it\'s stuck on a board!',
      color: 'green',
      size: { width: 240, height: 180 },
      variant: 'pinned',
    },
  ]);

  const addNote = useCallback(() => {
    const variants: Array<'default' | 'rounded' | 'shadow' | 'pinned' | 'mock3d'> =
      ['default', 'rounded', 'shadow', 'pinned', 'mock3d'];
    const colors = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'];

    const newNote = {
      id: Date.now().toString(),
      text: 'New sticky note...',
      color: colors[Math.floor(Math.random() * colors.length)],
      size: { width: 250, height: 200 },
      variant: variants[Math.floor(Math.random() * variants.length)],
    };

    setNotes((prev) => [...prev, newNote]);
  }, []);

  const updateNote = useCallback((id: string, text: string, size: StickyNoteSize, color: string) => {
    setNotes((prev) => prev.map((note) =>
      note.id === id ? { ...note, text, size, color } : note,
    ));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold text-gray-800 mb-4'>
            📝 TypeScript Sticky Notes
          </h1>
          <p className='text-xl text-gray-600 mb-8'>
            Fully-featured • Resizable • Color variants • TypeScript • Double-click to edit
          </p>
          <button
            onClick={addNote}
            className='px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium text-lg'
          >
            ➕ Add New Note
          </button>
        </div>

        <div className='relative min-h-96'>
          {notes.map((note, index) => (
            <div
              key={note.id}
              className='absolute'
              style={{
                left: `${(index % 4) * 320 + Math.random() * 60}px`,
                top: `${Math.floor(index / 4) * 250 + Math.random() * 40}px`,
              }}
            >
              <TypeScriptStickyNote
                initialText={note.text}
                defaultColor={note.color}
                initialSize={note.size}
                visualVariant={note.variant}
                onChange={(text, size, color) => updateNote(note.id, text, size, color)}
                onDelete={() => deleteNote(note.id)}
                resizable={true}
                draggable={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypeScriptStickyNoteDemo;