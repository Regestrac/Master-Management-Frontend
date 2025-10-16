import { useState, useRef, useEffect, useCallback } from 'react';

const PaperTornStickyNote = ({
  id = `paper-note-${Date.now()}`,
  initialText = '',
  theme = 'vintage',
  size = 'medium',
  initialWidth,
  initialHeight,
  onTextChange,
  onResize,
  onThemeChange,
  onDelete,
  className = '',
  editable = true,
}) => {
  // Size presets
  const sizePresets = {
    small: { width: 180, height: 180 },
    medium: { width: 250, height: 250 },
    large: { width: 320, height: 320 },
  };

  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const defaultSize = sizePresets[size];
  const [dimensions, setDimensions] = useState({
    width: initialWidth || defaultSize.width,
    height: initialHeight || defaultSize.height,
  });

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [resizeState, setResizeState] = useState({
    isResizing: false,
    direction: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
  });

  const noteRef = useRef(null);
  const textareaRef = useRef(null);
  const textDisplayRef = useRef(null);
  const hideControlsTimeoutRef = useRef(null);
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
  });

  // Paper torn theme configurations
  const themes = {
    vintage: {
      background: 'bg-amber-50',
      paperColor: '#fefce8',
      textColor: '#78350f',
      borderColor: '#d97706',
      shadowColor: 'rgba(217, 119, 6, 0.3)',
      accent: 'bg-amber-600',
      name: 'Vintage',
    },
    notebook: {
      background: 'bg-blue-50',
      paperColor: '#eff6ff',
      textColor: '#1e3a8a',
      borderColor: '#2563eb',
      shadowColor: 'rgba(37, 99, 235, 0.3)',
      accent: 'bg-blue-600',
      name: 'Notebook',
    },
    parchment: {
      background: 'bg-yellow-50',
      paperColor: '#fffbeb',
      textColor: '#92400e',
      borderColor: '#f59e0b',
      shadowColor: 'rgba(245, 158, 11, 0.3)',
      accent: 'bg-yellow-600',
      name: 'Parchment',
    },
    mint: {
      background: 'bg-emerald-50',
      paperColor: '#ecfdf5',
      textColor: '#065f46',
      borderColor: '#10b981',
      shadowColor: 'rgba(16, 185, 129, 0.3)',
      accent: 'bg-emerald-600',
      name: 'Mint',
    },
    rose: {
      background: 'bg-rose-50',
      paperColor: '#fff1f2',
      textColor: '#9f1239',
      borderColor: '#f43f5e',
      shadowColor: 'rgba(244, 63, 94, 0.3)',
      accent: 'bg-rose-600',
      name: 'Rose',
    },
    slate: {
      background: 'bg-slate-100',
      paperColor: '#f8fafc',
      textColor: '#334155',
      borderColor: '#64748b',
      shadowColor: 'rgba(100, 116, 139, 0.3)',
      accent: 'bg-slate-600',
      name: 'Slate',
    },
  };

  const currentTheme = themes[selectedTheme];

  // Generate random torn edge path
  const generateTornEdge = useCallback((width, height) => {
    const points = [];
    const roughness = 8;

    // Top edge (torn)
    for (let x = 0; x <= width; x += 10) {
      const y = Math.random() * roughness;
      points.push(`${x},${y}`);
    }

    // Right edge
    for (let y = 0; y <= height; y += 15) {
      const x = width - Math.random() * roughness;
      points.push(`${x},${y}`);
    }

    // Bottom edge (torn)
    for (let x = width; x >= 0; x -= 10) {
      const y = height - Math.random() * roughness;
      points.push(`${x},${y}`);
    }

    // Left edge
    for (let y = height; y >= 0; y -= 15) {
      const x = Math.random() * roughness;
      points.push(`${x},${y}`);
    }

    return points.join(' ');
  }, []);

  const [tornEdgePath, setTornEdgePath] = useState('');

  // Regenerate torn edge when dimensions change
  useEffect(() => {
    setTornEdgePath(generateTornEdge(dimensions.width, dimensions.height));
  }, [dimensions, generateTornEdge]);

  // Calculate cursor position from click
  const calculateCursorPosition = useCallback((clickX, clickY) => {
    if (!textDisplayRef.current) { return 0; }

    const rect = textDisplayRef.current.getBoundingClientRect();
    const relativeX = clickX - rect.left;
    const relativeY = clickY - rect.top;

    const tempSpan = document.createElement('span');
    tempSpan.style.position = 'absolute';
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.fontSize = '16px';
    tempSpan.style.fontFamily = '"Caveat", cursive';
    tempSpan.style.lineHeight = '1.6';
    tempSpan.style.whiteSpace = 'pre-wrap';
    tempSpan.style.padding = '20px';
    tempSpan.style.width = `${dimensions.width}px`;

    document.body.appendChild(tempSpan);

    const textContent = text || '';
    let bestPosition = 0;
    let minDistance = Infinity;

    for (let i = 0; i <= textContent.length; i++) {
      const testText = textContent.substring(0, i);
      tempSpan.textContent = testText;

      const spanRect = tempSpan.getBoundingClientRect();
      const endX = spanRect.width - 20;
      const endY = spanRect.height - 20;

      const distance = Math.sqrt(
        Math.pow(relativeX - endX, 2) + Math.pow(relativeY - endY, 2),
      );

      if (distance < minDistance) {
        minDistance = distance;
        bestPosition = i;
      }
    }

    document.body.removeChild(tempSpan);
    return bestPosition;
  }, [text, dimensions.width]);

  // Handle text click for editing
  const handleTextClick = useCallback((e) => {
    if (!isDragging && !resizeState.isResizing && editable) {
      e.stopPropagation();
      const cursorPos = calculateCursorPosition(e.clientX, e.clientY);
      setCursorPosition(cursorPos);
      setIsEditing(true);
    }
  }, [isDragging, resizeState.isResizing, editable, calculateCursorPosition]);

  // Handle text changes
  const handleTextChange = useCallback((e) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange?.(newText);
  }, [onTextChange]);

  // Handle editing end
  const handleTextBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  }, []);

  // Focus and cursor positioning
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
        }
      }, 0);
    }
  }, [isEditing, cursorPosition]);

  // Handle dragging
  const handleMouseDown = useCallback((e) => {
    if (e.target === noteRef.current || e.target.classList.contains('drag-handle')) {
      setIsDragging(true);
      dragRef.current = {
        isDragging: true,
        startX: e.clientX - position.x,
        startY: e.clientY - position.y,
      };
    }
  }, [position]);

  const handleMouseMove = useCallback((e) => {
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
  const handleResizeStart = useCallback((e, direction) => {
    e.stopPropagation();

    const newResizeState = {
      isResizing: true,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: dimensions.width,
      startHeight: dimensions.height,
    };

    setResizeState(newResizeState);

    const handleResizeMove = (e) => {
      const deltaX = e.clientX - newResizeState.startX;
      const deltaY = e.clientY - newResizeState.startY;

      let newWidth = newResizeState.startWidth;
      let newHeight = newResizeState.startHeight;

      if (direction.includes('e')) { newWidth += deltaX; }
      if (direction.includes('w')) { newWidth -= deltaX; }
      if (direction.includes('s')) { newHeight += deltaY; }
      if (direction.includes('n')) { newHeight -= deltaY; }

      newWidth = Math.max(150, Math.min(500, newWidth));
      newHeight = Math.max(150, Math.min(500, newHeight));

      setDimensions({ width: newWidth, height: newHeight });
      onResize?.(newWidth, newHeight);
    };

    const handleResizeEnd = () => {
      setResizeState((prev) => ({ ...prev, isResizing: false, direction: null }));
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

  // Theme change handler
  const handleThemeChange = useCallback((newTheme) => {
    setSelectedTheme(newTheme);
    onThemeChange?.(newTheme);
  }, [onThemeChange]);

  // Control panel hover handlers
  const handleShowControls = useCallback(() => {
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
      hideControlsTimeoutRef.current = null;
    }
    setShowControls(true);
  }, []);

  const handleHideControls = useCallback(() => {
    hideControlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 200);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, []);

  // Note styles
  const noteStyles = {
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    transform: `translate(${position.x}px, ${position.y}px) ${isDragging ? 'scale(1.05) rotate(-1deg)' : isHovered ? 'scale(1.02)' : 'rotate(0.5deg)'
    }`,
    transition: isDragging || resizeState.isResizing ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: isDragging || resizeState.isResizing ? 1000 : 'auto',
    filter: `drop-shadow(3px 6px 12px ${currentTheme.shadowColor})`,
  };

  return (
    <div className='relative inline-block'>
      {/* Load Google Fonts */}
      <link href='https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap' rel='stylesheet' />

      {/* Control Panel */}
      {showControls && (
        <div
          className='absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-2xl p-4 flex items-center gap-4 z-40 border border-gray-200'
          onMouseEnter={handleShowControls}
          onMouseLeave={handleHideControls}
        >
          <div className='flex gap-2'>
            {Object.entries(themes).map(([themeKey, themeConfig]) => (
              <button
                key={themeKey}
                onClick={() => handleThemeChange(themeKey)}
                className={`
                  w-8 h-8 rounded-lg border-2 border-white shadow-md 
                  hover:scale-110 transition-all duration-200 
                  ${themeConfig.background}
                  ${selectedTheme === themeKey ? 'ring-2 ring-gray-600 scale-110' : ''}
                `}
                title={`${themeConfig.name} theme`}
                style={{
                  backgroundColor: themeConfig.paperColor,
                  borderColor: themeConfig.borderColor,
                }}
              />
            ))}
          </div>

          {onDelete && (
            <div className='w-px h-6 bg-gray-300' />
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className='text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg'
              title='Delete note'
            >
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <path d='M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6' />
                <path d='M10 11v6M14 11v6' />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Paper Torn Sticky Note */}
      <div
        ref={noteRef}
        className='relative cursor-move select-none group'
        style={noteStyles}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => {
          setIsHovered(true);
          handleShowControls();
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          handleHideControls();
        }}
      >
        {/* Torn Paper Shape */}
        <svg
          className='absolute inset-0 w-full h-full'
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
        >
          <polygon
            points={tornEdgePath}
            fill={currentTheme.paperColor}
            stroke={currentTheme.borderColor}
            strokeWidth='1'
            strokeOpacity='0.3'
          />

          {/* Paper texture overlay */}
          <defs>
            <pattern id={`paper-texture-${id}`} x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'>
              <circle cx='2' cy='2' r='0.5' fill={currentTheme.borderColor} opacity='0.05' />
              <circle cx='12' cy='8' r='0.3' fill={currentTheme.borderColor} opacity='0.03' />
              <circle cx='6' cy='15' r='0.4' fill={currentTheme.borderColor} opacity='0.04' />
              <circle cx='16' cy='16' r='0.2' fill={currentTheme.borderColor} opacity='0.02' />
            </pattern>
          </defs>
          <polygon
            points={tornEdgePath}
            fill={`url(#paper-texture-${id})`}
          />
        </svg>

        {/* Punch Holes */}
        <div className='absolute left-4 top-6 flex flex-col gap-4'>
          <div
            className='w-3 h-3 rounded-full border-2'
            style={{
              backgroundColor: 'white',
              borderColor: currentTheme.borderColor,
              boxShadow: `inset 0 2px 4px ${currentTheme.shadowColor}`,
            }}
          />
          <div
            className='w-3 h-3 rounded-full border-2'
            style={{
              backgroundColor: 'white',
              borderColor: currentTheme.borderColor,
              boxShadow: `inset 0 2px 4px ${currentTheme.shadowColor}`,
            }}
          />
          <div
            className='w-3 h-3 rounded-full border-2'
            style={{
              backgroundColor: 'white',
              borderColor: currentTheme.borderColor,
              boxShadow: `inset 0 2px 4px ${currentTheme.shadowColor}`,
            }}
          />
        </div>

        {/* Ruled Lines */}
        <div className='absolute inset-0 pointer-events-none pt-6'>
          {Array.from({ length: Math.floor((dimensions.height - 40) / 28) }).map((_, i) => (
            <div
              key={i}
              className='absolute left-12 right-4 h-px opacity-20'
              style={{
                top: `${50 + i * 28}px`,
                backgroundColor: currentTheme.borderColor,
              }}
            />
          ))}
        </div>

        {/* Red Margin Line */}
        <div
          className='absolute top-0 bottom-0 w-px opacity-30'
          style={{
            left: '50px',
            backgroundColor: '#dc2626',
          }}
        />

        {/* Content Area */}
        <div
          className='relative z-10 h-full'
          style={{
            paddingLeft: '60px',
            paddingRight: '20px',
            paddingTop: '30px',
            paddingBottom: '20px',
            color: currentTheme.textColor,
          }}
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
                e.preventDefault();
                setTimeout(() => {
                  if (textareaRef.current) {
                    textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
                  }
                }, 0);
              }}
              className='w-full h-full resize-none border-none outline-none bg-transparent placeholder-opacity-50'
              placeholder='Write your note here...'
              style={{
                fontFamily: '"Caveat", cursive',
                fontSize: '16px',
                lineHeight: '1.6',
                color: currentTheme.textColor,
                background: 'transparent',
              }}
            />
          ) : (
            <div
              ref={textDisplayRef}
              className='w-full h-full overflow-hidden cursor-text'
            >
              <p
                className='whitespace-pre-wrap break-words'
                style={{
                  fontFamily: '"Caveat", cursive',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: currentTheme.textColor,
                }}
              >
                {text || (
                  <span className='opacity-60 italic'>Click to write...</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Resize Handle */}
        <div
          className='absolute bottom-2 right-2 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-70 transition-opacity z-20'
          onMouseDown={(e) => handleResizeStart(e, 'se')}
        >
          <div className='w-full h-full flex items-end justify-end'>
            <div
              className='w-3 h-3 border-r-2 border-b-2 opacity-50'
              style={{ borderColor: currentTheme.borderColor }}
            />
          </div>
        </div>

        {/* Coffee Stain (decorative) */}
        <div
          className='absolute w-6 h-6 rounded-full opacity-10 pointer-events-none'
          style={{
            backgroundColor: '#8b4513',
            top: '20%',
            right: '15%',
            transform: 'rotate(15deg)',
          }}
        />
      </div>
    </div>
  );
};

// Demo Component
const PaperTornStickyNoteDemo = () => {
  const [notes, setNotes] = useState([
    {
      id: '1',
      text: 'Buy groceries 📝\n• Milk\n• Bread\n• Coffee\n• Eggs',
      theme: 'vintage',
      size: 'medium',
    },
    {
      id: '2',
      text: 'Meeting agenda:\n- Project review\n- Budget discussion\n- Next steps\n\n📅 3:00 PM today',
      theme: 'notebook',
      size: 'medium',
    },
    {
      id: '3',
      text: 'Recipe ideas 👨‍🍳\n\nTry making:\n• Pasta carbonara\n• Chocolate cake\n• Fresh bread',
      theme: 'parchment',
      size: 'medium',
    },
    {
      id: '4',
      text: 'Weekend plans 🌟\n\n- Visit the museum\n- Walk in the park\n- Call grandma\n- Read a book',
      theme: 'mint',
      size: 'medium',
    },
  ]);

  const addNote = useCallback(() => {
    const themes = ['vintage', 'notebook', 'parchment', 'mint', 'rose', 'slate'];
    const sizes = ['small', 'medium', 'large'];

    const newNote = {
      id: `note-${Date.now()}`,
      text: 'New paper note...',
      theme: themes[Math.floor(Math.random() * themes.length)],
      size: sizes[Math.floor(Math.random() * sizes.length)],
    };

    setNotes((prev) => [...prev, newNote]);
  }, []);

  const deleteNote = useCallback((id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }, []);

  const updateNote = useCallback((id, updates) => {
    setNotes((prev) => prev.map((note) =>
      note.id === id ? { ...note, ...updates } : note,
    ));
  }, []);

  return (
    <div
      className='min-h-screen p-8 relative overflow-hidden'
      style={{
        background: 'linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 50%, #fef3c7 100%)',
      }}
    >
      {/* Cork board texture */}
      <div
        className='absolute inset-0 opacity-20 pointer-events-none'
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #8b4513 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, #8b4513 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-16'>
          <h1 className='text-6xl font-bold text-gray-800 mb-6' style={{ fontFamily: '"Caveat", cursive' }}>
            📝 Paper Torn Notes
          </h1>
          <p className='text-gray-600 mb-10 text-xl'>
            Vintage • Handwritten • Authentic • Interactive
          </p>
          <button
            onClick={addNote}
            className='px-10 py-5 bg-amber-600 text-white rounded-2xl hover:bg-amber-700 transition-all duration-300 shadow-xl hover:shadow-2xl font-medium text-lg transform hover:scale-105 border-2 border-amber-700'
            style={{ fontFamily: '"Caveat", cursive' }}
          >
            ✏️ Add Paper Note
          </button>
        </div>

        <div className='relative min-h-96'>
          {notes.map((note, index) => (
            <div
              key={note.id}
              className='absolute'
              style={{
                left: `${(index % 3) * 320 + Math.random() * 80}px`,
                top: `${Math.floor(index / 3) * 320 + Math.random() * 80}px`,
              }}
            >
              <PaperTornStickyNote
                id={note.id}
                initialText={note.text}
                theme={note.theme}
                size={note.size}
                onTextChange={(text) => updateNote(note.id, { text })}
                onThemeChange={(theme) => updateNote(note.id, { theme })}
                onDelete={() => deleteNote(note.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaperTornStickyNoteDemo;