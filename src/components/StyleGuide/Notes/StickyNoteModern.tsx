import { useState, useRef, useEffect } from 'react';

/**
 * @typedef {'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'purple' | 'mint'} StickyNoteColor
 * @typedef {'classic' | 'modern' | 'minimal'} StickyNoteVariant
 * @typedef {{bg: string, shadow: string, border: string, text: string}} ColorConfig
 */

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
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedColor, setSelectedColor] = useState(color);

  const noteRef = useRef<any>(null);
  const textareaRef = useRef<any>(null);
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
  });

  // Color configurations
  const colorConfigs = {
    yellow: {
      bg: 'bg-gradient-to-br from-yellow-200 to-yellow-300',
      shadow: 'shadow-yellow-400/30',
      border: 'border-yellow-400/20',
      text: 'text-yellow-900',
    },
    pink: {
      bg: 'bg-gradient-to-br from-pink-200 to-pink-300',
      shadow: 'shadow-pink-400/30',
      border: 'border-pink-400/20',
      text: 'text-pink-900',
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-200 to-blue-300',
      shadow: 'shadow-blue-400/30',
      border: 'border-blue-400/20',
      text: 'text-blue-900',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-200 to-green-300',
      shadow: 'shadow-green-400/30',
      border: 'border-green-400/20',
      text: 'text-green-900',
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-200 to-orange-300',
      shadow: 'shadow-orange-400/30',
      border: 'border-orange-400/20',
      text: 'text-orange-900',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-200 to-purple-300',
      shadow: 'shadow-purple-400/30',
      border: 'border-purple-400/20',
      text: 'text-purple-900',
    },
    mint: {
      bg: 'bg-gradient-to-br from-emerald-200 to-teal-300',
      shadow: 'shadow-emerald-400/30',
      border: 'border-emerald-400/20',
      text: 'text-emerald-900',
    },
  };

  // Variant styles
  const variantStyles = {
    classic: 'rotate-1 hover:rotate-0',
    modern: 'rotate-0 rounded-lg',
    minimal: 'rotate-0 rounded-none border-l-4',
  };

  const currentColorConfig = colorConfigs[selectedColor as keyof typeof colorConfigs];

  // Handle text editing
  const handleTextClick = () => {
    if (!isDragging && !isResizing) {
      setIsEditing(true);
    }
  };

  const handleTextChange = (e: any) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange?.(newText);
  };

  const handleTextBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  // Auto-focus textarea when editing
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  // Handle dragging
  const handleMouseDown = (e: any) => {
    if (e.target === noteRef.current || e.target.classList.contains('drag-handle')) {
      setIsDragging(true);
      dragRef.current = {
        isDragging: true,
        startX: e.clientX - position.x,
        startY: e.clientY - position.y,
      };
    }
  };

  const handleMouseMove = (e: any) => {
    if (dragRef.current.isDragging) {
      setPosition({
        x: e.clientX - dragRef.current.startX,
        y: e.clientY - dragRef.current.startY,
      });
    }
  };

  const handleMouseUp = () => {
    setTimeout(() => setIsDragging(false), 10);
    dragRef.current.isDragging = false;
  };

  // Handle resizing
  const handleResizeStart = (e: any) => {
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const handleResizeMove = (e: any) => {
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
  };

  // Global mouse events
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Color change handler
  const handleColorChange = (newColor: any) => {
    setSelectedColor(newColor);
    onColorChange?.(newColor);
  };

  return (
    <div className='relative inline-block'>
      {/* Color Picker */}
      <div className='absolute -top-12 left-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20'>
        {Object.keys(colorConfigs).map((colorKey) => {
          const colorConfig = colorConfigs[colorKey as keyof typeof colorConfigs];
          return (
            <button
              key={colorKey}
              onClick={() => handleColorChange(colorKey)}
              className={`w-6 h-6 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform ${colorConfig.bg} ${selectedColor === colorKey ? 'ring-2 ring-gray-800' : ''}`}
              title={`${colorKey} note`}
            />
          );
        })}
      </div>

      {/* Sticky Note */}
      <div
        ref={noteRef}
        className={`
          group relative cursor-move select-none transition-all duration-200 ease-out
          ${currentColorConfig.bg} ${currentColorConfig.shadow} ${currentColorConfig.border}
          ${variantStyles[variant as keyof typeof variantStyles]}
          border shadow-lg hover:shadow-xl
          ${isDragging ? 'rotate-3 scale-105 z-30' : ''}
          ${isResizing ? 'z-20' : ''}
          ${className}
        `}
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          transform: `translate(${position.x}px, ${position.y}px) ${isDragging ? 'rotate(3deg) scale(1.05)' : ''}`,
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Note Header/Drag Handle */}
        <div className='drag-handle absolute top-0 left-0 right-0 h-8 cursor-move opacity-0 hover:opacity-20 bg-black transition-opacity rounded-t' />

        {/* Text Content */}
        <div
          className={`
            w-full h-full p-4 ${currentColorConfig.text} font-handwriting
            ${!isEditing ? 'cursor-text' : ''}
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
              className={`
                w-full h-full resize-none border-none outline-none bg-transparent
                ${currentColorConfig.text} font-handwriting text-sm leading-relaxed
              `}
              placeholder='Type your note here...'
            />
          ) : (
            <div className='w-full h-full overflow-hidden'>
              <p className='text-sm leading-relaxed whitespace-pre-wrap break-words'>
                {text || 'Click to edit...'}
              </p>
            </div>
          )}
        </div>

        {/* Resize Handle */}
        <div
          className='absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-60 transition-opacity'
          onMouseDown={handleResizeStart}
        >
          <div className='absolute bottom-1 right-1 w-0 h-0 border-l-8 border-b-8 border-l-transparent border-b-gray-600' />
        </div>

        {/* Fold Effect (top-right corner) */}
        <div className='absolute top-0 right-0 w-0 h-0 border-l-8 border-t-8 border-l-transparent border-t-white/30' />
      </div>
    </div>
  );
};

// Demo Component showing multiple sticky notes
const StickyNoteDemo = () => {
  const [notes, setNotes] = useState([
    { id: '1', text: 'Remember to buy groceries 🛒', color: 'yellow', variant: 'classic' },
    { id: '2', text: 'Meeting with team at 3 PM', color: 'blue', variant: 'modern' },
    { id: '3', text: 'Call mom this weekend ❤️', color: 'pink', variant: 'classic' },
  ]);

  const addNote = () => {
    const colors = ['yellow', 'pink', 'blue', 'green', 'orange', 'purple', 'mint'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    setNotes([...notes, {
      id: Date.now().toString(),
      text: 'New note...',
      color: randomColor,
      variant: 'classic',
    }]);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8'>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap');
        .font-handwriting {
          font-family: 'Kalam', cursive;
        }
      `}
      </style>

      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>Interactive Sticky Notes</h1>
          <p className='text-gray-600 mb-6'>
            Click to edit • Drag to move • Resize from corner • Change colors on hover
          </p>
          <button
            onClick={addNote}
            className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg font-medium'
          >
            + Add New Note
          </button>
        </div>

        <div className='relative'>
          {notes.map((note, index) => (
            <div
              key={note.id}
              className='absolute'
              style={{
                left: `${(index % 4) * 250 + 50}px`,
                top: `${Math.floor(index / 4) * 250 + 50}px`,
              }}
            >
              <StickyNote
                id={note.id}
                initialText={note.text}
                color={note.color}
                variant={note.variant}
                onTextChange={(text: any) => {
                  setNotes(notes.map((n) => n.id === note.id ? { ...n, text } : n));
                }}
                onColorChange={(color: any) => {
                  setNotes(notes.map((n) => n.id === note.id ? { ...n, color } : n));
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StickyNoteDemo;