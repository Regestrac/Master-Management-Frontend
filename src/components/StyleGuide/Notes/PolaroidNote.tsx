import { useState, useRef, useEffect, useCallback } from 'react';

const PolaroidStickyNote = ({
  id = `polaroid-note-${Date.now()}`,
  initialText = '',
  theme = 'vintage-white',
  backgroundImage = null,
  size = 'medium',
  initialWidth,
  initialHeight,
  onTextChange,
  onResize,
  onThemeChange,
  onBackgroundChange,
  onDelete,
  className = '',
  editable = true,
}) => {
  // Size presets
  const sizePresets = {
    small: { width: 260, height: 320 },
    medium: { width: 320, height: 400 },
    large: { width: 380, height: 480 },
  };

  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [backgroundImg, setBackgroundImg] = useState(backgroundImage);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

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
  const stylePickerRef = useRef(null);
  const fileInputRef = useRef(null);
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
  });

  // Polaroid theme configurations
  const themes = {
    'vintage-white': {
      name: 'Vintage White',
      light: {
        border: '#E5E7EB',
        shadow: 'rgba(0, 0, 0, 0.15)',
        text: '#374151',
        textBg: 'rgba(255, 255, 255, 0.95)',
        accent: '#6B7280',
      },
      dark: {
        border: '#4B5563',
        shadow: 'rgba(0, 0, 0, 0.4)',
        text: '#F3F4F6',
        textBg: 'rgba(17, 24, 39, 0.95)',
        accent: '#9CA3AF',
      },
    },
    'sepia-brown': {
      name: 'Sepia Brown',
      light: {
        border: '#D2B48C',
        shadow: 'rgba(139, 69, 19, 0.2)',
        text: '#8B4513',
        textBg: 'rgba(250, 235, 215, 0.95)',
        accent: '#CD853F',
      },
      dark: {
        border: '#8B4513',
        shadow: 'rgba(139, 69, 19, 0.4)',
        text: '#F5DEB3',
        textBg: 'rgba(59, 30, 15, 0.95)',
        accent: '#D2B48C',
      },
    },
    'retro-blue': {
      name: 'Retro Blue',
      light: {
        border: '#BFDBFE',
        shadow: 'rgba(59, 130, 246, 0.2)',
        text: '#1E40AF',
        textBg: 'rgba(239, 246, 255, 0.95)',
        accent: '#3B82F6',
      },
      dark: {
        border: '#1E40AF',
        shadow: 'rgba(59, 130, 246, 0.4)',
        text: '#DBEAFE',
        textBg: 'rgba(30, 58, 138, 0.95)',
        accent: '#60A5FA',
      },
    },
    'pastel-pink': {
      name: 'Pastel Pink',
      light: {
        border: '#FBCFE8',
        shadow: 'rgba(236, 72, 153, 0.2)',
        text: '#BE185D',
        textBg: 'rgba(253, 242, 248, 0.95)',
        accent: '#EC4899',
      },
      dark: {
        border: '#BE185D',
        shadow: 'rgba(236, 72, 153, 0.4)',
        text: '#FCE7F3',
        textBg: 'rgba(157, 23, 77, 0.95)',
        accent: '#F472B6',
      },
    },
    'forest-green': {
      name: 'Forest Green',
      light: {
        border: '#BBF7D0',
        shadow: 'rgba(34, 197, 94, 0.2)',
        text: '#15803D',
        textBg: 'rgba(240, 253, 244, 0.95)',
        accent: '#22C55E',
      },
      dark: {
        border: '#15803D',
        shadow: 'rgba(34, 197, 94, 0.4)',
        text: '#DCFCE7',
        textBg: 'rgba(21, 128, 61, 0.95)',
        accent: '#4ADE80',
      },
    },
    'sunset-orange': {
      name: 'Sunset Orange',
      light: {
        border: '#FED7AA',
        shadow: 'rgba(249, 115, 22, 0.2)',
        text: '#C2410C',
        textBg: 'rgba(255, 247, 237, 0.95)',
        accent: '#F97316',
      },
      dark: {
        border: '#C2410C',
        shadow: 'rgba(249, 115, 22, 0.4)',
        text: '#FED7AA',
        textBg: 'rgba(154, 52, 18, 0.95)',
        accent: '#FB923C',
      },
    },
  };

  // Predefined background images (using placeholder URLs)
  const backgroundImages = [
    {
      id: 'nature-1',
      name: 'Mountain Vista',
      url: 'keys/mountain-vista?prompt=Beautiful%20mountain%20landscape%20with%20snow%20peaks%20and%20blue%20sky%2C%20serene%20nature%20photography',
      category: 'nature',
    },
    {
      id: 'nature-2',
      name: 'Ocean Waves',
      url: 'keys/ocean-waves?prompt=Calm%20ocean%20waves%20on%20sandy%20beach%2C%20turquoise%20water%2C%20peaceful%20seascape',
      category: 'nature',
    },
    {
      id: 'nature-3',
      name: 'Forest Path',
      url: 'keys/forest-path?prompt=Sunlit%20forest%20path%20through%20tall%20trees%2C%20dappled%20light%2C%20peaceful%20woodland',
      category: 'nature',
    },
    {
      id: 'urban-1',
      name: 'City Skyline',
      url: 'keys/city-skyline?prompt=Modern%20city%20skyline%20at%20sunset%2C%20glass%20buildings%2C%20urban%20architecture',
      category: 'urban',
    },
    {
      id: 'urban-2',
      name: 'Coffee Shop',
      url: 'keys/coffee-shop?prompt=Cozy%20coffee%20shop%20interior%2C%20warm%20lighting%2C%20books%20and%20vintage%20furniture',
      category: 'urban',
    },
    {
      id: 'abstract-1',
      name: 'Watercolor',
      url: 'keys/watercolor-abstract?prompt=Soft%20watercolor%20abstract%20pattern%2C%20pastel%20colors%2C%20flowing%20organic%20shapes',
      category: 'abstract',
    },
    {
      id: 'abstract-2',
      name: 'Geometric',
      url: 'keys/geometric-pattern?prompt=Modern%20geometric%20pattern%2C%20minimal%20shapes%2C%20clean%20design%2C%20soft%20colors',
      category: 'abstract',
    },
    {
      id: 'vintage-1',
      name: 'Old Map',
      url: 'keys/vintage-map?prompt=Vintage%20world%20map%20with%20aged%20paper%20texture%2C%20sepia%20tones%2C%20antique%20style',
      category: 'vintage',
    },
  ];

  const currentTheme = themes[selectedTheme][isDarkMode ? 'dark' : 'light'];

  // Trigger flash effect
  const triggerFlashEffect = useCallback(() => {
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 200);
  }, []);

  // Trigger shake effect
  const triggerShakeEffect = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
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
    tempSpan.style.fontFamily = '"Indie Flower", cursive';
    tempSpan.style.lineHeight = '1.5';
    tempSpan.style.whiteSpace = 'pre-wrap';
    tempSpan.style.padding = '12px';
    tempSpan.style.width = `${dimensions.width - 40}px`;

    document.body.appendChild(tempSpan);

    const textContent = text || '';
    let bestPosition = 0;
    let minDistance = Infinity;

    for (let i = 0; i <= textContent.length; i++) {
      const testText = textContent.substring(0, i);
      tempSpan.textContent = testText;

      const spanRect = tempSpan.getBoundingClientRect();
      const endX = spanRect.width - 12;
      const endY = spanRect.height - 12;

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
      triggerFlashEffect();
    }
  }, [isDragging, resizeState.isResizing, editable, calculateCursorPosition, triggerFlashEffect]);

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

      // Maintain aspect ratio for polaroid
      const aspectRatio = 1.25; // 4:5 ratio typical for polaroids
      newWidth = Math.max(220, Math.min(500, newWidth));
      newHeight = newWidth * aspectRatio;

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
    triggerFlashEffect();
  }, [onThemeChange, triggerFlashEffect]);

  // Background change handler
  const handleBackgroundChange = useCallback((newBackground) => {
    setBackgroundImg(newBackground);
    onBackgroundChange?.(newBackground);
    triggerShakeEffect();
  }, [onBackgroundChange, triggerShakeEffect]);

  // Custom image upload
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        handleBackgroundChange({
          id: 'custom',
          name: 'Custom Image',
          url: imageUrl,
          category: 'custom',
        });
      };
      reader.readAsDataURL(file);
    }
  }, [handleBackgroundChange]);

  // Handle click outside style picker
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (stylePickerRef.current && !stylePickerRef.current.contains(e.target)) {
        setShowStylePicker(false);
      }
    };

    if (showStylePicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showStylePicker]);

  // Polaroid photo dimensions
  const photoHeight = dimensions.height * 0.7; // 70% for photo area
  const borderHeight = dimensions.height * 0.3; // 30% for bottom border

  // Note styles with polaroid effects
  const noteStyles = {
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    transform: `translate(${position.x}px, ${position.y}px) ${isDragging ? 'scale(1.05) rotate(2deg)' :
      isHovered ? 'scale(1.02) rotate(0.5deg)' :
        'rotate(0deg)'
      }${isShaking ? ' translateX(2px)' : ''}`,
    transition: isDragging || resizeState.isResizing ? 'none' : isShaking ? 'transform 0.1s ease-in-out' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: isDragging || resizeState.isResizing ? 1000 : showStylePicker ? 900 : 'auto',
    backgroundColor: '#FFFFFF',
    boxShadow: `
      0 8px 25px -5px ${currentTheme.shadow},
      0 4px 10px -2px ${currentTheme.shadow},
      inset 0 1px 0 rgba(255, 255, 255, 0.15)
    `,
    border: `8px solid ${isDarkMode ? '#1F2937' : '#FFFFFF'}`,
    borderRadius: '4px',
    filter: flashEffect ? 'brightness(1.5) contrast(1.2)' : 'none',
  };

  return (
    <div className='relative inline-block'>
      {/* Google Fonts Import */}
      <link
        href='https://fonts.googleapis.com/css2?family=Indie+Flower:wght@400&family=Kalam:wght@300;400;700&display=swap'
        rel='stylesheet'
      />

      {/* Polaroid Sticky Note */}
      <div
        ref={noteRef}
        className='relative cursor-move select-none group'
        style={noteStyles}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Photo Area */}
        <div
          className='relative overflow-hidden'
          style={{
            height: `${photoHeight}px`,
            backgroundColor: backgroundImg ? 'transparent' : (isDarkMode ? '#374151' : '#F3F4F6'),
          }}
        >
          {/* Background Image */}
          {backgroundImg && (
            <div
              className='absolute inset-0 bg-cover bg-center'
              style={{
                backgroundImage: `url('${backgroundImg.url}')`,
                filter: isDarkMode ? 'brightness(0.7) contrast(1.1)' : 'brightness(1) contrast(1)',
              }}
            />
          )}

          {/* Gradient overlay for better text readability */}
          {backgroundImg && (
            <div
              className='absolute inset-0'
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)',
              }}
            />
          )}

          {/* Polaroid vintage effect overlay */}
          <div
            className='absolute inset-0 opacity-20 pointer-events-none'
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6) 0%, transparent 50%),
                radial-gradient(circle at 70% 70%, rgba(0, 0, 0, 0.1) 0%, transparent 40%)
              `,
            }}
          />

          {/* No background placeholder */}
          {!backgroundImg && (
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <svg width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1'>
                  <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
                  <circle cx='8.5' cy='8.5' r='1.5' />
                  <path d='M21 15l-5-5L5 21' />
                </svg>
                <p className='mt-2 text-xs font-medium'>Add Photo</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Border/Text Area */}
        <div
          className='relative flex flex-col'
          style={{
            height: `${borderHeight}px`,
            backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
            padding: '12px 16px 16px 16px',
          }}
        >
          {/* Style picker button */}
          <div
            ref={stylePickerRef}
            className='absolute top-2 right-2 z-30'
          >
            <button
              onClick={() => setShowStylePicker(!showStylePicker)}
              className='w-7 h-7 rounded-full shadow-md border-2 border-white transition-all duration-200 hover:scale-110 flex items-center justify-center'
              style={{
                backgroundColor: currentTheme.accent,
                boxShadow: `0 2px 6px ${currentTheme.shadow}`,
              }}
              title='Change style & background'
            >
              <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
                <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
              </svg>
            </button>

            {/* Style Picker Dropdown */}
            {showStylePicker && (
              <div
                className='absolute top-9 right-0 p-4 rounded-lg border-2 z-50 min-w-80'
                style={{
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                  borderColor: currentTheme.border,
                  boxShadow: `0 12px 24px ${currentTheme.shadow}`,
                }}
              >
                {/* Theme Section */}
                <div className='mb-4'>
                  <h4 className='text-sm font-semibold mb-2' style={{ color: currentTheme.text }}>Frame Style</h4>
                  <div className='grid grid-cols-3 gap-2'>
                    {Object.entries(themes).map(([themeKey, themeConfig]) => (
                      <button
                        key={themeKey}
                        onClick={() => handleThemeChange(themeKey)}
                        className={`
                          w-16 h-12 rounded border-2 transition-all duration-200 
                          hover:scale-105 relative overflow-hidden
                          ${selectedTheme === themeKey ? 'ring-2 ring-offset-1' : ''}
                        `}
                        style={{
                          backgroundColor: themeConfig[isDarkMode ? 'dark' : 'light'].textBg,
                          borderColor: themeConfig[isDarkMode ? 'dark' : 'light'].border,
                          ringColor: selectedTheme === themeKey ? themeConfig[isDarkMode ? 'dark' : 'light'].accent : 'transparent',
                        }}
                        title={themeConfig.name}
                      >
                        <div
                          className='absolute bottom-1 left-1 right-1 h-2 rounded-sm'
                          style={{ backgroundColor: themeConfig[isDarkMode ? 'dark' : 'light'].accent }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Section */}
                <div className='mb-4'>
                  <h4 className='text-sm font-semibold mb-2' style={{ color: currentTheme.text }}>Background</h4>
                  <div className='grid grid-cols-4 gap-2 mb-3'>
                    {/* No background option */}
                    <button
                      onClick={() => handleBackgroundChange(null)}
                      className={`
                        w-16 h-12 rounded border-2 transition-all duration-200 
                        hover:scale-105 flex items-center justify-center
                        ${!backgroundImg ? 'ring-2 ring-offset-1' : ''}
                      `}
                      style={{
                        backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                        borderColor: currentTheme.border,
                        ringColor: !backgroundImg ? currentTheme.accent : 'transparent',
                      }}
                      title='No Background'
                    >
                      <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke={currentTheme.text} strokeWidth='2'>
                        <line x1='18' y1='6' x2='6' y2='18' />
                        <line x1='6' y1='6' x2='18' y2='18' />
                      </svg>
                    </button>

                    {backgroundImages.slice(0, 7).map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => handleBackgroundChange(bg)}
                        className={`
                          w-16 h-12 rounded border-2 transition-all duration-200 
                          hover:scale-105 bg-cover bg-center
                          ${backgroundImg?.id === bg.id ? 'ring-2 ring-offset-1' : ''}
                        `}
                        style={{
                          backgroundImage: `url('${bg.url}')`,
                          borderColor: currentTheme.border,
                          ringColor: backgroundImg?.id === bg.id ? currentTheme.accent : 'transparent',
                        }}
                        title={bg.name}
                      />
                    ))}
                  </div>

                  {/* Custom upload button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className='w-full py-2 px-3 rounded border-2 border-dashed transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2'
                    style={{
                      borderColor: currentTheme.accent,
                      color: currentTheme.accent,
                    }}
                  >
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                      <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                      <polyline points='7,10 12,15 17,10' />
                      <line x1='12' y1='15' x2='12' y2='3' />
                    </svg>
                    <span className='text-xs font-medium'>Upload Image</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    className='hidden'
                  />
                </div>

                {/* Dark/Light Mode Toggle */}
                <div className='flex justify-center pt-3 border-t' style={{ borderColor: currentTheme.border }}>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className='flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105'
                    style={{
                      backgroundColor: currentTheme.accent + '20',
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
              className='absolute top-2 left-2 w-6 h-6 rounded-full shadow-md border-2 border-white transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 z-30 flex items-center justify-center'
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

          {/* Text Content */}
          <div
            className='flex-1 relative'
            style={{
              backgroundColor: currentTheme.textBg,
              borderRadius: '4px',
              marginTop: '8px',
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
                className='w-full h-full resize-none border-none outline-none bg-transparent placeholder-opacity-60 p-3'
                placeholder='Add a caption...'
                style={{
                  fontFamily: '"Indie Flower", cursive',
                  fontSize: '16px',
                  lineHeight: '1.5',
                  color: currentTheme.text,
                  background: 'transparent',
                }}
              />
            ) : (
              <div
                ref={textDisplayRef}
                className='w-full h-full overflow-hidden cursor-text p-3'
              >
                <p
                  className='whitespace-pre-wrap break-words'
                  style={{
                    fontFamily: '"Indie Flower", cursive',
                    fontSize: '16px',
                    lineHeight: '1.5',
                    color: currentTheme.text,
                  }}
                >
                  {text || (
                    <span className='opacity-60 italic'>Click to add caption...</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Polaroid Resize Handle */}
        <div
          className='absolute bottom-2 right-2 w-6 h-6 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-20 rounded flex items-center justify-center'
          onMouseDown={(e) => handleResizeStart(e, 'se')}
          style={{
            backgroundColor: currentTheme.accent,
            boxShadow: `0 2px 4px ${currentTheme.shadow}`,
          }}
        >
          <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
            <path d='M7 17L17 7M17 17H7V7' />
          </svg>
        </div>

        {/* Flash effect overlay */}
        {flashEffect && (
          <div
            className='absolute inset-0 pointer-events-none rounded'
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              animation: 'flash 0.2s ease-out',
            }}
          />
        )}

        {/* Vintage aging effect */}
        <div
          className='absolute inset-0 pointer-events-none opacity-10 rounded'
          style={{
            background: `
              radial-gradient(circle at 10% 10%, rgba(139, 69, 19, 0.1) 0%, transparent 20%),
              radial-gradient(circle at 90% 90%, rgba(139, 69, 19, 0.1) 0%, transparent 20%),
              radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.05) 0%, transparent 60%)
            `,
          }}
        />
      </div>

      {/* CSS Animations */}
      <style jsx>
        {`
        @keyframes flash {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        @keyframes polaroidFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(0.5deg); }
        }
      `}
      </style>
    </div>
  );
};

// Demo Component
const PolaroidStickyNoteDemo = () => {
  const [notes, setNotes] = useState([
    {
      id: '1',
      text: 'Mountain Adventure 🏔️\n\nWhat an incredible view from the summit! The fresh air and endless horizon made every step worth it.',
      theme: 'vintage-white',
      backgroundImage: {
        id: 'nature-1',
        name: 'Mountain Vista',
        url: 'keys/mountain-vista?prompt=Beautiful%20mountain%20landscape%20with%20snow%20peaks%20and%20blue%20sky%2C%20serene%20nature%20photography',
        category: 'nature',
      },
      size: 'medium',
    },
    {
      id: '2',
      text: 'Afternoon Coffee ☕\n\nPerfect blend, perfect moment. Sometimes the simple pleasures are the most meaningful.',
      theme: 'sepia-brown',
      backgroundImage: {
        id: 'urban-2',
        name: 'Coffee Shop',
        url: 'keys/coffee-shop?prompt=Cozy%20coffee%20shop%20interior%2C%20warm%20lighting%2C%20books%20and%20vintage%20furniture',
        category: 'urban',
      },
      size: 'medium',
    },
    {
      id: '3',
      text: 'Ocean Therapy 🌊\n\nThe sound of waves washing away all worries. Nature\'s best meditation session.',
      theme: 'retro-blue',
      backgroundImage: {
        id: 'nature-2',
        name: 'Ocean Waves',
        url: 'keys/ocean-waves?prompt=Calm%20ocean%20waves%20on%20sandy%20beach%2C%20turquoise%20water%2C%20peaceful%20seascape',
        category: 'nature',
      },
      size: 'medium',
    },
    {
      id: '4',
      text: 'Creative Inspiration ✨\n\nWhen colors flow like dreams and imagination takes the lead.',
      theme: 'pastel-pink',
      backgroundImage: {
        id: 'abstract-1',
        name: 'Watercolor',
        url: 'keys/watercolor-abstract?prompt=Soft%20watercolor%20abstract%20pattern%2C%20pastel%20colors%2C%20flowing%20organic%20shapes',
        category: 'abstract',
      },
      size: 'medium',
    },
  ]);

  const [globalDarkMode, setGlobalDarkMode] = useState(false);

  const addNote = useCallback(() => {
    const themes = ['vintage-white', 'sepia-brown', 'retro-blue', 'pastel-pink', 'forest-green', 'sunset-orange'];
    const sizes = ['small', 'medium', 'large'];

    const newNote = {
      id: `note-${Date.now()}`,
      text: 'New Memory 📸\n\nCapture the moment...',
      theme: themes[Math.floor(Math.random() * themes.length)],
      backgroundImage: null,
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
        min-h-screen p-8 relative overflow-scroll transition-all duration-500
        ${globalDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900'
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
        }
      `}
    >
      {/* Google Fonts Import */}
      <link
        href='https://fonts.googleapis.com/css2?family=Indie+Flower:wght@400&family=Kalam:wght@300;400;700&display=swap'
        rel='stylesheet'
      />

      {/* Subtle background pattern */}
      <div
        className='absolute inset-0 opacity-20 pointer-events-none'
        style={{
          backgroundImage: globalDarkMode
            ? `
              radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `
            : `
              radial-gradient(circle at 25% 25%, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
            `,
          backgroundSize: '50px 50px, 80px 80px',
        }}
      />

      {/* Floating polaroid elements */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`absolute opacity-5 ${globalDarkMode ? 'bg-white' : 'bg-gray-700'
              }`}
            style={{
              width: `${80 + i * 20}px`,
              height: `${100 + i * 25}px`,
              top: `${5 + i * 25}%`,
              left: `${85 + i * 3}%`,
              transform: `rotate(${5 + i * 5}deg)`,
              borderRadius: '4px',
              animation: `polaroidFloat ${6 + i}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-16'>
          <h1
            className={`text-6xl font-bold mb-6 transition-colors duration-500 ${globalDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            style={{
              fontFamily: '"Kalam", cursive',
              letterSpacing: '-0.025em',
            }}
          >
            Polaroid Memories
          </h1>
          <p
            className={`mb-10 text-xl transition-colors duration-500 ${globalDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            style={{ fontFamily: '"Indie Flower", cursive' }}
          >
            Instant • Nostalgic • Authentic • Customizable
          </p>
          <div className='flex items-center justify-center gap-6'>
            <button
              onClick={addNote}
              className={`
                px-8 py-4 rounded-lg font-medium text-lg transform hover:scale-105 
                transition-all duration-300 shadow-lg hover:shadow-xl
                ${globalDarkMode
                  ? 'bg-blue-600 text-blue-100 hover:bg-blue-500'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                }
              `}
              style={{
                fontFamily: '"Kalam", cursive',
                fontSize: '20px',
                fontWeight: '600',
              }}
            >
              📸 Create Polaroid
            </button>

            <button
              onClick={() => setGlobalDarkMode(!globalDarkMode)}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105
                ${globalDarkMode
                  ? 'bg-gray-600 text-gray-100 hover:bg-gray-500'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }
              `}
              style={{
                fontFamily: '"Kalam", cursive',
                fontSize: '18px',
                fontWeight: '600',
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
                left: `${(index % 3) * 360 + Math.random() * 100}px`,
                top: `${Math.floor(index / 3) * 460 + Math.random() * 100}px`,
              }}
            >
              <PolaroidStickyNote
                id={note.id}
                initialText={note.text}
                theme={note.theme}
                backgroundImage={note.backgroundImage}
                size={note.size}
                onTextChange={(text) => updateNote(note.id, { text })}
                onThemeChange={(theme) => updateNote(note.id, { theme })}
                onBackgroundChange={(backgroundImage) => updateNote(note.id, { backgroundImage })}
                onDelete={() => deleteNote(note.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PolaroidStickyNoteDemo;