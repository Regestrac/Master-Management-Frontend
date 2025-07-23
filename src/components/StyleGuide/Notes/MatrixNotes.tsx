import { useState, useRef, useEffect, useCallback } from 'react';

const MatrixStickyNote = ({
  id = `matrix-note-${Date.now()}`,
  initialText = '',
  theme = 'classic-green',
  size = 'medium',
  initialWidth,
  initialHeight,
  onTextChange,
  onResize,
  onThemeChange,
  onDelete,
  className = '',
  editable = true,
}: any) => {
  // Size presets
  const sizePresets = {
    small: { width: 280, height: 200 },
    medium: { width: 360, height: 280 },
    large: { width: 460, height: 360 },
  };

  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [digitalRain, setDigitalRain] = useState<any>([]);
  const [glitchActive, setGlitchActive] = useState(false);
  const [scanLine, setScanLine] = useState(0);

  const defaultSize = sizePresets[size as keyof typeof sizePresets];
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
  const rainCanvasRef = useRef(null);
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
  });

  // Matrix theme configurations
  const themes = {
    'classic-green': {
      name: 'Classic Green',
      light: {
        background: 'rgba(0, 0, 0, 0.95)',
        border: '#00ff41',
        text: '#00ff41',
        accent: '#00ff41',
        glow: '0 0 20px rgba(0, 255, 65, 0.8)',
        rainColor: '#00ff41',
        scanColor: 'rgba(0, 255, 65, 0.3)',
        noise: 'rgba(0, 255, 65, 0.1)',
      },
      dark: {
        background: 'rgba(0, 0, 0, 0.98)',
        border: '#39ff14',
        text: '#39ff14',
        accent: '#39ff14',
        glow: '0 0 25px rgba(57, 255, 20, 0.9)',
        rainColor: '#39ff14',
        scanColor: 'rgba(57, 255, 20, 0.4)',
        noise: 'rgba(57, 255, 20, 0.15)',
      },
    },
    'red-alert': {
      name: 'Red Alert',
      light: {
        background: 'rgba(20, 0, 0, 0.95)',
        border: '#ff0040',
        text: '#ff0040',
        accent: '#ff0040',
        glow: '0 0 20px rgba(255, 0, 64, 0.8)',
        rainColor: '#ff0040',
        scanColor: 'rgba(255, 0, 64, 0.3)',
        noise: 'rgba(255, 0, 64, 0.1)',
      },
      dark: {
        background: 'rgba(30, 0, 0, 0.98)',
        border: '#ff1744',
        text: '#ff1744',
        accent: '#ff1744',
        glow: '0 0 25px rgba(255, 23, 68, 0.9)',
        rainColor: '#ff1744',
        scanColor: 'rgba(255, 23, 68, 0.4)',
        noise: 'rgba(255, 23, 68, 0.15)',
      },
    },
    'blue-ice': {
      name: 'Blue Ice',
      light: {
        background: 'rgba(0, 5, 20, 0.95)',
        border: '#00d4ff',
        text: '#00d4ff',
        accent: '#00d4ff',
        glow: '0 0 20px rgba(0, 212, 255, 0.8)',
        rainColor: '#00d4ff',
        scanColor: 'rgba(0, 212, 255, 0.3)',
        noise: 'rgba(0, 212, 255, 0.1)',
      },
      dark: {
        background: 'rgba(0, 8, 30, 0.98)',
        border: '#1de9ff',
        text: '#1de9ff',
        accent: '#1de9ff',
        glow: '0 0 25px rgba(29, 233, 255, 0.9)',
        rainColor: '#1de9ff',
        scanColor: 'rgba(29, 233, 255, 0.4)',
        noise: 'rgba(29, 233, 255, 0.15)',
      },
    },
    'purple-void': {
      name: 'Purple Void',
      light: {
        background: 'rgba(10, 0, 20, 0.95)',
        border: '#9d00ff',
        text: '#9d00ff',
        accent: '#9d00ff',
        glow: '0 0 20px rgba(157, 0, 255, 0.8)',
        rainColor: '#9d00ff',
        scanColor: 'rgba(157, 0, 255, 0.3)',
        noise: 'rgba(157, 0, 255, 0.1)',
      },
      dark: {
        background: 'rgba(15, 0, 30, 0.98)',
        border: '#b347ff',
        text: '#b347ff',
        accent: '#b347ff',
        glow: '0 0 25px rgba(179, 71, 255, 0.9)',
        rainColor: '#b347ff',
        scanColor: 'rgba(179, 71, 255, 0.4)',
        noise: 'rgba(179, 71, 255, 0.15)',
      },
    },
    'orange-fire': {
      name: 'Orange Fire',
      light: {
        background: 'rgba(20, 10, 0, 0.95)',
        border: '#ff6600',
        text: '#ff6600',
        accent: '#ff6600',
        glow: '0 0 20px rgba(255, 102, 0, 0.8)',
        rainColor: '#ff6600',
        scanColor: 'rgba(255, 102, 0, 0.3)',
        noise: 'rgba(255, 102, 0, 0.1)',
      },
      dark: {
        background: 'rgba(30, 15, 0, 0.98)',
        border: '#ff7700',
        text: '#ff7700',
        accent: '#ff7700',
        glow: '0 0 25px rgba(255, 119, 0, 0.9)',
        rainColor: '#ff7700',
        scanColor: 'rgba(255, 119, 0, 0.4)',
        noise: 'rgba(255, 119, 0, 0.15)',
      },
    },
    'white-ghost': {
      name: 'White Ghost',
      light: {
        background: 'rgba(10, 10, 10, 0.95)',
        border: '#ffffff',
        text: '#ffffff',
        accent: '#ffffff',
        glow: '0 0 20px rgba(255, 255, 255, 0.8)',
        rainColor: '#ffffff',
        scanColor: 'rgba(255, 255, 255, 0.3)',
        noise: 'rgba(255, 255, 255, 0.1)',
      },
      dark: {
        background: 'rgba(5, 5, 5, 0.98)',
        border: '#f0f0f0',
        text: '#f0f0f0',
        accent: '#f0f0f0',
        glow: '0 0 25px rgba(240, 240, 240, 0.9)',
        rainColor: '#f0f0f0',
        scanColor: 'rgba(240, 240, 240, 0.4)',
        noise: 'rgba(240, 240, 240, 0.15)',
      },
    },
  };

  const currentTheme = themes[selectedTheme as keyof typeof themes][isDarkMode ? 'dark' : 'light'];

  // Matrix characters for digital rain
  const matrixChars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345689Z:."=*+-<>¦|';

  // Initialize digital rain
  useEffect(() => {
    const drops = [];
    const columns = Math.floor(dimensions.width / 20);

    for (let i = 0; i < columns; i++) {
      drops.push({
        x: i * 20,
        y: Math.random() * dimensions.height,
        speed: Math.random() * 3 + 1,
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
      });
    }

    setDigitalRain(drops);
  }, [dimensions.width, dimensions.height]);

  // Animate digital rain
  useEffect(() => {
    if (!isHovered) { return; }

    const interval = setInterval(() => {
      setDigitalRain((prevRain) =>
        prevRain.map((drop) => ({
          ...drop,
          y: drop.y > dimensions.height ? -20 : drop.y + drop.speed,
          char: Math.random() > 0.95 ? matrixChars[Math.floor(Math.random() * matrixChars.length)] : drop.char,
        })),
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isHovered, dimensions.height]);

  // Scanning line animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine((prev) => (prev + 2) % dimensions.height);
    }, 50);

    return () => clearInterval(interval);
  }, [dimensions.height]);

  // Glitch effect
  const triggerGlitch = useCallback(() => {
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 200);
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
    tempSpan.style.fontSize = '14px';
    tempSpan.style.fontFamily = '"Courier New", monospace';
    tempSpan.style.lineHeight = '1.4';
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
      triggerGlitch();
    }
  }, [isDragging, resizeState.isResizing, editable, calculateCursorPosition, triggerGlitch]);

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

      newWidth = Math.max(250, Math.min(800, newWidth));
      newHeight = Math.max(180, Math.min(700, newHeight));

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
    triggerGlitch();
  }, [onThemeChange, triggerGlitch]);

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

  // Note styles
  const noteStyles = {
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    transform: `translate(${position.x}px, ${position.y}px) ${isDragging ? 'scale(1.02)' : ''
      }`,
    transition: isDragging || resizeState.isResizing ? 'none' : 'all 0.2s ease-out',
    zIndex: isDragging || resizeState.isResizing ? 1000 : showColorPicker ? 900 : 'auto',
    background: currentTheme.background,
    border: `2px solid ${currentTheme.border}`,
    boxShadow: `
      inset 0 0 0 1px ${currentTheme.border}30,
      ${currentTheme.glow},
      0 0 20px rgba(0, 0, 0, 0.5)
    `,
    filter: glitchActive ? 'hue-rotate(90deg) saturate(2)' : 'none',
  };

  return (
    <div className='relative inline-block font-mono'>
      {/* Matrix Digital Rain Sticky Note */}
      <div
        ref={noteRef}
        className='relative group overflow-hidden'
        style={noteStyles}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Digital Rain Background */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          {digitalRain.map((drop, index) => (
            <div
              key={index}
              className='absolute text-xs font-mono opacity-20 transition-opacity duration-300'
              style={{
                left: `${drop.x}px`,
                top: `${drop.y}px`,
                color: currentTheme.rainColor,
                fontSize: '12px',
                animation: isHovered ? 'matrixDrop 0.1s linear infinite' : 'none',
              }}
            >
              {drop.char}
            </div>
          ))}
        </div>

        {/* Scanning Line */}
        <div
          className='absolute left-0 right-0 h-px opacity-30 pointer-events-none'
          style={{
            top: `${scanLine}px`,
            background: `linear-gradient(90deg, transparent, ${currentTheme.scanColor}, transparent)`,
            boxShadow: `0 0 10px ${currentTheme.scanColor}`,
          }}
        />

        {/* Digital Noise Overlay */}
        <div
          className='absolute inset-0 pointer-events-none opacity-10'
          style={{
            backgroundImage: `
              radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, ${currentTheme.noise} 1px, transparent 1px),
              radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, ${currentTheme.noise} 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px, 30px 30px',
            animation: isHovered ? 'digitalNoise 1s linear infinite' : 'none',
          }}
        />

        {/* Corner Brackets */}
        <div className='absolute top-1 left-1 w-4 h-4 border-l-2 border-t-2 opacity-60' style={{ borderColor: currentTheme.border }} />
        <div className='absolute top-1 right-1 w-4 h-4 border-r-2 border-t-2 opacity-60' style={{ borderColor: currentTheme.border }} />
        <div className='absolute bottom-1 left-1 w-4 h-4 border-l-2 border-b-2 opacity-60' style={{ borderColor: currentTheme.border }} />
        <div className='absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 opacity-60' style={{ borderColor: currentTheme.border }} />

        {/* Header Panel */}
        <div
          className='absolute top-0 left-0 right-0 h-8 flex items-center justify-between px-3 drag-handle'
          style={{
            background: `linear-gradient(90deg, ${currentTheme.background}, ${currentTheme.border}20, ${currentTheme.background})`,
            borderBottom: `1px solid ${currentTheme.border}30`,
          }}
        >
          {/* Status Indicator */}
          <div className='flex items-center gap-2'>
            <div
              className='w-2 h-2 rounded-full animate-pulse'
              style={{ backgroundColor: currentTheme.accent }}
            />
            <div className='text-xs opacity-70' style={{ color: currentTheme.text }}>
              {isEditing ? 'EDIT_MODE' : 'READY'}
            </div>
          </div>

          {/* Controls */}
          <div className='flex items-center gap-2'>
            {/* Color Picker */}
            <div ref={colorPickerRef} className='relative'>
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className='w-6 h-6 border transition-all duration-200 hover:scale-110 flex items-center justify-center z-100'
                style={{
                  backgroundColor: currentTheme.background,
                  borderColor: currentTheme.border,
                  boxShadow: `inset 0 0 6px ${currentTheme.accent}40`,
                }}
                title='Change matrix color'
              >
                <div
                  className='w-2 h-2 rounded-sm'
                  style={{ backgroundColor: currentTheme.accent }}
                />
              </button>

              {/* Color Picker Dropdown */}
              {showColorPicker && (
                <div
                  className='absolute top-7 right-0 p-2 border z-50 min-w-48'
                  style={{
                    background: 'rgba(0, 0, 0, 0.95)',
                    borderColor: currentTheme.border,
                    boxShadow: `0 0 20px ${currentTheme.accent}60`,
                  }}
                >
                  <div className='grid grid-cols-2 gap-2 mb-2'>
                    {Object.entries(themes).map(([themeKey, themeConfig]) => (
                      <button
                        key={themeKey}
                        onClick={() => handleThemeChange(themeKey)}
                        className={`
                          w-full h-8 border text-xs font-mono transition-all duration-200 
                          hover:scale-105 flex items-center justify-center
                          ${selectedTheme === themeKey ? 'ring-1 ring-offset-1 ring-offset-transparent' : ''}
                        `}
                        style={{
                          backgroundColor: themeConfig[isDarkMode ? 'dark' : 'light'].background,
                          borderColor: themeConfig[isDarkMode ? 'dark' : 'light'].border,
                          color: themeConfig[isDarkMode ? 'dark' : 'light'].text,
                          boxShadow: `inset 0 0 10px ${themeConfig[isDarkMode ? 'dark' : 'light'].accent}40`,
                          ringColor: selectedTheme === themeKey ? themeConfig[isDarkMode ? 'dark' : 'light'].accent : 'transparent',
                        }}
                        title={themeConfig.name}
                      >
                        {themeConfig.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Dark/Light Mode Toggle */}
                  <div className='flex justify-center pt-2 border-t border-opacity-30' style={{ borderColor: currentTheme.border }}>
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className='flex items-center gap-2 px-3 py-1 text-xs font-mono transition-all duration-200 hover:scale-105'
                      style={{
                        backgroundColor: isDarkMode ? currentTheme.accent + '20' : currentTheme.background,
                        color: currentTheme.text,
                        border: `1px solid ${currentTheme.border}60`,
                      }}
                    >
                      <div className='w-2 h-2 rounded-full' style={{ backgroundColor: currentTheme.accent }} />
                      {isDarkMode ? 'DARK' : 'LIGHT'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Delete Button */}
            {onDelete && (
              <button
                onClick={onDelete}
                className='w-5 h-5 border transition-all duration-200 hover:scale-110 flex items-center justify-center'
                style={{
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  borderColor: '#ff0000',
                  color: '#ff0000',
                }}
                title='Delete note'
              >
                <svg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <path d='M18 6L6 18M6 6l12 12' />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div
          className='relative pt-8 p-4 h-full'
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
              className='w-full h-full resize-none border-none outline-none bg-transparent placeholder-opacity-50 font-mono'
              placeholder='> Enter command...'
              style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '14px',
                lineHeight: '1.4',
                color: currentTheme.text,
                background: 'transparent',
                caretColor: currentTheme.accent,
              }}
            />
          ) : (
            <div
              ref={textDisplayRef}
              className='w-full h-full overflow-hidden cursor-text'
            >
              <pre
                className='whitespace-pre-wrap break-words font-mono'
                style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: currentTheme.text,
                }}
              >
                {text || (
                  <span className='opacity-50 italic'> Click to initialize...</span>
                )}
              </pre>
            </div>
          )}
        </div>

        {/* Resize Handle */}
        <div
          className='absolute bottom-1 right-1 w-6 h-6 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center'
          onMouseDown={(e) => handleResizeStart(e, 'se')}
          style={{
            background: `linear-gradient(135deg, ${currentTheme.background}, ${currentTheme.border}40)`,
          }}
        >
          <div className='grid grid-cols-2 gap-px'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className='w-1 h-1 opacity-60'
                style={{ backgroundColor: currentTheme.accent }}
              />
            ))}
          </div>
        </div>

        {/* Glitch Effect Overlay */}
        {glitchActive && (
          <div className='absolute inset-0 pointer-events-none'>
            <div
              className='absolute inset-0 opacity-80'
              style={{
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  ${currentTheme.accent}40 2px,
                  ${currentTheme.accent}40 4px
                )`,
                animation: 'matrixGlitch 0.2s linear infinite',
              }}
            />
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>
        {`
        @keyframes matrixDrop {
          0% { opacity: 0.8; transform: translateY(0px); }
          100% { opacity: 0.2; transform: translateY(20px); }
        }
        
        @keyframes digitalNoise {
          0% { opacity: 0.05; }
          50% { opacity: 0.15; }
          100% { opacity: 0.05; }
        }
        
        @keyframes matrixGlitch {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
        }
        
        @keyframes matrixScan {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}
      </style>
    </div>
  );
};

// Demo Component
const MatrixStickyNoteDemo = () => {
  const [notes, setNotes] = useState([
    {
      id: '1',
      text: '> SYSTEM ONLINE\n> Neo... follow the white rabbit.\n> Initializing matrix protocols...\n> Status: ACTIVE',
      theme: 'classic-green',
      size: 'medium',
    },
    {
      id: '2',
      text: '> ALERT: ANOMALY DETECTED\n> Agent Smith pattern recognized\n> Activating countermeasures...\n> Red pill or blue pill?',
      theme: 'red-alert',
      size: 'medium',
    },
    {
      id: '3',
      text: '> ZION MAINFRAME ACCESS\n> Morpheus: "There is no spoon"\n> Reality.exe has stopped working\n> Welcome to the desert of the real',
      theme: 'blue-ice',
      size: 'large',
    },
    {
      id: '4',
      text: '> ORACLE CONSULTATION\n> The One has been identified\n> Prophecy fulfillment: 67%\n> Free your mind...',
      theme: 'purple-void',
      size: 'medium',
    },
  ]);

  const [globalDarkMode, setGlobalDarkMode] = useState(true);

  const addNote = useCallback(() => {
    const themes = ['classic-green', 'red-alert', 'blue-ice', 'purple-void', 'orange-fire', 'white-ghost'];
    const sizes = ['small', 'medium', 'large'];

    const newNote = {
      id: `note-${Date.now()}`,
      text: '> NEW_PROCESS_INITIALIZED\n> Awaiting user input...',
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
        min-h-screen p-8 relative overflow-hidden transition-all duration-500 font-mono
        ${globalDarkMode
          ? 'bg-black'
          : 'bg-gray-900'
        }
      `}
    >
      {/* Matrix Background Pattern */}
      <div
        className='absolute inset-0 opacity-5 pointer-events-none'
        style={{
          backgroundImage: globalDarkMode
            ? `
              linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)
            `
            : `
              linear-gradient(rgba(0, 255, 65, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 65, 0.05) 1px, transparent 1px)
            `,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Floating Matrix Characters */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className='absolute font-mono text-green-500 opacity-20 animate-pulse'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          >
            {['ﾊ', 'ﾐ', 'ﾋ', 'ｰ', 'ｳ', 'ｼ', 'ﾅ', 'ﾓ', 'ﾆ', 'ｻ', 'ﾜ', 'ﾂ', 'ｵ', 'ﾘ', 'ｱ', 'ﾎ', 'ﾃ', 'ﾏ', 'ｹ', 'ﾒ'][Math.floor(Math.random() * 20)]}
          </div>
        ))}
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-16'>
          <h1
            className={`text-6xl font-bold mb-6 transition-colors duration-500 font-mono ${globalDarkMode ? 'text-green-400' : 'text-green-500'
              }`}
            style={{
              letterSpacing: '0.1em',
              textShadow: globalDarkMode ? '0 0 20px rgba(0, 255, 65, 0.8)' : '0 0 10px rgba(0, 255, 65, 0.5)',
            }}
          >
            MATRIX_NOTES
          </h1>
          <p className={`mb-10 text-xl font-mono transition-colors duration-500 ${globalDarkMode ? 'text-green-300' : 'text-green-400'
            }`}
          >
            &gt; DIGITAL_RAIN • TERMINAL_INTERFACE • CYBER_REALITY
          </p>
          <div className='flex items-center justify-center gap-6'>
            <button
              onClick={addNote}
              className={`
                px-8 py-4 border-2 font-mono text-lg transform hover:scale-105 
                transition-all duration-300 relative overflow-hidden
                ${globalDarkMode
                  ? 'bg-black border-green-500 text-green-400 hover:bg-green-900'
                  : 'bg-gray-900 border-green-400 text-green-300 hover:bg-green-800'
                }
              `}
              style={{
                boxShadow: globalDarkMode
                  ? '0 0 20px rgba(0, 255, 65, 0.4)'
                  : '0 0 15px rgba(0, 255, 65, 0.3)',
                textShadow: '0 0 10px rgba(0, 255, 65, 0.8)',
              }}
            >
              + CREATE_NOTE
            </button>

            <button
              onClick={() => setGlobalDarkMode(!globalDarkMode)}
              className={`
                px-6 py-3 border-2 font-mono transition-all duration-300 transform hover:scale-105
                ${globalDarkMode
                  ? 'bg-black border-blue-500 text-blue-400 hover:bg-blue-900'
                  : 'bg-gray-900 border-blue-400 text-blue-300 hover:bg-blue-800'
                }
              `}
              style={{
                boxShadow: globalDarkMode
                  ? '0 0 20px rgba(0, 150, 255, 0.4)'
                  : '0 0 15px rgba(0, 150, 255, 0.3)',
                textShadow: '0 0 10px rgba(0, 150, 255, 0.8)',
              }}
            >
              {globalDarkMode ? 'LIGHT_MODE' : 'DARK_MODE'}
            </button>
          </div>
        </div>

        <div className='relative min-h-96'>
          {notes.map((note, index) => (
            <div
              key={note.id}
              className='absolute'
              style={{
                left: `${(index % 3) * 400 + Math.random() * 50}px`,
                top: `${Math.floor(index / 3) * 340 + Math.random() * 50}px`,
              }}
            >
              <MatrixStickyNote
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

export default MatrixStickyNoteDemo;