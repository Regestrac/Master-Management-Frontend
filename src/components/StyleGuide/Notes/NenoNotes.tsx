import { useState, useRef, useEffect, useCallback } from 'react';

const NeonCyberpunkStickyNote = ({
  id = `neon-note-${Date.now()}`,
  initialText = '',
  theme = 'cyber',
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
    small: { width: 220, height: 180 },
    medium: { width: 300, height: 240 },
    large: { width: 380, height: 300 },
  };

  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

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

  // Neon cyberpunk theme configurations
  const themes = {
    cyber: {
      light: {
        bg: 'bg-gradient-to-br from-slate-100 to-gray-200',
        cardBg: 'bg-gradient-to-br from-white to-slate-100',
        border: 'border-cyan-400',
        glow: 'shadow-cyan-400/30',
        text: 'text-gray-900',
        accent: 'bg-cyan-500',
        scan: '#00ffff',
        name: 'Cyber',
      },
      dark: {
        bg: 'bg-gradient-to-br from-gray-900 to-black',
        cardBg: 'bg-gradient-to-br from-gray-800 to-gray-900',
        border: 'border-cyan-400',
        glow: 'shadow-cyan-400/50',
        text: 'text-cyan-100',
        accent: 'bg-cyan-400',
        scan: '#00ffff',
        name: 'Cyber',
      },
    },
    neon: {
      light: {
        bg: 'bg-gradient-to-br from-pink-100 to-purple-200',
        cardBg: 'bg-gradient-to-br from-white to-pink-100',
        border: 'border-pink-400',
        glow: 'shadow-pink-400/30',
        text: 'text-gray-900',
        accent: 'bg-pink-500',
        scan: '#ff1493',
        name: 'Neon',
      },
      dark: {
        bg: 'bg-gradient-to-br from-purple-900 to-black',
        cardBg: 'bg-gradient-to-br from-purple-800 to-gray-900',
        border: 'border-pink-400',
        glow: 'shadow-pink-400/50',
        text: 'text-pink-100',
        accent: 'bg-pink-400',
        scan: '#ff1493',
        name: 'Neon',
      },
    },
    matrix: {
      light: {
        bg: 'bg-gradient-to-br from-green-100 to-emerald-200',
        cardBg: 'bg-gradient-to-br from-white to-green-100',
        border: 'border-green-400',
        glow: 'shadow-green-400/30',
        text: 'text-gray-900',
        accent: 'bg-green-500',
        scan: '#00ff00',
        name: 'Matrix',
      },
      dark: {
        bg: 'bg-gradient-to-br from-green-900 to-black',
        cardBg: 'bg-gradient-to-br from-green-800 to-gray-900',
        border: 'border-green-400',
        glow: 'shadow-green-400/50',
        text: 'text-green-100',
        accent: 'bg-green-400',
        scan: '#00ff00',
        name: 'Matrix',
      },
    },
    electric: {
      light: {
        bg: 'bg-gradient-to-br from-blue-100 to-indigo-200',
        cardBg: 'bg-gradient-to-br from-white to-blue-100',
        border: 'border-blue-400',
        glow: 'shadow-blue-400/30',
        text: 'text-gray-900',
        accent: 'bg-blue-500',
        scan: '#0080ff',
        name: 'Electric',
      },
      dark: {
        bg: 'bg-gradient-to-br from-blue-900 to-black',
        cardBg: 'bg-gradient-to-br from-blue-800 to-gray-900',
        border: 'border-blue-400',
        glow: 'shadow-blue-400/50',
        text: 'text-blue-100',
        accent: 'bg-blue-400',
        scan: '#0080ff',
        name: 'Electric',
      },
    },
    synthwave: {
      light: {
        bg: 'bg-gradient-to-br from-purple-100 to-pink-200',
        cardBg: 'bg-gradient-to-br from-white to-purple-100',
        border: 'border-purple-400',
        glow: 'shadow-purple-400/30',
        text: 'text-gray-900',
        accent: 'bg-purple-500',
        scan: '#8a2be2',
        name: 'Synthwave',
      },
      dark: {
        bg: 'bg-gradient-to-br from-purple-900 to-black',
        cardBg: 'bg-gradient-to-br from-purple-800 to-gray-900',
        border: 'border-purple-400',
        glow: 'shadow-purple-400/50',
        text: 'text-purple-100',
        accent: 'bg-purple-400',
        scan: '#8a2be2',
        name: 'Synthwave',
      },
    },
    toxic: {
      light: {
        bg: 'bg-gradient-to-br from-yellow-100 to-lime-200',
        cardBg: 'bg-gradient-to-br from-white to-yellow-100',
        border: 'border-lime-400',
        glow: 'shadow-lime-400/30',
        text: 'text-gray-900',
        accent: 'bg-lime-500',
        scan: '#32cd32',
        name: 'Toxic',
      },
      dark: {
        bg: 'bg-gradient-to-br from-lime-900 to-black',
        cardBg: 'bg-gradient-to-br from-lime-800 to-gray-900',
        border: 'border-lime-400',
        glow: 'shadow-lime-400/50',
        text: 'text-lime-100',
        accent: 'bg-lime-400',
        scan: '#32cd32',
        name: 'Toxic',
      },
    },
  };

  const currentTheme = themes[selectedTheme][isDarkMode ? 'dark' : 'light'];

  // Calculate cursor position from click
  const calculateCursorPosition = useCallback((clickX, clickY) => {
    if (!textDisplayRef.current) { return 0; }

    const rect = textDisplayRef.current.getBoundingClientRect();
    const relativeX = clickX - rect.left;
    const relativeY = clickY - rect.top;

    const tempSpan = document.createElement('span');
    tempSpan.style.position = 'absolute';
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.fontSize = '14px';
    tempSpan.style.fontFamily = '"Fira Code", "JetBrains Mono", monospace';
    tempSpan.style.lineHeight = '1.5';
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

      newWidth = Math.max(200, Math.min(600, newWidth));
      newHeight = Math.max(160, Math.min(600, newHeight));

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
    transform: `translate(${position.x}px, ${position.y}px) ${isDragging ? 'scale(1.02) skew(-1deg)' :
      isHovered ? 'scale(1.01) skew(-0.5deg)' :
        'skew(0deg)'
    }`,
    transition: isDragging || resizeState.isResizing ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: isDragging || resizeState.isResizing ? 1000 : 'auto',
    filter: isDarkMode ? 'brightness(1.1) contrast(1.2)' : 'brightness(1) contrast(1)',
  };

  return (
    <div className='relative inline-block'>
      {/* Load monospace fonts */}
      <link href='https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500;600&display=swap' rel='stylesheet' />

      {/* Floating Control Panel */}
      {showControls && (
        <div
          className={`
            absolute -top-24 left-1/2 transform -translate-x-1/2 
            ${isDarkMode ? 'bg-gray-900/90 border-gray-700' : 'bg-white/90 border-gray-300'}
            backdrop-blur-xl rounded-xl p-4 flex items-center gap-4 z-40
            border-2 shadow-2xl transition-all duration-300
          `}
          style={{
            boxShadow: isDarkMode ? `0 0 30px ${currentTheme.scan}40` : '0 10px 30px rgba(0,0,0,0.1)',
          }}
          onMouseEnter={handleShowControls}
          onMouseLeave={handleHideControls}
        >
          <div className='flex gap-2'>
            {Object.keys(themes).map((themeKey) => (
              <button
                key={themeKey}
                onClick={() => handleThemeChange(themeKey)}
                className={`
                  w-8 h-8 rounded-lg border-2 
                  hover:scale-110 transition-all duration-200 
                  ${themes[themeKey][isDarkMode ? 'dark' : 'light'].cardBg}
                  ${themes[themeKey][isDarkMode ? 'dark' : 'light'].border}
                  ${selectedTheme === themeKey ? 'ring-2 ring-offset-2 scale-110' : ''}
                  shadow-lg relative overflow-hidden
                `}
                style={{
                  boxShadow: selectedTheme === themeKey ?
                    `0 0 15px ${themes[themeKey][isDarkMode ? 'dark' : 'light'].scan}60` :
                    'none',
                  ringColor: themes[themeKey][isDarkMode ? 'dark' : 'light'].scan,
                }}
                title={`${themes[themeKey][isDarkMode ? 'dark' : 'light'].name} theme`}
              >
                <div
                  className='absolute inset-0 opacity-20'
                  style={{
                    background: `linear-gradient(45deg, ${themes[themeKey][isDarkMode ? 'dark' : 'light'].scan}40, transparent)`,
                  }}
                />
              </button>
            ))}
          </div>

          <div className={`w-px h-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`
              p-2 rounded-lg transition-all duration-200 relative overflow-hidden
              ${isDarkMode ? 'bg-gray-800 text-cyan-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              border-2
            `}
            style={{
              borderColor: currentTheme.scan,
              boxShadow: `0 0 10px ${currentTheme.scan}30`,
            }}
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? (
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <circle cx='12' cy='12' r='5' />
                <path d='M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42' />
              </svg>
            ) : (
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
              </svg>
            )}
          </button>

          {onDelete && (
            <>
              <div className={`w-px h-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
              <button
                onClick={onDelete}
                className={`
                  p-2 rounded-lg transition-all duration-200 border-2 border-red-500
                  ${isDarkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'}
                `}
                style={{
                  boxShadow: '0 0 10px #ff000030',
                }}
                title='Delete note'
              >
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <path d='M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6' />
                  <path d='M10 11v6M14 11v6' />
                </svg>
              </button>
            </>
          )}
        </div>
      )}

      {/* Neon Cyberpunk Sticky Note */}
      <div
        ref={noteRef}
        className={`
          relative cursor-move select-none group
          ${currentTheme.cardBg} ${currentTheme.border} 
          border-2 rounded-lg overflow-hidden
          transition-all duration-300
          ${className}
        `}
        style={{
          ...noteStyles,
          boxShadow: `
            0 0 20px ${currentTheme.scan}40,
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.1)
          `,
        }}
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
        {/* Scanning lines animation */}
        <div
          className='absolute inset-0 pointer-events-none rounded-lg overflow-hidden'
          style={{
            background: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 98px,
                ${currentTheme.scan}08 100px
              )
            `,
            animation: isDarkMode ? 'scan 3s linear infinite' : 'none',
          }}
        />

        {/* Corner brackets */}
        <div className='absolute top-2 left-2 w-4 h-4 pointer-events-none'>
          <div
            className='absolute top-0 left-0 w-3 h-px'
            style={{ backgroundColor: currentTheme.scan }}
          />
          <div
            className='absolute top-0 left-0 w-px h-3'
            style={{ backgroundColor: currentTheme.scan }}
          />
        </div>
        <div className='absolute top-2 right-2 w-4 h-4 pointer-events-none'>
          <div
            className='absolute top-0 right-0 w-3 h-px'
            style={{ backgroundColor: currentTheme.scan }}
          />
          <div
            className='absolute top-0 right-0 w-px h-3'
            style={{ backgroundColor: currentTheme.scan }}
          />
        </div>
        <div className='absolute bottom-2 left-2 w-4 h-4 pointer-events-none'>
          <div
            className='absolute bottom-0 left-0 w-3 h-px'
            style={{ backgroundColor: currentTheme.scan }}
          />
          <div
            className='absolute bottom-0 left-0 w-px h-3'
            style={{ backgroundColor: currentTheme.scan }}
          />
        </div>
        <div className='absolute bottom-2 right-2 w-4 h-4 pointer-events-none'>
          <div
            className='absolute bottom-0 right-0 w-3 h-px'
            style={{ backgroundColor: currentTheme.scan }}
          />
          <div
            className='absolute bottom-0 right-0 w-px h-3'
            style={{ backgroundColor: currentTheme.scan }}
          />
        </div>

        {/* Drag Handle Area */}
        <div className={`
          drag-handle absolute top-0 left-0 right-0 h-8 cursor-move 
          opacity-0 hover:opacity-20 transition-opacity rounded-t-lg
          ${isDarkMode ? 'bg-white' : 'bg-black'}
        `}
        />

        {/* Status bar */}
        <div
          className='absolute top-0 left-0 right-0 h-1 rounded-t-lg'
          style={{
            background: `linear-gradient(90deg, ${currentTheme.scan}, transparent, ${currentTheme.scan})`,
            animation: isDarkMode ? 'pulse 2s ease-in-out infinite' : 'none',
          }}
        />

        {/* Content Area */}
        <div
          className={`
            relative p-5 h-full ${currentTheme.text}
            ${!isEditing && editable ? 'cursor-text' : ''}
            rounded-lg
          `}
          style={{ paddingTop: '24px' }}
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
              className={`
                w-full h-full resize-none border-none outline-none bg-transparent
                ${currentTheme.text} text-sm leading-relaxed
                placeholder-opacity-50
              `}
              placeholder='> Enter data...'
              style={{
                fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                textShadow: isDarkMode ? `0 0 5px ${currentTheme.scan}50` : 'none',
              }}
            />
          ) : (
            <div
              ref={textDisplayRef}
              className='w-full h-full overflow-hidden'
            >
              <p
                className='text-sm leading-relaxed whitespace-pre-wrap break-words'
                style={{
                  fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  textShadow: isDarkMode ? `0 0 5px ${currentTheme.scan}50` : 'none',
                }}
              >
                {text || (
                  <span className='opacity-60 italic'> Click to initialize...</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Corner Resize Handle */}
        <div
          className='absolute bottom-0 right-0 w-6 h-6 cursor-se-resize opacity-0 group-hover:opacity-70 transition-opacity z-20'
          onMouseDown={(e) => handleResizeStart(e, 'se')}
        >
          <div className='absolute bottom-1 right-1 w-4 h-4'>
            <div
              className='absolute bottom-0 right-0 w-3 h-px opacity-80 rounded'
              style={{ backgroundColor: currentTheme.scan }}
            />
            <div
              className='absolute bottom-1 right-0 w-2 h-px opacity-60 rounded'
              style={{ backgroundColor: currentTheme.scan }}
            />
            <div
              className='absolute bottom-0 right-1 w-px h-3 opacity-80 rounded'
              style={{ backgroundColor: currentTheme.scan }}
            />
            <div
              className='absolute bottom-0 right-2 w-px h-2 opacity-60 rounded'
              style={{ backgroundColor: currentTheme.scan }}
            />
          </div>
        </div>

        {/* Glitch effect overlay */}
        {isDarkMode && isHovered && (
          <div
            className='absolute inset-0 pointer-events-none rounded-lg opacity-10'
            style={{
              background: `
                linear-gradient(45deg, 
                  transparent 40%, 
                  ${currentTheme.scan}20 50%, 
                  transparent 60%
                )
              `,
              animation: 'glitch 0.3s ease-in-out',
            }}
          />
        )}
      </div>

      {/* CSS Animations */}
      <style>
        {`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes glitch {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
        }
      `}
      </style>
    </div>
  );
};

// Demo Component
const NeonCyberpunkStickyNoteDemo = () => {
  const [notes, setNotes] = useState([
    {
      id: '1',
      text: '// System Status 🔋\nCPU: 85% active\nRAM: 12.3GB used\nNetwork: ONLINE\nSecurity: ENABLED',
      theme: 'cyber',
      size: 'medium',
    },
    {
      id: '2',
      text: '/* Terminal Log */\n> Accessing database...\n> Connection established\n> Query executed\n> Data retrieved: 2,847 records',
      theme: 'matrix',
      size: 'medium',
    },
    {
      id: '3',
      text: '# Neural Network Training\nEpoch: 42/100\nAccuracy: 94.7%\nLoss: 0.023\nETA: 2h 15m',
      theme: 'neon',
      size: 'medium',
    },
    {
      id: '4',
      text: '>>> Code Review\n- Optimize algorithms\n- Refactor legacy code\n- Update dependencies\n- Deploy to production',
      theme: 'electric',
      size: 'small',
    },
  ]);

  const [globalDarkMode, setGlobalDarkMode] = useState(true);

  const addNote = useCallback(() => {
    const themes = ['cyber', 'neon', 'matrix', 'electric', 'synthwave', 'toxic'];
    const sizes = ['small', 'medium', 'large'];

    const newNote = {
      id: `note-${Date.now()}`,
      text: '// New process initiated...\n> Ready for input',
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
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800'
        : 'bg-gradient-to-br from-gray-100 via-white to-gray-200'
        }
      `}
    >
      {/* Animated Grid Background */}
      <div
        className='absolute inset-0 opacity-20'
        style={{
          backgroundImage: globalDarkMode
            ? 'linear-gradient(#00ffff15 1px, transparent 1px), linear-gradient(90deg, #00ffff15 1px, transparent 1px)'
            : 'linear-gradient(#00000015 1px, transparent 1px), linear-gradient(90deg, #00000015 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          animation: globalDarkMode ? 'scan 4s linear infinite' : 'none',
        }}
      />

      {/* Floating particles */}
      {globalDarkMode && (
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className='absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60'
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                boxShadow: '0 0 6px currentColor',
              }}
            />
          ))}
        </div>
      )}

      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-16'>
          <h1
            className={`text-6xl font-bold mb-6 transition-colors duration-300 ${globalDarkMode ? 'text-cyan-400' : 'text-gray-900'
            }`}
            style={{
              fontFamily: '"Fira Code", "JetBrains Mono", monospace',
              textShadow: globalDarkMode ? '0 0 20px #00ffff80' : 'none',
            }}
          >
            {'<NEON_NOTES/>'}
          </h1>
          <p
            className={`mb-10 text-xl transition-colors duration-300 ${globalDarkMode ? 'text-cyan-200' : 'text-gray-600'
            }`}
            style={{
              fontFamily: '"Fira Code", "JetBrains Mono", monospace',
            }}
          >
            Cyberpunk • Terminal • Matrix • Futuristic
          </p>
          <div className='flex items-center justify-center gap-6'>
            <button
              onClick={addNote}
              className={`
                px-10 py-5 rounded-lg font-medium text-lg transform hover:scale-105 
                transition-all duration-300 shadow-xl hover:shadow-2xl border-2
                ${globalDarkMode
                ? 'bg-gray-900/80 text-cyan-400 border-cyan-400 hover:bg-gray-800/80'
                : 'bg-white text-gray-900 border-gray-400 hover:bg-gray-50'
                }
              `}
              style={{
                fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                boxShadow: globalDarkMode ? '0 0 20px #00ffff40' : '0 10px 30px rgba(0,0,0,0.1)',
                textShadow: globalDarkMode ? '0 0 10px currentColor' : 'none',
              }}
            >
              {'> CREATE_NOTE.exe'}
            </button>

            <button
              onClick={() => setGlobalDarkMode(!globalDarkMode)}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 border-2
                ${globalDarkMode
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 border-yellow-400'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-400'
                }
                shadow-lg hover:shadow-xl
              `}
              style={{
                fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                boxShadow: globalDarkMode ? '0 0 15px #ffff0040' : '0 5px 15px rgba(0,0,0,0.1)',
              }}
            >
              {globalDarkMode ? '[LIGHT_MODE]' : '[DARK_MODE]'}
            </button>
          </div>
        </div>

        <div className='relative min-h-96'>
          {notes.map((note, index) => (
            <div
              key={note.id}
              className='absolute'
              style={{
                left: `${(index % 3) * 380 + Math.random() * 80}px`,
                top: `${Math.floor(index / 3) * 320 + Math.random() * 80}px`,
              }}
            >
              <NeonCyberpunkStickyNote
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

      {/* CSS Animations */}
      <style>
        {`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}
      </style>
    </div>
  );
};

export default NeonCyberpunkStickyNoteDemo;