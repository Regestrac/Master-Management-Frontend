import React, { useState, useRef, useEffect, useCallback } from 'react';

type Dimensions = {
  width: number;
  height: number;
};

type Position = {
  x: number;
  y: number;
};

type StickyNoteColor = 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'purple' | 'mint';

type StickyNoteVariant = 'classic' | 'modern' | 'minimal';

const StickyNote = ({
  id = 'sticky-note',
  initialText = 'Click to edit...',
  color = 'yellow',
  variant = 'classic',
  initialWidth = 200,
  initialHeight = 200,
  onTextChange,
  onResize,
  onColorChange,
  className = '',
}: any) => {
  const [text, setText] = useState<string>(initialText);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: initialWidth, height: initialHeight });
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [selectedColor, setSelectedColor] = useState<StickyNoteColor>(color);
  const [cursorPosition, setCursorPosition] = useState(0);

  const noteRef = useRef<any>(null);
  const textareaRef = useRef<any>(null);
  const textDisplayRef = useRef<any>(null);
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
  });

  // Enhanced color configurations with more visual appeal
  const colorConfigs = {
    yellow: {
      bg: 'bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400',
      shadow: 'shadow-yellow-400/40',
      border: 'border-yellow-400/30',
      text: 'text-yellow-900',
      accent: 'bg-yellow-500',
    },
    pink: {
      bg: 'bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400',
      shadow: 'shadow-pink-400/40',
      border: 'border-pink-400/30',
      text: 'text-pink-900',
      accent: 'bg-pink-500',
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400',
      shadow: 'shadow-blue-400/40',
      border: 'border-blue-400/30',
      text: 'text-blue-900',
      accent: 'bg-blue-500',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-200 via-green-300 to-green-400',
      shadow: 'shadow-green-400/40',
      border: 'border-green-400/30',
      text: 'text-green-900',
      accent: 'bg-green-500',
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400',
      shadow: 'shadow-orange-400/40',
      border: 'border-orange-400/30',
      text: 'text-orange-900',
      accent: 'bg-orange-500',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400',
      shadow: 'shadow-purple-400/40',
      border: 'border-purple-400/30',
      text: 'text-purple-900',
      accent: 'bg-purple-500',
    },
    mint: {
      bg: 'bg-gradient-to-br from-emerald-200 via-teal-300 to-emerald-400',
      shadow: 'shadow-emerald-400/40',
      border: 'border-emerald-400/30',
      text: 'text-emerald-900',
      accent: 'bg-emerald-500',
    },
  };

  // Enhanced variant styles
  const variantStyles: Record<StickyNoteVariant, string> = {
    classic: 'rotate-1 hover:rotate-0 rounded-sm',
    modern: 'rotate-0 rounded-xl shadow-2xl',
    minimal: 'rotate-0 rounded-none border-l-4 shadow-md',
  };

  const currentColorConfig = colorConfigs[selectedColor];

  // Calculate cursor position from click coordinates
  const calculateCursorPosition = useCallback((clickX: number, clickY: number): number => {
    if (!textDisplayRef.current) { return 0; }

    const rect = textDisplayRef.current.getBoundingClientRect();
    const relativeX = clickX - rect.left;
    const relativeY = clickY - rect.top;

    // Create a temporary div to measure text
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.whiteSpace = 'pre-wrap';
    tempDiv.style.fontSize = '14px';
    tempDiv.style.fontFamily = 'Kalam, cursive';
    tempDiv.style.lineHeight = '1.6';
    tempDiv.style.padding = '16px';
    tempDiv.style.width = `${dimensions.width}px`;

    document.body.appendChild(tempDiv);

    let position = 0;
    const textContent = text || '';

    // Binary search to find the closest character position
    let left = 0;
    let right = textContent.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const textUpToMid = textContent.substring(0, mid);
      tempDiv.textContent = textUpToMid;

      const midRect = tempDiv.getBoundingClientRect();
      const midX = midRect.width - 16; // Account for padding
      const midY = midRect.height - 16;

      if (relativeY < midY || (relativeY === midY && relativeX < midX)) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    position = left;
    document.body.removeChild(tempDiv);

    return position;
  }, [text, dimensions.width]);

  // Handle text editing with proper cursor positioning
  const handleTextClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && !isResizing) {
      const cursorPos = calculateCursorPosition(e.clientX, e.clientY);
      setCursorPosition(cursorPos);
      setIsEditing(true);
    }
  }, [isDragging, isResizing, calculateCursorPosition]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange?.(newText);
  }, [onTextChange]);

  const handleTextBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  }, []);

  // Auto-focus textarea and set cursor position when editing
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      // Prevent default selection behavior
      textareaRef.current.focus({ preventScroll: true });

      // Use setTimeout to ensure the cursor position is set after focus
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
        }
      }, 0);
    }
  }, [isEditing, cursorPosition]);

  // Handle dragging
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target === noteRef.current || target.classList.contains('drag-handle')) {
      setIsDragging(true);
      dragRef.current = {
        isDragging: true,
        startX: e.clientX - position.x,
        startY: e.clientY - position.y,
      };
    }
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragRef.current.isDragging) {
      setPosition({
        x: e.clientX - dragRef.current.startX,
        y: e.clientY - dragRef.current.startY,
      });
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    setTimeout(() => setIsDragging(false), 10);
    dragRef.current.isDragging = false;
  }, []);

  // Handle resizing
  const handleResizeStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const handleResizeMove = (e: MouseEvent) => {
      const newWidth = Math.max(150, startWidth + (e.clientX - startX));
      const newHeight = Math.max(150, startHeight + (e.clientY - startY));

      setDimensions({ width: newWidth, height: newHeight });
      onResize?.(newWidth, newHeight);
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  }, [dimensions, onResize]);

  // Global mouse events
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Color change handler
  const handleColorChange = useCallback((newColor: StickyNoteColor) => {
    setSelectedColor(newColor);
    onColorChange?.(newColor);
  }, [onColorChange]);

  const noteStyles: React.CSSProperties = {
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    transform: `translate(${position.x}px, ${position.y}px) ${isDragging ? 'rotate(3deg) scale(1.05)' : ''}`,
    filter: isDragging ? 'brightness(1.05)' : 'brightness(1)',
    transition: isDragging ? 'none' : 'all 0.2s ease-out',
  };

  return (
    <div className='relative inline-block group'>
      {/* Enhanced Color Picker */}
      <div className='absolute -top-14 left-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20'>
        <div className='bg-white rounded-lg shadow-lg p-2 flex gap-1'>
          {Object.entries(colorConfigs).map(([colorKey, config]) => (
            <button
              key={colorKey}
              onClick={() => handleColorChange(colorKey as StickyNoteColor)}
              className={`
                w-7 h-7 rounded-full border-2 border-white shadow-md 
                hover:scale-110 transition-all duration-200 
                ${config.bg} ${config.shadow}
                ${selectedColor === colorKey ? 'ring-2 ring-gray-700 scale-110' : ''}
              `}
              title={`${colorKey} note`}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Sticky Note */}
      <div
        ref={noteRef}
        className={`
          relative cursor-move select-none transition-all duration-200 ease-out
          ${currentColorConfig.bg} ${currentColorConfig.shadow} ${currentColorConfig.border}
          ${variantStyles[variant as keyof typeof variantStyles]}
          border-2 shadow-lg hover:shadow-xl
          ${isDragging ? 'z-30' : ''}
          ${isResizing ? 'z-20' : ''}
          ${className}
        `}
        style={noteStyles}
        onMouseDown={handleMouseDown}
      >
        {/* Tape Effect */}
        <div className='absolute -top-2 left-8 w-12 h-4 bg-yellow-300/60 rounded-sm rotate-12 shadow-sm' />
        <div className='absolute -top-2 right-8 w-12 h-4 bg-yellow-300/60 rounded-sm -rotate-12 shadow-sm' />

        {/* Enhanced Note Header/Drag Handle */}
        <div className='drag-handle absolute top-0 left-0 right-0 h-10 cursor-move opacity-0 hover:opacity-10 bg-black transition-opacity rounded-t-sm' />

        {/* Text Content */}
        <div
          className={`
            w-full h-full p-4 ${currentColorConfig.text} font-handwriting
            ${!isEditing ? 'cursor-text' : ''}
            relative
          `}
          onClick={handleTextClick}
        >
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onBlur={handleTextBlur}
              onKeyDown={handleKeyDown}
              onFocus={(e) => {
                // Prevent default text selection on focus
                e.preventDefault();
                // Set cursor position after a brief delay to ensure it works
                setTimeout(() => {
                  if (textareaRef.current) {
                    textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
                  }
                }, 0);
              }}
              className={`
                w-full h-full resize-none border-none outline-none bg-transparent
                ${currentColorConfig.text} font-handwriting text-sm leading-relaxed
                placeholder-opacity-60
              `}
              placeholder='Type your note here...'
              style={{
                fontFamily: 'Kalam, cursive',
                fontSize: '14px',
                lineHeight: '1.6',
              }}
            />
          ) : (
            <div
              ref={textDisplayRef}
              className='w-full h-full overflow-hidden relative'
            >
              <p
                className='text-sm leading-relaxed whitespace-pre-wrap break-words'
                style={{
                  fontFamily: 'Kalam, cursive',
                  fontSize: '14px',
                  lineHeight: '1.6',
                }}
              >
                {text || (
                  <span className='opacity-60 italic'>Click to edit...</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Resize Handle */}
        <div
          className='absolute bottom-0 right-0 w-6 h-6 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity'
          onMouseDown={handleResizeStart}
        >
          <div className='absolute bottom-1 right-1 w-0 h-0 border-l-[6px] border-b-[6px] border-l-transparent border-b-gray-500' />
          <div className='absolute bottom-0.5 right-0.5 w-0 h-0 border-l-[4px] border-b-[4px] border-l-transparent border-b-gray-400' />
        </div>

        {/* Enhanced Fold Effect */}
        <div className='absolute top-0 right-0 w-0 h-0 border-l-[12px] border-t-[12px] border-l-transparent border-t-white/40' />

        {/* Subtle Lines for authenticity */}
        <div className='absolute inset-0 pointer-events-none'>
          {Array.from({ length: Math.floor(dimensions.height / 25) }).map((_, i) => (
            <div
              key={i}
              className='absolute left-4 right-4 h-px bg-current opacity-10'
              style={{ top: `${40 + i * 25}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Demo Component with TypeScript
const StickyNoteDemo: React.FC = () => {
  const [notes, setNotes] = useState([
    { id: '1', text: 'Remember to buy groceries 🛒\nDon\'t forget the milk!', color: 'yellow', variant: 'classic' },
    { id: '2', text: 'Meeting with team at 3 PM\n📅 Conference Room A', color: 'blue', variant: 'modern' },
    { id: '3', text: 'Call mom this weekend ❤️\nShe mentioned the garden', color: 'pink', variant: 'classic' },
    { id: '4', text: 'Project deadline: Friday\n⚡ High priority', color: 'orange', variant: 'minimal' },
  ]);

  const addNote = useCallback(() => {
    const colors: StickyNoteColor[] = ['yellow', 'pink', 'blue', 'green', 'orange', 'purple', 'mint'];
    const variants: StickyNoteVariant[] = ['classic', 'modern', 'minimal'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];

    const newNote = {
      id: Date.now().toString(),
      text: 'New note...',
      color: randomColor,
      variant: randomVariant,
    };

    setNotes((prev) => [...prev, newNote]);
  }, []);

  const updateNoteText = useCallback((id: string, text: string) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, text } : n));
  }, []);

  const updateNoteColor = useCallback((id: string, color: StickyNoteColor) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, color } : n));
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-8'>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap');
        .font-handwriting {
          font-family: 'Kalam', cursive;
        }
      `}
      </style>

      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold text-gray-800 mb-4 font-handwriting'>
            ✨ Interactive Sticky Notes
          </h1>
          <p className='text-gray-600 mb-8 text-lg'>
            Click anywhere on text to edit • Drag to move • Resize from corner • Hover to change colors
          </p>
          <button
            onClick={addNote}
            className='px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg transform hover:scale-105'
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
                left: `${(index % 4) * 280 + 50}px`,
                top: `${Math.floor(index / 4) * 280 + 50}px`,
              }}
            >
              <StickyNote
                id={note.id}
                initialText={note.text}
                color={note.color}
                variant={note.variant}
                initialWidth={220}
                initialHeight={220}
                onTextChange={(text: any) => updateNoteText(note.id, text)}
                onColorChange={(color: any) => updateNoteColor(note.id, color)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StickyNoteDemo;