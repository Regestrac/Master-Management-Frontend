import { useState, useRef, useEffect, useCallback } from 'react';

const KeralaStickyNote = ({
  id = `kerala-note-${Date.now()}`,
  initialText = '',
  theme = 'backwater-green',
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
    small: { width: 260, height: 200 },
    medium: { width: 340, height: 280 },
    large: { width: 420, height: 360 },
  };

  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [rippleEffect, setRippleEffect] = useState(false);
  const [palmSway, setPalmSway] = useState(false);

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

  // Kerala theme configurations
  const themes = {
    'backwater-green': {
      name: 'Backwater Green',
      light: {
        primary: '#1A4D3A',
        secondary: '#2D6B50',
        accent: '#4A9B72',
        text: '#0F2A1F',
        background: 'linear-gradient(135deg, #E8F5E8 0%, #D4F1D4 100%)',
        border: '#4A9B72',
        shadow: 'rgba(74, 155, 114, 0.3)',
        palmColor: '#22C55E',
        waterColor: '#059669',
        boatColor: '#92400E',
        decorative: '#F59E0B',
      },
      dark: {
        primary: '#064E3B',
        secondary: '#065F46',
        accent: '#10B981',
        text: '#A7F3D0',
        background: 'linear-gradient(135deg, #022C22 0%, #064E3B 100%)',
        border: '#10B981',
        shadow: 'rgba(16, 185, 129, 0.4)',
        palmColor: '#34D399',
        waterColor: '#6EE7B7',
        boatColor: '#F59E0B',
        decorative: '#FBBF24',
      },
    },
    'coconut-brown': {
      name: 'Coconut Brown',
      light: {
        primary: '#92400E',
        secondary: '#A3560D',
        accent: '#D97706',
        text: '#451A03',
        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
        border: '#D97706',
        shadow: 'rgba(217, 119, 6, 0.3)',
        palmColor: '#16A34A',
        waterColor: '#0891B2',
        boatColor: '#7C2D12',
        decorative: '#DC2626',
      },
      dark: {
        primary: '#451A03',
        secondary: '#7C2D12',
        accent: '#F59E0B',
        text: '#FEF3C7',
        background: 'linear-gradient(135deg, #451A03 0%, #7C2D12 100%)',
        border: '#F59E0B',
        shadow: 'rgba(245, 158, 11, 0.4)',
        palmColor: '#22C55E',
        waterColor: '#06B6D4',
        boatColor: '#DC2626',
        decorative: '#EF4444',
      },
    },
    'spice-gold': {
      name: 'Spice Gold',
      light: {
        primary: '#B45309',
        secondary: '#D97706',
        accent: '#F59E0B',
        text: '#451A03',
        background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
        border: '#F59E0B',
        shadow: 'rgba(245, 158, 11, 0.3)',
        palmColor: '#059669',
        waterColor: '#0EA5E9',
        boatColor: '#A21CAF',
        decorative: '#DC2626',
      },
      dark: {
        primary: '#451A03',
        secondary: '#92400E',
        accent: '#FBBF24',
        text: '#FEF3C7',
        background: 'linear-gradient(135deg, #451A03 0%, #92400E 100%)',
        border: '#FBBF24',
        shadow: 'rgba(251, 191, 36, 0.4)',
        palmColor: '#10B981',
        waterColor: '#0EA5E9',
        boatColor: '#C026D3',
        decorative: '#EF4444',
      },
    },
    'ayurveda-sage': {
      name: 'Ayurveda Sage',
      light: {
        primary: '#365314',
        secondary: '#4D7C0F',
        accent: '#65A30D',
        text: '#1A2E05',
        background: 'linear-gradient(135deg, #F7FEE7 0%, #ECFCCB 100%)',
        border: '#65A30D',
        shadow: 'rgba(101, 163, 13, 0.3)',
        palmColor: '#16A34A',
        waterColor: '#0891B2',
        boatColor: '#92400E',
        decorative: '#F59E0B',
      },
      dark: {
        primary: '#1A2E05',
        secondary: '#365314',
        accent: '#84CC16',
        text: '#ECFCCB',
        background: 'linear-gradient(135deg, #1A2E05 0%, #365314 100%)',
        border: '#84CC16',
        shadow: 'rgba(132, 204, 22, 0.4)',
        palmColor: '#22C55E',
        waterColor: '#0EA5E9',
        boatColor: '#D97706',
        decorative: '#FBBF24',
      },
    },
    'temple-red': {
      name: 'Temple Red',
      light: {
        primary: '#991B1B',
        secondary: '#B91C1C',
        accent: '#DC2626',
        text: '#450A0A',
        background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
        border: '#DC2626',
        shadow: 'rgba(220, 38, 38, 0.3)',
        palmColor: '#059669',
        waterColor: '#0891B2',
        boatColor: '#92400E',
        decorative: '#F59E0B',
      },
      dark: {
        primary: '#450A0A',
        secondary: '#7F1D1D',
        accent: '#F87171',
        text: '#FEE2E2',
        background: 'linear-gradient(135deg, #450A0A 0%, #7F1D1D 100%)',
        border: '#F87171',
        shadow: 'rgba(248, 113, 113, 0.4)',
        palmColor: '#10B981',
        waterColor: '#0EA5E9',
        boatColor: '#D97706',
        decorative: '#FBBF24',
      },
    },
    'monsoon-blue': {
      name: 'Monsoon Blue',
      light: {
        primary: '#1E40AF',
        secondary: '#2563EB',
        accent: '#3B82F6',
        text: '#1E3A8A',
        background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        border: '#3B82F6',
        shadow: 'rgba(59, 130, 246, 0.3)',
        palmColor: '#059669',
        waterColor: '#0891B2',
        boatColor: '#92400E',
        decorative: '#F59E0B',
      },
      dark: {
        primary: '#1E3A8A',
        secondary: '#1E40AF',
        accent: '#60A5FA',
        text: '#DBEAFE',
        background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
        border: '#60A5FA',
        shadow: 'rgba(96, 165, 250, 0.4)',
        palmColor: '#10B981',
        waterColor: '#22D3EE',
        boatColor: '#D97706',
        decorative: '#FBBF24',
      },
    },
    'sunset-orange': {
      name: 'Sunset Orange',
      light: {
        primary: '#C2410C',
        secondary: '#EA580C',
        accent: '#F97316',
        text: '#7C2D12',
        background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
        border: '#F97316',
        shadow: 'rgba(249, 115, 22, 0.3)',
        palmColor: '#059669',
        waterColor: '#0891B2',
        boatColor: '#7C2D12',
        decorative: '#DC2626',
      },
      dark: {
        primary: '#7C2D12',
        secondary: '#C2410C',
        accent: '#FB923C',
        text: '#FFEDD5',
        background: 'linear-gradient(135deg, #7C2D12 0%, #C2410C 100%)',
        border: '#FB923C',
        shadow: 'rgba(251, 146, 60, 0.4)',
        palmColor: '#10B981',
        waterColor: '#0EA5E9',
        boatColor: '#451A03',
        decorative: '#EF4444',
      },
    },
    'kathakali-purple': {
      name: 'Kathakali Purple',
      light: {
        primary: '#7C3AED',
        secondary: '#8B5CF6',
        accent: '#A78BFA',
        text: '#581C87',
        background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
        border: '#A78BFA',
        shadow: 'rgba(167, 139, 250, 0.3)',
        palmColor: '#059669',
        waterColor: '#0891B2',
        boatColor: '#92400E',
        decorative: '#F59E0B',
      },
      dark: {
        primary: '#581C87',
        secondary: '#7C3AED',
        accent: '#C4B5FD',
        text: '#F3E8FF',
        background: 'linear-gradient(135deg, #581C87 0%, #7C3AED 100%)',
        border: '#C4B5FD',
        shadow: 'rgba(196, 181, 253, 0.4)',
        palmColor: '#10B981',
        waterColor: '#0EA5E9',
        boatColor: '#D97706',
        decorative: '#FBBF24',
      },
    },
  };

  const currentTheme = themes[selectedTheme][isDarkMode ? 'dark' : 'light'];

  // Trigger ripple effect
  const triggerRippleEffect = useCallback(() => {
    setRippleEffect(true);
    setTimeout(() => setRippleEffect(false), 600);
  }, []);

  // Trigger palm sway animation
  const triggerPalmSway = useCallback(() => {
    setPalmSway(true);
    setTimeout(() => setPalmSway(false), 2000);
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
    tempSpan.style.fontFamily = '"Noto Sans Malayalam", "Segoe UI", sans-serif';
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
      triggerRippleEffect();
    }
  }, [isDragging, resizeState.isResizing, editable, calculateCursorPosition, triggerRippleEffect]);

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

      newWidth = Math.max(240, Math.min(600, newWidth));
      newHeight = Math.max(180, Math.min(500, newHeight));

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
    triggerPalmSway();
  }, [onThemeChange, triggerPalmSway]);

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

  // Note styles with Kerala effects
  const noteStyles = {
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    transform: `translate(${position.x}px, ${position.y}px) ${isDragging ? 'scale(1.02) rotate(0.5deg)' :
        isHovered ? 'scale(1.01) rotate(0.2deg)' :
          'rotate(0deg)'
      }`,
    transition: isDragging || resizeState.isResizing ? 'none' : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: isDragging || resizeState.isResizing ? 1000 : showColorPicker ? 900 : 'auto',
    background: currentTheme.background,
    border: `2px solid ${currentTheme.border}`,
    boxShadow: `
      0 8px 25px -5px ${currentTheme.shadow},
      0 4px 10px -2px ${currentTheme.shadow},
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    borderRadius: '16px',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div className='relative inline-block'>
      {/* Google Fonts Import */}
      <link
        href='https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@300;400;500;600;700&display=swap'
        rel='stylesheet'
      />

      {/* Kerala Sticky Note */}
      <div
        ref={noteRef}
        className='relative cursor-move select-none group'
        style={noteStyles}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Coconut Palm Decoration */}
        <div className='absolute -top-2 -right-2 w-12 h-12 pointer-events-none'>
          <svg
            width='48'
            height='48'
            viewBox='0 0 48 48'
            className={`transition-all duration-1000 ${palmSway ? 'animate-pulse' : ''}`}
            style={{
              transform: palmSway ? 'rotate(10deg)' : 'rotate(0deg)',
              transformOrigin: 'bottom center',
            }}
          >
            {/* Palm leaves */}
            <g style={{ fill: currentTheme.palmColor, opacity: 0.8 }}>
              <path d='M24 40 C16 32, 8 24, 12 16 C16 20, 20 24, 24 40Z' />
              <path d='M24 40 C32 32, 40 24, 36 16 C32 20, 28 24, 24 40Z' />
              <path d='M24 40 C20 28, 16 16, 24 12 C28 16, 28 28, 24 40Z' />
              <path d='M24 40 C28 28, 32 16, 24 12 C20 16, 20 28, 24 40Z' />
            </g>
            {/* Trunk */}
            <rect x='22' y='35' width='4' height='8' rx='2' style={{ fill: currentTheme.boatColor }} />
            {/* Coconuts */}
            <circle cx='20' cy='30' r='2' style={{ fill: currentTheme.boatColor, opacity: 0.7 }} />
            <circle cx='28' cy='32' r='2' style={{ fill: currentTheme.boatColor, opacity: 0.7 }} />
          </svg>
        </div>

        {/* Traditional Kerala Border Pattern */}
        <div
          className='absolute inset-2 rounded-lg pointer-events-none opacity-20'
          style={{
            border: `1px solid ${currentTheme.decorative}`,
            borderStyle: 'dotted',
          }}
        />

        {/* Backwater Wave Pattern */}
        <div className='absolute bottom-0 left-0 right-0 h-8 pointer-events-none overflow-hidden rounded-b-lg'>
          <svg width='100%' height='100%' preserveAspectRatio='none'>
            <path
              d='M0,20 Q12,10 24,20 T48,20 T72,20 T96,20 T120,20 T144,20 T168,20 T192,20 T216,20 T240,20 T264,20 T288,20 T312,20 T336,20 T360,20 T384,20 T408,20 T432,20 T456,20 T480,20 L480,32 L0,32 Z'
              style={{
                fill: currentTheme.waterColor,
                opacity: 0.3,
                animation: isHovered ? 'wave 3s ease-in-out infinite' : 'none',
              }}
            />
          </svg>
        </div>

        {/* Houseboat Silhouette */}
        <div className='absolute bottom-2 right-4 w-12 h-6 pointer-events-none'>
          <svg width='100%' height='100%' viewBox='0 0 48 24'>
            <path
              d='M4,20 L8,16 L16,16 L20,12 L36,12 L40,16 L44,20 L44,22 L4,22 Z'
              style={{ fill: currentTheme.boatColor, opacity: 0.4 }}
            />
            <path
              d='M10,12 L14,8 L18,8 L22,12'
              style={{ fill: currentTheme.boatColor, opacity: 0.6 }}
            />
          </svg>
        </div>

        {/* Color picker button */}
        <div
          ref={colorPickerRef}
          className='absolute top-3 right-3 z-30'
        >
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className='w-8 h-8 rounded-full shadow-lg border-2 border-white transition-all duration-200 hover:scale-110 flex items-center justify-center'
            style={{
              background: `linear-gradient(135deg, ${currentTheme.accent}, ${currentTheme.primary})`,
              boxShadow: `0 4px 12px ${currentTheme.shadow}`,
            }}
            title='Change Kerala theme'
          >
            <div
              className='w-4 h-4 rounded-full border'
              style={{
                backgroundColor: currentTheme.decorative,
                borderColor: 'white',
              }}
            />
          </button>

          {/* Kerala Color Picker Dropdown */}
          {showColorPicker && (
            <div
              className='absolute top-10 right-0 p-4 rounded-xl border-2 z-50 grid grid-cols-2 gap-3 min-w-72'
              style={{
                background: `linear-gradient(135deg, ${isDarkMode ? '#1F2937' : '#FFFFFF'}, ${isDarkMode ? '#374151' : '#F9FAFB'})`,
                borderColor: currentTheme.border,
                boxShadow: `0 20px 40px ${currentTheme.shadow}`,
              }}
            >
              {Object.entries(themes).map(([themeKey, themeConfig]) => (
                <button
                  key={themeKey}
                  onClick={() => handleThemeChange(themeKey)}
                  className={`
                    w-28 h-20 rounded-lg border-2 transition-all duration-200 
                    hover:scale-105 relative overflow-hidden
                    ${selectedTheme === themeKey ? 'ring-2 ring-offset-2 ring-offset-transparent' : ''}
                  `}
                  style={{
                    background: themeConfig[isDarkMode ? 'dark' : 'light'].background,
                    borderColor: themeConfig[isDarkMode ? 'dark' : 'light'].border,
                    boxShadow: `0 4px 12px ${themeConfig[isDarkMode ? 'dark' : 'light'].shadow}`,
                    ringColor: selectedTheme === themeKey ? themeConfig[isDarkMode ? 'dark' : 'light'].accent : 'transparent',
                  }}
                  title={themeConfig.name}
                >
                  {/* Mini palm decoration */}
                  <div className='absolute top-1 right-1 w-4 h-4'>
                    <svg width='16' height='16' viewBox='0 0 16 16'>
                      <path
                        d='M8 14 C6 10, 4 8, 8 6 C10 8, 10 10, 8 14Z'
                        style={{ fill: themeConfig[isDarkMode ? 'dark' : 'light'].palmColor, opacity: 0.6 }}
                      />
                      <rect x='7' y='12' width='2' height='3' rx='1' style={{ fill: themeConfig[isDarkMode ? 'dark' : 'light'].boatColor }} />
                    </svg>
                  </div>

                  {/* Theme name */}
                  <div
                    className='absolute bottom-1 left-1 right-1 text-xs font-medium text-center'
                    style={{
                      color: themeConfig[isDarkMode ? 'dark' : 'light'].text,
                      fontFamily: '"Noto Sans Malayalam", sans-serif',
                      textShadow: `0 1px 2px ${themeConfig[isDarkMode ? 'dark' : 'light'].shadow}`,
                    }}
                  >
                    {themeConfig.name.split(' ')[0]}
                  </div>
                </button>
              ))}

              {/* Dark/Light Mode Toggle */}
              <div className='col-span-2 flex justify-center mt-3 pt-3 border-t border-opacity-30' style={{ borderColor: currentTheme.border }}>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className='flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 border'
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.accent}, ${currentTheme.primary})`,
                    color: currentTheme.text,
                    borderColor: currentTheme.border,
                    boxShadow: `0 4px 12px ${currentTheme.shadow}`,
                    fontFamily: '"Noto Sans Malayalam", sans-serif',
                    fontWeight: '500',
                  }}
                  title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                >
                  {isDarkMode ? (
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                      <circle cx='12' cy='12' r='4' />
                      <path d='M12 2v2M12 20v2M4.22 4.22l1.42 1.42M17.36 17.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M17.36 6.64l1.42-1.42' />
                    </svg>
                  ) : (
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
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
            className='absolute top-3 left-3 w-8 h-8 rounded-full shadow-lg border-2 border-white transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 z-30 flex items-center justify-center'
            style={{
              backgroundColor: '#DC2626',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
            }}
            title='Delete note'
          >
            <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
              <path d='M18 6L6 18M6 6l12 12' />
            </svg>
          </button>
        )}

        {/* Content Area */}
        <div
          className='relative z-10 h-full p-6 pt-16 pb-12'
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
              placeholder='എഴുതുക / Write your thoughts...'
              style={{
                fontFamily: '"Noto Sans Malayalam", "Segoe UI", sans-serif',
                fontSize: '16px',
                lineHeight: '1.6',
                color: currentTheme.text,
                background: 'transparent',
                fontWeight: '400',
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
                  fontFamily: '"Noto Sans Malayalam", "Segoe UI", sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: currentTheme.text,
                  fontWeight: '400',
                }}
              >
                {text || (
                  <span className='opacity-60 italic'>Click to add your thoughts...</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Kerala Resize Handle */}
        <div
          className='absolute bottom-2 right-2 w-8 h-8 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-20 rounded-full flex items-center justify-center'
          onMouseDown={(e) => handleResizeStart(e, 'se')}
          style={{
            background: `linear-gradient(135deg, ${currentTheme.accent}, ${currentTheme.primary})`,
            boxShadow: `0 4px 12px ${currentTheme.shadow}`,
          }}
        >
          <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
            <path d='M7 17L17 7M17 17H7V7' />
          </svg>
        </div>

        {/* Ripple effect */}
        {rippleEffect && (
          <div
            className='absolute inset-0 rounded-2xl pointer-events-none'
            style={{
              background: `radial-gradient(circle at center, ${currentTheme.waterColor}40 0%, transparent 70%)`,
              animation: 'ripple 0.6s ease-out',
            }}
          />
        )}

        {/* Traditional Kerala pattern overlay */}
        <div
          className='absolute inset-0 pointer-events-none opacity-5 rounded-2xl'
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, ${currentTheme.decorative} 2px, transparent 2px),
              radial-gradient(circle at 80% 80%, ${currentTheme.decorative} 1px, transparent 1px),
              radial-gradient(circle at 50% 50%, ${currentTheme.decorative} 1.5px, transparent 1.5px)
            `,
            backgroundSize: '40px 40px, 30px 30px, 35px 35px',
          }}
        />
      </div>

      {/* CSS Animations */}
      <style jsx>
        {`
        @keyframes ripple {
          0% { 
            transform: scale(0); 
            opacity: 1; 
          }
          100% { 
            transform: scale(4); 
            opacity: 0; 
          }
        }
        
        @keyframes wave {
          0%, 100% { 
            transform: translateX(0); 
          }
          50% { 
            transform: translateX(-10px); 
          }
        }
        
        @keyframes palmSway {
          0%, 100% { 
            transform: rotate(0deg); 
          }
          25% { 
            transform: rotate(5deg); 
          }
          75% { 
            transform: rotate(-5deg); 
          }
        }
        
        @keyframes keralaFloat {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-3px) rotate(0.5deg); 
          }
        }
      `}
      </style>
    </div>
  );
};

// Demo Component
const KeralaStickyNoteDemo = () => {
  const [notes, setNotes] = useState([
    {
      id: '1',
      text: 'केरल - God\'s Own Country 🌴\n\nഅല്ലെപ്പി backwaters\nകൊച്ചി spice markets\nമുന്നാര് tea gardens\nകോവളം beach\n\nNature\'s paradise awaits!',
      theme: 'backwater-green',
      size: 'medium',
    },
    {
      id: '2',
      text: 'Traditional Kerala Cuisine 🍛\n\nബിരിയാണി - Biryani\nഅപ്പം - Appam\nവെജിറ്റബിൾ സ്ട്യൂ - Vegetable Stew\nചായ - Chai\n\nSpices that tell stories!',
      theme: 'spice-gold',
      size: 'medium',
    },
    {
      id: '3',
      text: 'Ayurveda & Wellness 🧘‍♀️\n\nPanchakarma treatments\nHerbal medicine traditions\nYoga & meditation\nMassage therapies\n\nHealing body, mind & soul\nTraditional knowledge passed down through generations',
      theme: 'ayurveda-sage',
      size: 'large',
    },
    {
      id: '4',
      text: 'Festival Celebrations 🎭\n\nOnam - harvest festival\nKathakali performances\nPulikali (tiger dance)\nboat races\n\nColors, music & tradition!',
      theme: 'kathakali-purple',
      size: 'medium',
    },
  ]);

  const [globalDarkMode, setGlobalDarkMode] = useState(false);

  const addNote = useCallback(() => {
    const themes = ['backwater-green', 'coconut-brown', 'spice-gold', 'ayurveda-sage', 'temple-red', 'monsoon-blue', 'sunset-orange', 'kathakali-purple'];
    const sizes = ['small', 'medium', 'large'];

    const newNote = {
      id: `note-${Date.now()}`,
      text: 'New Kerala note...\n\nനിങ്ങളുടെ കാര്യങ്ങൾ ഇവിടെ എഴുതുക\nWrite your thoughts here',
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
          ? 'bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900'
          : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50'
        }
      `}
    >
      {/* Google Fonts Import */}
      <link
        href='https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@300;400;500;600;700&display=swap'
        rel='stylesheet'
      />

      {/* Coconut palm background pattern */}
      <div
        className='absolute inset-0 opacity-5 pointer-events-none'
        style={{
          backgroundImage: globalDarkMode
            ? 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M30 50 C25 40, 20 30, 30 20 C35 30, 35 40, 30 50Z\'/%3E%3C/g%3E%3C/svg%3E")'
            : 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23047857\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M30 50 C25 40, 20 30, 30 20 C35 30, 35 40, 30 50Z\'/%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating elements */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className='absolute opacity-10'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `keralaFloat ${4 + i * 0.5}s ease-in-out infinite ${i * 0.2}s`,
            }}
          >
            <svg width='40' height='40' viewBox='0 0 40 40'>
              <path
                d='M20 35 C15 25, 10 20, 20 15 C25 20, 25 25, 20 35Z'
                fill={globalDarkMode ? '#10B981' : '#047857'}
                opacity='0.3'
              />
              <circle cx='18' cy='18' r='2' fill={globalDarkMode ? '#F59E0B' : '#D97706'} opacity='0.5' />
              <circle cx='22' cy='20' r='2' fill={globalDarkMode ? '#F59E0B' : '#D97706'} opacity='0.5' />
            </svg>
          </div>
        ))}
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-16'>
          <h1
            className={`text-6xl font-bold mb-6 transition-colors duration-500 ${globalDarkMode ? 'text-emerald-200' : 'text-emerald-900'
              }`}
            style={{
              fontFamily: '"Noto Sans Malayalam", sans-serif',
              letterSpacing: '-0.025em',
              textShadow: globalDarkMode ? '0 0 20px rgba(16, 185, 129, 0.5)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            കേരളം Notes
          </h1>
          <p
            className={`mb-10 text-xl transition-colors duration-500 ${globalDarkMode ? 'text-emerald-300' : 'text-emerald-700'
              }`}
            style={{
              fontFamily: '"Noto Sans Malayalam", sans-serif',
            }}
          >
            🌴 Backwaters • 🏛️ Temples • 🎭 Culture • 🌿 Ayurveda
          </p>
          <div className='flex items-center justify-center gap-6'>
            <button
              onClick={addNote}
              className={`
                px-8 py-4 rounded-xl font-medium text-lg transform hover:scale-105 
                transition-all duration-300 shadow-lg hover:shadow-xl border-2
                ${globalDarkMode
                  ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-emerald-100 border-emerald-600 hover:from-emerald-600 hover:to-teal-600'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 hover:from-emerald-500 hover:to-teal-500'
                }
              `}
              style={{
                fontFamily: '"Noto Sans Malayalam", sans-serif',
                fontSize: '18px',
                fontWeight: '600',
                boxShadow: globalDarkMode
                  ? '0 8px 25px rgba(16, 185, 129, 0.4)'
                  : '0 8px 25px rgba(4, 120, 87, 0.3)',
              }}
            >
              🌴 Create Kerala Note
            </button>

            <button
              onClick={() => setGlobalDarkMode(!globalDarkMode)}
              className={`
                px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 border-2
                ${globalDarkMode
                  ? 'bg-gradient-to-r from-teal-700 to-cyan-700 text-teal-100 border-teal-600 hover:from-teal-600 hover:to-cyan-600'
                  : 'bg-gradient-to-r from-teal-200 to-cyan-200 text-teal-800 border-teal-400 hover:from-teal-100 hover:to-cyan-100'
                }
              `}
              style={{
                fontFamily: '"Noto Sans Malayalam", sans-serif',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: globalDarkMode
                  ? '0 4px 12px rgba(20, 184, 166, 0.4)'
                  : '0 4px 12px rgba(13, 148, 136, 0.3)',
              }}
            >
              {globalDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
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
              <KeralaStickyNote
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

export default KeralaStickyNoteDemo;