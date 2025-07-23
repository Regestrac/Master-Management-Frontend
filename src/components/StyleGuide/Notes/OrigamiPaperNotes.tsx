import { useState, useRef, useEffect, useCallback } from 'react';

const OrigamiStickyNote = ({
  id = `origami-note-${Date.now()}`,
  initialText = '',
  theme = 'warm-yellow',
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
    small: { width: 200, height: 200 },
    medium: { width: 280, height: 280 },
    large: { width: 360, height: 360 },
  };

  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [foldAnimation, setFoldAnimation] = useState(false);

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
  const colorPickerRef = useRef(null);
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
  });

  // Origami paper theme configurations
  const themes = {
    'warm-yellow': {
      name: 'Warm Yellow',
      light: {
        primary: '#FEF3C7',
        secondary: '#FCD34D',
        accent: '#F59E0B',
        text: '#92400E',
        shadow: 'rgba(245, 158, 11, 0.3)',
        fold: '#EAB308',
        texture: 'rgba(251, 191, 36, 0.1)',
        border: '#FCD34D',
      },
      dark: {
        primary: '#451A03',
        secondary: '#92400E',
        accent: '#F59E0B',
        text: '#FEF3C7',
        shadow: 'rgba(245, 158, 11, 0.4)',
        fold: '#D97706',
        texture: 'rgba(245, 158, 11, 0.1)',
        border: '#92400E',
      },
    },
    'sakura-pink': {
      name: 'Sakura Pink',
      light: {
        primary: '#FCE7F3',
        secondary: '#F9A8D4',
        accent: '#EC4899',
        text: '#9D174D',
        shadow: 'rgba(236, 72, 153, 0.3)',
        fold: '#E879F9',
        texture: 'rgba(244, 114, 182, 0.1)',
        border: '#F9A8D4',
      },
      dark: {
        primary: '#4C1D95',
        secondary: '#9D174D',
        accent: '#EC4899',
        text: '#FCE7F3',
        shadow: 'rgba(236, 72, 153, 0.4)',
        fold: '#C026D3',
        texture: 'rgba(236, 72, 153, 0.1)',
        border: '#9D174D',
      },
    },
    'ocean-blue': {
      name: 'Ocean Blue',
      light: {
        primary: '#DBEAFE',
        secondary: '#93C5FD',
        accent: '#3B82F6',
        text: '#1E40AF',
        shadow: 'rgba(59, 130, 246, 0.3)',
        fold: '#6366F1',
        texture: 'rgba(96, 165, 250, 0.1)',
        border: '#93C5FD',
      },
      dark: {
        primary: '#1E3A8A',
        secondary: '#1E40AF',
        accent: '#3B82F6',
        text: '#DBEAFE',
        shadow: 'rgba(59, 130, 246, 0.4)',
        fold: '#4F46E5',
        texture: 'rgba(59, 130, 246, 0.1)',
        border: '#1E40AF',
      },
    },
    'forest-green': {
      name: 'Forest Green',
      light: {
        primary: '#D1FAE5',
        secondary: '#6EE7B7',
        accent: '#10B981',
        text: '#065F46',
        shadow: 'rgba(16, 185, 129, 0.3)',
        fold: '#059669',
        texture: 'rgba(52, 211, 153, 0.1)',
        border: '#6EE7B7',
      },
      dark: {
        primary: '#064E3B',
        secondary: '#065F46',
        accent: '#10B981',
        text: '#D1FAE5',
        shadow: 'rgba(16, 185, 129, 0.4)',
        fold: '#047857',
        texture: 'rgba(16, 185, 129, 0.1)',
        border: '#065F46',
      },
    },
    'sunset-orange': {
      name: 'Sunset Orange',
      light: {
        primary: '#FED7AA',
        secondary: '#FB923C',
        accent: '#F97316',
        text: '#9A3412',
        shadow: 'rgba(249, 115, 22, 0.3)',
        fold: '#EA580C',
        texture: 'rgba(251, 146, 60, 0.1)',
        border: '#FB923C',
      },
      dark: {
        primary: '#9A3412',
        secondary: '#C2410C',
        accent: '#F97316',
        text: '#FED7AA',
        shadow: 'rgba(249, 115, 22, 0.4)',
        fold: '#DC2626',
        texture: 'rgba(249, 115, 22, 0.1)',
        border: '#C2410C',
      },
    },
    'lavender-purple': {
      name: 'Lavender Purple',
      light: {
        primary: '#E9D5FF',
        secondary: '#C4B5FD',
        accent: '#8B5CF6',
        text: '#5B21B6',
        shadow: 'rgba(139, 92, 246, 0.3)',
        fold: '#7C3AED',
        texture: 'rgba(167, 139, 250, 0.1)',
        border: '#C4B5FD',
      },
      dark: {
        primary: '#581C87',
        secondary: '#6B21A8',
        accent: '#8B5CF6',
        text: '#E9D5FF',
        shadow: 'rgba(139, 92, 246, 0.4)',
        fold: '#6D28D9',
        texture: 'rgba(139, 92, 246, 0.1)',
        border: '#6B21A8',
      },
    },
    'mint-green': {
      name: 'Mint Green',
      light: {
        primary: '#A7F3D0',
        secondary: '#6EE7B7',
        accent: '#34D399',
        text: '#065F46',
        shadow: 'rgba(52, 211, 153, 0.3)',
        fold: '#10B981',
        texture: 'rgba(110, 231, 183, 0.1)',
        border: '#6EE7B7',
      },
      dark: {
        primary: '#022C22',
        secondary: '#065F46',
        accent: '#34D399',
        text: '#A7F3D0',
        shadow: 'rgba(52, 211, 153, 0.4)',
        fold: '#059669',
        texture: 'rgba(52, 211, 153, 0.1)',
        border: '#065F46',
      },
    },
    'cream-beige': {
      name: 'Cream Beige',
      light: {
        primary: '#FEF7ED',
        secondary: '#FDE68A',
        accent: '#D97706',
        text: '#92400E',
        shadow: 'rgba(217, 119, 6, 0.3)',
        fold: '#B45309',
        texture: 'rgba(253, 230, 138, 0.1)',
        border: '#FDE68A',
      },
      dark: {
        primary: '#451A03',
        secondary: '#78350F',
        accent: '#D97706',
        text: '#FEF7ED',
        shadow: 'rgba(217, 119, 6, 0.4)',
        fold: '#92400E',
        texture: 'rgba(217, 119, 6, 0.1)',
        border: '#78350F',
      },
    },
  };

  const currentTheme = themes[selectedTheme][isDarkMode ? 'dark' : 'light'];

  // Trigger fold animation
  const triggerFoldAnimation = useCallback(() => {
    setFoldAnimation(true);
    setTimeout(() => setFoldAnimation(false), 400);
  }, []);

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
    tempSpan.style.lineHeight = '1.5';
    tempSpan.style.whiteSpace = 'pre-wrap';
    tempSpan.style.padding = '24px';
    tempSpan.style.width = `${dimensions.width}px`;

    document.body.appendChild(tempSpan);

    const textContent = text || '';
    let bestPosition = 0;
    let minDistance = Infinity;

    for (let i = 0; i <= textContent.length; i++) {
      const testText = textContent.substring(0, i);
      tempSpan.textContent = testText;

      const spanRect = tempSpan.getBoundingClientRect();
      const endX = spanRect.width - 24;
      const endY = spanRect.height - 24;

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
      triggerFoldAnimation();
    }
  }, [isDragging, resizeState.isResizing, editable, calculateCursorPosition, triggerFoldAnimation]);

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

      newWidth = Math.max(180, Math.min(600, newWidth));
      newHeight = Math.max(180, Math.min(600, newHeight));

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
    setShowColorPicker(false);
    onThemeChange?.(newTheme);
    triggerFoldAnimation();
  }, [onThemeChange, triggerFoldAnimation]);

  // Handle click outside color picker
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColorPicker]);

  // Note styles with origami effects
  const noteStyles = {
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    transform: `translate(${position.x}px, ${position.y}px) ${isDragging ? 'scale(1.05) rotate(2deg)' :
      isHovered ? 'scale(1.02) rotate(0.5deg)' :
        'rotate(0deg)'
      }${foldAnimation ? ' rotateY(10deg)' : ''}`,
    transition: isDragging || resizeState.isResizing ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: isDragging || resizeState.isResizing ? 1000 : showColorPicker ? 900 : 'auto',
    backgroundColor: currentTheme.primary,
    boxShadow: `
      0 4px 6px -1px ${currentTheme.shadow},
      0 2px 4px -1px ${currentTheme.shadow},
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    borderLeft: `4px solid ${currentTheme.accent}`,
    borderTop: `1px solid ${currentTheme.border}`,
    borderRight: `1px solid ${currentTheme.border}`,
    borderBottom: `1px solid ${currentTheme.border}`,
  };

  return (
    <div className='relative inline-block'>
      {/* Paper texture background */}
      <div
        className='absolute inset-0 pointer-events-none opacity-30'
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, ${currentTheme.texture} 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, ${currentTheme.texture} 1px, transparent 1px),
            radial-gradient(circle at 40% 80%, ${currentTheme.texture} 0.5px, transparent 0.5px)
          `,
          backgroundSize: '30px 30px, 40px 40px, 25px 25px',
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          borderRadius: '0 8px 8px 0',
        }}
      />

      {/* Origami Sticky Note */}
      <div
        ref={noteRef}
        className='relative cursor-move select-none group'
        style={noteStyles}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Paper fold effect - top left corner */}
        <div
          className='absolute top-0 left-0 w-8 h-8 overflow-hidden'
          style={{
            background: `linear-gradient(135deg, ${currentTheme.fold} 0%, ${currentTheme.secondary} 100%)`,
            clipPath: 'polygon(0 0, 100% 0, 0 100%)',
          }}
        />

        {/* Paper fold shadow */}
        <div
          className='absolute top-0 left-0 w-8 h-8 opacity-20'
          style={{
            background: `linear-gradient(135deg, ${currentTheme.shadow} 0%, transparent 100%)`,
            clipPath: 'polygon(0 0, 100% 0, 0 100%)',
          }}
        />

        {/* Color picker button */}
        <div
          ref={colorPickerRef}
          className='absolute top-2 right-2 z-30'
        >
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className='w-6 h-6 rounded-full shadow-md border-2 border-white transition-all duration-200 hover:scale-110'
            style={{
              backgroundColor: currentTheme.accent,
              boxShadow: `0 2px 4px ${currentTheme.shadow}`,
            }}
            title='Change color'
          >
            <div className='w-2 h-2 bg-white rounded-full mx-auto' />
          </button>

          {/* Origami Color Picker Dropdown */}
          {showColorPicker && (
            <div
              className='absolute top-8 right-0 p-3 rounded-lg border-2 z-50 grid grid-cols-2 gap-2 min-w-48'
              style={{
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                borderColor: currentTheme.border,
                boxShadow: `0 10px 25px ${currentTheme.shadow}`,
              }}
            >
              {Object.entries(themes).map(([themeKey, themeConfig]) => (
                <button
                  key={themeKey}
                  onClick={() => handleThemeChange(themeKey)}
                  className={`
                    w-16 h-12 rounded-lg border-2 transition-all duration-200 
                    hover:scale-105 relative overflow-hidden
                    ${selectedTheme === themeKey ? 'ring-2 ring-offset-2 ring-offset-transparent' : ''}
                  `}
                  style={{
                    backgroundColor: themeConfig[isDarkMode ? 'dark' : 'light'].primary,
                    borderColor: themeConfig[isDarkMode ? 'dark' : 'light'].border,
                    boxShadow: `0 2px 4px ${themeConfig[isDarkMode ? 'dark' : 'light'].shadow}`,
                    ringColor: selectedTheme === themeKey ? themeConfig[isDarkMode ? 'dark' : 'light'].accent : 'transparent',
                  }}
                  title={themeConfig.name}
                >
                  {/* Mini fold effect */}
                  <div
                    className='absolute top-0 left-0 w-3 h-3'
                    style={{
                      background: themeConfig[isDarkMode ? 'dark' : 'light'].fold,
                      clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                    }}
                  />
                  <div
                    className='absolute bottom-1 right-1 w-3 h-3 rounded-full'
                    style={{ backgroundColor: themeConfig[isDarkMode ? 'dark' : 'light'].accent }}
                  />
                </button>
              ))}

              {/* Dark/Light Mode Toggle */}
              <div className='col-span-2 flex justify-center mt-2 pt-2 border-t border-opacity-30' style={{ borderColor: currentTheme.border }}>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className='flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105'
                  style={{
                    backgroundColor: isDarkMode ? currentTheme.accent + '20' : currentTheme.primary,
                    color: currentTheme.text,
                    border: `1px solid ${currentTheme.border}`,
                  }}
                  title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                >
                  {isDarkMode ? (
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                      <circle cx='12' cy='12' r='4' />
                      <path d='M12 2v2M12 20v2M4.22 4.22l1.42 1.42M17.36 17.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M17.36 6.64l1.42-1.42' />
                    </svg>
                  ) : (
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                      <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
                    </svg>
                  )}
                  <span className='text-sm font-medium'>
                    {isDarkMode ? 'Light' : 'Dark'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={onDelete}
            className='absolute top-2 left-10 w-6 h-6 rounded-full shadow-md border-2 border-white transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 z-30 flex items-center justify-center'
            style={{
              backgroundColor: '#EF4444',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
            }}
            title='Delete note'
          >
            <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
              <path d='M18 6L6 18M6 6l12 12' />
            </svg>
          </button>
        )}

        {/* Content Area */}
        <div
          className='relative z-10 h-full p-6 pt-12'
          style={{ color: currentTheme.text }}
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
              className='w-full h-full resize-none border-none outline-none bg-transparent placeholder-opacity-60'
              placeholder='Write your thoughts here...'
              style={{
                fontFamily: '"Caveat", cursive',
                fontSize: '18px',
                lineHeight: '1.5',
                color: currentTheme.text,
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
                  fontSize: '18px',
                  lineHeight: '1.5',
                  color: currentTheme.text,
                }}
              >
                {text || (
                  <span className='opacity-60 italic'>Click to write...</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Origami Resize Handle */}
        <div
          className='absolute bottom-0 right-0 w-8 h-8 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-20'
          onMouseDown={(e) => handleResizeStart(e, 'se')}
          style={{
            background: `linear-gradient(135deg, ${currentTheme.fold}, ${currentTheme.secondary})`,
            clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
          }}
        >
          <div className='absolute bottom-1 right-1 w-2 h-2 bg-white rounded-full opacity-70' />
        </div>

        {/* Paper crease lines */}
        <div className='absolute inset-0 pointer-events-none'>
          <div
            className='absolute top-8 left-0 right-0 h-px opacity-20'
            style={{ backgroundColor: currentTheme.fold }}
          />
          <div
            className='absolute bottom-8 left-0 right-0 h-px opacity-20'
            style={{ backgroundColor: currentTheme.fold }}
          />
        </div>

        {/* Subtle paper texture overlay */}
        <div
          className='absolute inset-0 pointer-events-none opacity-10'
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                ${currentTheme.texture} 0px,
                ${currentTheme.texture} 1px,
                transparent 1px,
                transparent 4px
              )
            `,
          }}
        />
      </div>

      {/* CSS Animations */}
      <style jsx>
        {`
        @keyframes paperFold {
          0% { transform: rotateY(0deg) scale(1); }
          50% { transform: rotateY(10deg) scale(1.02); }
          100% { transform: rotateY(0deg) scale(1); }
        }
        
        @keyframes paperFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
      `}
      </style>
    </div>
  );
};

// Demo Component
const OrigamiStickyNoteDemo = () => {
  const [notes, setNotes] = useState([
    {
      id: '1',
      text: 'Origami Paper Notes 📝\n\n• Authentic paper texture\n• Realistic fold effects\n• Handwritten font style\n• Warm, natural colors',
      theme: 'warm-yellow',
      size: 'medium',
    },
    {
      id: '2',
      text: 'Design Inspiration 🎨\n\nJapanese paper folding art\n→ Clean geometric shapes\n→ Subtle shadows and depth\n→ Tactile, organic feel',
      theme: 'sakura-pink',
      size: 'medium',
    },
    {
      id: '3',
      text: 'Meeting Notes 📋\n\n✓ Project timeline review\n✓ Budget allocation\n✓ Team assignments\n✓ Next milestone planning\n\nDeadline: End of sprint',
      theme: 'ocean-blue',
      size: 'large',
    },
    {
      id: '4',
      text: 'Quick Reminder 💭\n\nDon\'t forget to:\n• Water the plants\n• Call grandma\n• Pick up groceries\n• Finish the presentation',
      theme: 'forest-green',
      size: 'medium',
    },
  ]);

  const [globalDarkMode, setGlobalDarkMode] = useState(false);

  const addNote = useCallback(() => {
    const themes = ['warm-yellow', 'sakura-pink', 'ocean-blue', 'forest-green', 'sunset-orange', 'lavender-purple', 'mint-green', 'cream-beige'];
    const sizes = ['small', 'medium', 'large'];

    const newNote = {
      id: `note-${Date.now()}`,
      text: 'Fresh paper note...\n\nReady for your thoughts!',
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
      className={`
        min-h-screen p-8 relative overflow-hidden transition-all duration-500
        ${globalDarkMode
          ? 'bg-gradient-to-br from-slate-800 via-gray-900 to-slate-900'
          : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
        }
      `}
    >
      {/* Google Fonts Import */}
      <link
        href='https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap'
        rel='stylesheet'
      />

      {/* Subtle paper texture background */}
      <div
        className='absolute inset-0 opacity-20 pointer-events-none'
        style={{
          backgroundImage: globalDarkMode
            ? `
              radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `
            : `
              radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              radial-gradient(circle at 80% 70%, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
            `,
          backgroundSize: '40px 40px, 60px 60px',
        }}
      />

      {/* Floating paper elements */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={`absolute opacity-10 ${globalDarkMode ? 'bg-white' : 'bg-amber-200'
              }`}
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              top: `${10 + i * 30}%`,
              left: `${80 + i * 5}%`,
              transform: 'rotate(15deg)',
              clipPath: 'polygon(0 0, 90% 0, 100% 10%, 100% 100%, 0 100%)',
              animation: `paperFloat ${4 + i}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-16'>
          <h1
            className={`text-6xl font-bold mb-6 transition-colors duration-500 ${globalDarkMode ? 'text-amber-200' : 'text-amber-900'
              }`}
            style={{
              fontFamily: '"Caveat", cursive',
              letterSpacing: '-0.025em',
            }}
          >
            Origami Paper Notes
          </h1>
          <p
            className={`mb-10 text-xl transition-colors duration-500 ${globalDarkMode ? 'text-amber-300' : 'text-amber-700'
              }`}
            style={{ fontFamily: '"Caveat", cursive' }}
          >
            Authentic • Textured • Handcrafted • Natural
          </p>
          <div className='flex items-center justify-center gap-6'>
            <button
              onClick={addNote}
              className={`
                px-8 py-4 rounded-lg font-medium text-lg transform hover:scale-105 
                transition-all duration-300 shadow-lg hover:shadow-xl
                ${globalDarkMode
                  ? 'bg-amber-700 text-amber-100 hover:bg-amber-600'
                  : 'bg-amber-500 text-white hover:bg-amber-600'
                }
              `}
              style={{
                fontFamily: '"Caveat", cursive',
                fontSize: '20px',
                fontWeight: '600',
              }}
            >
              📝 Create Paper Note
            </button>

            <button
              onClick={() => setGlobalDarkMode(!globalDarkMode)}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105
                ${globalDarkMode
                  ? 'bg-slate-600 text-slate-100 hover:bg-slate-500'
                  : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                }
              `}
              style={{
                fontFamily: '"Caveat", cursive',
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              {globalDarkMode ? '☀️ Light Paper' : '🌙 Dark Paper'}
            </button>
          </div>
        </div>

        <div className='relative min-h-96'>
          {notes.map((note, index) => (
            <div
              key={note.id}
              className='absolute'
              style={{
                left: `${(index % 3) * 340 + Math.random() * 80}px`,
                top: `${Math.floor(index / 3) * 340 + Math.random() * 80}px`,
              }}
            >
              <OrigamiStickyNote
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

export default OrigamiStickyNoteDemo;