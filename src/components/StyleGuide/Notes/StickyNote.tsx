import React, { useState, useRef, useEffect, JSX } from 'react';

import { createPortal } from 'react-dom';

// Hide scrollbar completely while keeping functionality
const scrollbarStyles = `
  .custom-scrollbar {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
    width: 0 !important;
    height: 0 !important;
  }
`;

// Type definitions
type NoteVariant = 'unruled' | 'ruled' | 'pinned' | 'spiral' | 'taped' | 'paperclip';

type DragType = 'right' | 'bottom' | 'bottom-right';

interface DragStart {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DropdownPosition {
  top: number;
  left: number;
}

interface Variant {
  key: NoteVariant;
  label: string;
  icon: string;
}

interface StickyNoteProps {
  children?: React.ReactNode;
  variant?: NoteVariant;
  backgroundColor?: string;
  textColor?: string;
  showActions?: boolean;
  onDelete?: () => void;
  onVariantChange?: (variant: NoteVariant) => void;
  onResize?: (width: number, height: number) => void;
  width?: string;
  height?: string;
  className?: string;
  content?: string;
  onContentChange?: (content: string) => void;
}

interface Note {
  id: number;
  content: string;
  variant: NoteVariant;
  backgroundColor: string;
  textColor: string;
  width: number;
  height: number;
}

interface NoteColor {
  bg: string;
  text: string;
}

const StickyNote: React.FC<StickyNoteProps> = ({
  children,
  variant = 'unruled',
  backgroundColor = '#fef3c7',
  textColor = '#374151',
  showActions = false,
  onDelete,
  onVariantChange,
  onResize,
  width = '200px',
  height = '200px',
  className = '',
  content = '',
  onContentChange,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showVariantMenu, setShowVariantMenu] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragType, setDragType] = useState<DragType | null>(null);
  const [dragStart, setDragStart] = useState<DragStart>({ x: 0, y: 0, width: 0, height: 0 });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>(content);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const variants: Variant[] = [
    { key: 'unruled', label: 'Plain', icon: '📄' },
    { key: 'ruled', label: 'Ruled', icon: '📝' },
    { key: 'pinned', label: 'Pinned', icon: '📌' },
    { key: 'spiral', label: 'Spiral', icon: '🗒️' },
    { key: 'taped', label: 'Taped', icon: '🎭' },
    { key: 'paperclip', label: 'Paperclip', icon: '📎' },
  ];

  const handleMouseDown = (e: React.MouseEvent, type: DragType): void => {
    e.preventDefault();
    e.stopPropagation();

    const startWidth = parseInt(width);
    const startHeight = parseInt(height);

    setIsDragging(true);
    setDragType(type);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      width: startWidth,
      height: startHeight,
    });
  };

  const handleMouseMove = React.useCallback((e: MouseEvent): void => {
    if (!isDragging || !onResize) { return; }

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    let newWidth = dragStart.width;
    let newHeight = dragStart.height;

    if (dragType === 'right' || dragType === 'bottom-right') {
      newWidth = Math.max(150, dragStart.width + deltaX);
    }
    if (dragType === 'bottom' || dragType === 'bottom-right') {
      newHeight = Math.max(150, dragStart.height + deltaY);
    }

    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      onResize(newWidth, newHeight);
    });
  }, [isDragging, dragStart, dragType, onResize]);

  const handleMouseUp = React.useCallback((): void => {
    setIsDragging(false);
    setDragType(null);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
    return undefined;
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (showVariantMenu && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowVariantMenu(false);
      }
    };

    if (showVariantMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [showVariantMenu]);

  React.useEffect(() => {
    setEditContent(content);
  }, [content]);

  React.useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleContentClick = (e: React.MouseEvent): void => {
    if (!isDragging && !isEditing) {
      e.stopPropagation();

      const clickX = e.clientX;
      const clickY = e.clientY;

      setIsEditing(true);

      setTimeout(() => {
        if (textareaRef.current) {
          const textarea = textareaRef.current;
          textarea.focus();

          const rect = textarea.getBoundingClientRect();
          const x = clickX - rect.left;
          const y = clickY - rect.top;

          // Check if caretPositionFromPoint is available
          const caretPositionFromPoint = (document as any).caretPositionFromPoint;
          if (caretPositionFromPoint) {
            const caretPosition = caretPositionFromPoint(clickX, clickY);
            if (caretPosition && caretPosition.offsetNode && caretPosition.offsetNode.nodeType === Node.TEXT_NODE) {
              const textNode = caretPosition.offsetNode as Text;
              const offset = caretPosition.offset;

              let position = 0;
              const walker = document.createTreeWalker(
                textarea.parentNode!,
                NodeFilter.SHOW_TEXT,
                null,
              );

              let currentNode: Node | null;

              while ((currentNode = walker.nextNode())) {
                if (currentNode === textNode) {
                  position += offset;
                  break;
                } else {
                  position += currentNode.textContent?.length || 0;
                }
              }

              textarea.setSelectionRange(position, position);
              return;
            }
          }

          const computedStyle = window.getComputedStyle(textarea);
          const lineHeight = parseInt(computedStyle.lineHeight);
          const fontSize = parseInt(computedStyle.fontSize);
          const actualLineHeight = lineHeight || fontSize * 1.2;

          const paddingTop = parseInt(computedStyle.paddingTop);
          const clickedLine = Math.floor((y - paddingTop) / actualLineHeight);

          const text = textarea.value;
          const lines = text.split('\n');

          let position = 0;

          for (let i = 0; i < clickedLine && i < lines.length; i++) {
            position += lines[i].length + 1;
          }

          if (clickedLine < lines.length) {
            const currentLine = lines[clickedLine];

            const measureSpan = document.createElement('span');
            measureSpan.style.position = 'absolute';
            measureSpan.style.visibility = 'hidden';
            measureSpan.style.font = computedStyle.font;
            measureSpan.style.fontSize = computedStyle.fontSize;
            measureSpan.style.fontFamily = computedStyle.fontFamily;
            measureSpan.style.whiteSpace = 'pre';
            document.body.appendChild(measureSpan);

            const paddingLeft = parseInt(computedStyle.paddingLeft);
            const targetX = x - paddingLeft;

            let charIndex = 0;
            let currentWidth = 0;

            for (let i = 0; i <= currentLine.length; i++) {
              measureSpan.textContent = currentLine.substring(0, i);
              const width = measureSpan.getBoundingClientRect().width;

              if (width > targetX) {
                const prevWidth = i > 0 ? currentWidth : 0;
                if (Math.abs(width - targetX) < Math.abs(prevWidth - targetX)) {
                  charIndex = i;
                } else {
                  charIndex = Math.max(0, i - 1);
                }
                break;
              }
              currentWidth = width;
              charIndex = i;
            }

            position += charIndex;
            document.body.removeChild(measureSpan);
          }

          position = Math.max(0, Math.min(position, text.length));
          textarea.setSelectionRange(position, position);
        }
      }, 10);
    }
  };

  const handleSaveEdit = (): void => {
    if (onContentChange) {
      onContentChange(editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = (): void => {
    setEditContent(content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const getVariantElements = (): JSX.Element | null => {
    switch (variant) {
      case 'ruled':
        return (
          <div className='absolute inset-0 pointer-events-none z-0'>
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className='absolute w-full h-px bg-blue-300 opacity-40'
                style={{ top: `${40 + (i * 18)}px` }}
              />
            ))}
          </div>
        );

      case 'pinned':
        return (
          <div className='absolute top-3 left-1/2 transform -translate-x-1/2 z-0 pointer-events-none'>
            <svg width='24' height='24' viewBox='0 0 24 24' className='drop-shadow-md'>
              <circle cx='12' cy='12' r='10' fill='#dc2626' stroke='#991b1b' strokeWidth='1' />
              <circle cx='12' cy='12' r='6' fill='#ef4444' />
              <circle cx='12' cy='12' r='2' fill='#7f1d1d' />
              <ellipse cx='12' cy='8' rx='3' ry='1' fill='#fca5a5' opacity='0.6' />
            </svg>
          </div>
        );

      case 'spiral':
        return (
          <div className='absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-gray-200 to-gray-100 border-b border-gray-300 z-10'>
            <div className='flex justify-center items-center h-full'>
              <svg width='100%' height='40' viewBox='0 0 200 40' className='absolute top-0'>
                {Array.from({ length: 12 }, (_, i) => (
                  <g key={i}>
                    <ellipse
                      cx={16 + (i * 16)}
                      cy='20'
                      rx='6'
                      ry='12'
                      fill='none'
                      stroke='#374151'
                      strokeWidth='2'
                    />
                    <ellipse
                      cx={16 + (i * 16)}
                      cy='20'
                      rx='3'
                      ry='8'
                      fill='none'
                      stroke='#6b7280'
                      strokeWidth='1'
                    />
                  </g>
                ))}
              </svg>
            </div>
          </div>
        );

      case 'taped':
        return (
          <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20'>
            <svg width='60' height='20' viewBox='0 0 60 20' className='drop-shadow-sm'>
              <rect x='0' y='0' width='60' height='20' fill='#e5e7eb' stroke='#d1d5db' strokeWidth='1' rx='2' />
              <rect x='2' y='2' width='56' height='16' fill='#f3f4f6' opacity='0.8' rx='1' />
              <line x1='0' y1='6' x2='60' y2='6' stroke='#d1d5db' strokeWidth='0.5' opacity='0.5' />
              <line x1='0' y1='14' x2='60' y2='14' stroke='#d1d5db' strokeWidth='0.5' opacity='0.5' />
            </svg>
          </div>
        );

      case 'paperclip':
        return (
          <div className='absolute top-0 left-4 transform -rotate-12 z-0 pointer-events-none'>
            <svg width='32' height='48' viewBox='0 0 32 48' className='drop-shadow-md'>
              <path
                d='M8 12 Q8 8 12 8 Q16 8 16 12 L16 32 Q16 40 24 40 Q32 40 32 32 L32 16 Q32 12 28 12 Q24 12 24 16 L24 28'
                fill='none'
                stroke='#dc2626'
                strokeWidth='3'
                strokeLinecap='round'
              />
              <path
                d='M8 12 Q8 8 12 8 Q16 8 16 12 L16 32 Q16 40 24 40 Q32 40 32 32 L32 16 Q32 12 28 12 Q24 12 24 16 L24 28'
                fill='none'
                stroke='#991b1b'
                strokeWidth='1'
                strokeLinecap='round'
              />
            </svg>
          </div>
        );

      default:
        return null;
    }
  };

  const getBentCornerStyle = (): React.CSSProperties => {
    return {
      clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 8px) calc(100% - 8px), calc(100% - 20px) 100%, 0 100%)',
      position: 'relative',
      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
    };
  };

  const getContentPadding = (): string => {
    switch (variant) {
      case 'spiral':
        return 'p-4 pt-12';
      case 'taped':
        return 'p-4 pt-6';
      case 'pinned':
        return 'p-4 pt-10'; // Extra top padding for pin
      case 'paperclip':
        return 'p-4 pt-12'; // Extra left padding for paperclip
      default:
        return 'p-4';
    }
  };

  const getNoteStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      backgroundColor,
      color: textColor,
      width: '100%',
      height: '100%',
      ...getBentCornerStyle(),
    };

    // const textureOverlay: React.CSSProperties = {
    //   backgroundImage: `
    //     radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
    //     radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
    //     linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.02) 100%)
    //   `,
    // };

    return { ...baseStyle };
  };

  const getActionButtonPosition = (): string => {
    return 'top-3 right-3';
  };

  const handleVariantClick = (e: React.MouseEvent, variantKey: NoteVariant): void => {
    e.stopPropagation();
    if (onVariantChange) {
      onVariantChange(variantKey);
    }
    setShowVariantMenu(false);
  };

  const handlePaletteClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (!showVariantMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 5,
        left: rect.right - 160, // Offset to align with button
      });
    }
    setShowVariantMenu(!showVariantMenu);
  };

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div
        className={`group ${className}`}
        style={{ width, height, overflow: 'visible' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main sticky note */}
        <div
          className='relative shadow-lg rounded-lg cursor-pointer'
          style={{ ...getNoteStyle(), overflow: 'visible' }}
        >
          {/* Variant-specific elements */}
          {getVariantElements()}

          {/* Realistic bent corner effect */}
          <div className='absolute -bottom-0 right-0 w-5 h-5 bg-black/25 bg-opacity-5' />

          {/* Content area */}
          <div className={`${getContentPadding()} h-full flex flex-col relative z-10`}>
            <div
              className='flex-1 custom-scrollbar relative'
              onClick={handleContentClick}
            >
              {isEditing ? (
                <textarea
                  ref={textareaRef}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className='w-full h-full resize-none bg-transparent border-none outline-none text-sm leading-relaxed font-medium custom-scrollbar'
                  style={{ color: textColor }}
                  placeholder='Click to edit...'
                />
              ) : (
                <div
                  className='whitespace-pre-line text-sm leading-relaxed font-medium cursor-text h-full'
                  style={{ color: textColor }}
                >
                  {children}
                </div>
              )}
            </div>

            {/* Edit action buttons */}
            {isEditing && (
              <div className='absolute top-2 right-2 flex gap-1 z-50'>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveEdit();
                  }}
                  className='w-7 h-7 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg border border-white'
                  title='Save Changes'
                >
                  <svg width='12' height='12' viewBox='0 0 24 24' fill='currentColor'>
                    <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelEdit();
                  }}
                  className='w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg border border-white'
                  title='Cancel Changes'
                >
                  <svg width='12' height='12' viewBox='0 0 24 24' fill='currentColor'>
                    <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Action buttons - positioned outside the main note */}
          {showActions && !isEditing && (
            <div
              className={`
                absolute ${getActionButtonPosition()} flex gap-2 transition-all duration-300 z-40
                ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
              `}
            >
              {/* Variant change button */}
              {onVariantChange && (
                <div className='relative'>
                  <button
                    ref={buttonRef}
                    onClick={handlePaletteClick}
                    className='w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xl border-2 border-white'
                    title='Change Style'
                  >
                    <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor'>
                      <path d='M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z' />
                    </svg>
                  </button>
                </div>
              )}

              {/* Delete button */}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className='w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xl border-2 border-white'
                  title='Delete Note'
                >
                  <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor'>
                    <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Drag resize handles - only show on hover and when actions are enabled */}
        {showActions && onResize && !isEditing && (
          <>
            {/* Right edge resize handle */}
            <div
              className='absolute top-0 right-0 w-3 h-full cursor-col-resize z-30 hover:bg-blue-200 hover:bg-opacity-30'
              onMouseDown={(e) => handleMouseDown(e, 'right')}
              title='Drag to resize width'
              style={{ marginRight: '-1px' }}
            />

            {/* Bottom edge resize handle */}
            <div
              className='absolute bottom-0 left-0 w-full h-3 cursor-row-resize z-30 hover:bg-blue-200 hover:bg-opacity-30'
              onMouseDown={(e) => handleMouseDown(e, 'bottom')}
              title='Drag to resize height'
              style={{ marginBottom: '-1px' }}
            />

            {/* Bottom-right corner resize handle */}
            <div
              className='absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize z-30 hover:bg-blue-300 hover:bg-opacity-50'
              onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
              title='Drag to resize both dimensions'
              style={{ marginBottom: '-1px', marginRight: '-1px' }}
            />
          </>
        )}

        {/* Variant dropdown - rendered as portal */}
        {showVariantMenu && typeof document !== 'undefined' && createPortal(
          <div
            className='bg-white rounded-xl shadow-2xl border border-gray-200 p-3 min-w-40'
            style={{
              position: 'fixed',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              zIndex: 99999,
            }}
          >
            {variants.map((v) => (
              <button
                key={v.key}
                onClick={(e) => handleVariantClick(e, v.key)}
                className={`
                  w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors duration-150 flex items-center gap-2
                  ${variant === v.key ? 'bg-orange-100 text-orange-700' : 'text-gray-700'}
                `}
              >
                <span className='text-base'>{v.icon}</span>
                <span>{v.label}</span>
              </button>
            ))}
          </div>,
          document.body,
        )}
      </div>
    </>
  );
};

// Main Demo Component
const StickyNoteDemo: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      content: '✨ Welcome to Sticky Notes!\n\nClick anywhere on this note to edit it inline...\n\nTry different styles with the palette button!',
      variant: 'unruled',
      backgroundColor: '#fef3c7',
      textColor: '#374151',
      width: 240,
      height: 240,
    },
    {
      id: 2,
      content: '📝 Meeting Notes\n\n• Review project timeline\n• Discuss budget allocation\n• Plan next sprint\n• Team feedback session',
      variant: 'ruled',
      backgroundColor: '#dbeafe',
      textColor: '#1e40af',
      width: 240,
      height: 240,
    },
    {
      id: 3,
      content: '🎯 Goals for Today\n\n✓ Complete design mockups\n✓ Review code changes\n□ Update documentation\n□ Test new features',
      variant: 'pinned',
      backgroundColor: '#dcfce7',
      textColor: '#166534',
      width: 240,
      height: 240,
    },
    {
      id: 4,
      content: '💡 Brainstorming Ideas\n\n• Improve user onboarding\n• Add dark mode support\n• Enhance mobile experience\n• Integration with third-party tools',
      variant: 'spiral',
      backgroundColor: '#f3e8ff',
      textColor: '#581c87',
      width: 240,
      height: 240,
    },
    {
      id: 5,
      content: "⚡ Quick Reminder\n\nDon't forget to:\n- Submit timesheet\n- Review pull request\n- Call client at 3 PM\n- Backup important files",
      variant: 'taped',
      backgroundColor: '#fce7f3',
      textColor: '#7c2d12',
      width: 240,
      height: 240,
    },
    {
      id: 6,
      content: '📎 Important Links\n\n• Project repository\n• Design system guide\n• API documentation\n• Team calendar\n• Slack workspace',
      variant: 'paperclip',
      backgroundColor: '#fed7d7',
      textColor: '#742a2a',
      width: 240,
      height: 240,
    },
  ]);

  const handleContentChange = (id: number, newContent: string): void => {
    setNotes((prev) => prev.map((note) =>
      note.id === id ? { ...note, content: newContent } : note,
    ));
  };

  const handleDelete = (id: number): void => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes((prev) => prev.filter((note) => note.id !== id));
    }
  };

  const handleVariantChange = (id: number, newVariant: NoteVariant): void => {
    setNotes((prev) => prev.map((note) =>
      note.id === id ? { ...note, variant: newVariant } : note,
    ));
  };

  const handleResize = (id: number, newWidth: number, newHeight: number): void => {
    setNotes((prev) => prev.map((note) =>
      note.id === id ? { ...note, width: newWidth, height: newHeight } : note,
    ));
  };

  const noteColors: NoteColor[] = [
    { bg: '#fef3c7', text: '#374151' }, // Yellow
    { bg: '#dbeafe', text: '#1e40af' }, // Blue
    { bg: '#dcfce7', text: '#166534' }, // Green
    { bg: '#f3e8ff', text: '#581c87' }, // Purple
    { bg: '#fce7f3', text: '#7c2d12' }, // Pink
    { bg: '#fed7d7', text: '#742a2a' }, // Light red
    { bg: '#e6fffa', text: '#2d3748' }, // Mint
  ];

  const handleAddNote = (): void => {
    const randomColor = noteColors[Math.floor(Math.random() * noteColors.length)];
    const newNote: Note = {
      id: Date.now(),
      content: '✨ New Note\n\nClick anywhere on this note to edit it inline...\n\nUse the palette button to change styles!\n\nDrag from edges to resize!',
      variant: 'unruled',
      backgroundColor: randomColor.bg,
      textColor: randomColor.text,
      width: 240,
      height: 240,
    };
    setNotes((prev) => [...prev, newNote]);
  };

  return (
    <div className='p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>
            ✨ Interactive Sticky Notes
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Click anywhere on a note to edit it inline • Use the palette icon to change styles •
            Drag from edges to resize • Experience natural paper-like textures and authentic attachments
          </p>
        </div>

        {/* Notes Grid */}
        <div className='flex flex-wrap gap-8 justify-center'>
          {notes.map((note) => (
            <StickyNote
              key={note.id}
              variant={note.variant}
              backgroundColor={note.backgroundColor}
              textColor={note.textColor}
              showActions={true}
              content={note.content}
              onContentChange={(newContent) => handleContentChange(note.id, newContent)}
              onDelete={() => handleDelete(note.id)}
              onVariantChange={(variant) => handleVariantChange(note.id, variant)}
              onResize={(newWidth, newHeight) => handleResize(note.id, newWidth, newHeight)}
              className='transform transition-all duration-300'
              width={`${note.width}px`}
              height={`${note.height}px`}
            >
              {note.content}
            </StickyNote>
          ))}
        </div>

        {/* Add New Note Button */}
        <div className='flex justify-center mt-12'>
          <button
            onClick={handleAddNote}
            className='group px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-3'
          >
            <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor' className='group-hover:rotate-90 transition-transform duration-300'>
              <path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' />
            </svg>
            Add New Note
          </button>
        </div>

        {/* Instructions */}
        <div className='mt-12 text-center'>
          <div className='inline-flex items-center gap-6 bg-white rounded-2xl px-8 py-4 shadow-lg flex-wrap justify-center'>
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center'>
                <svg width='12' height='12' viewBox='0 0 24 24' fill='white'>
                  <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' />
                </svg>
              </div>
              <span className='text-sm text-gray-600'>Click to Edit</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center'>
                <svg width='12' height='12' viewBox='0 0 24 24' fill='white'>
                  <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' />
                </svg>
              </div>
              <span className='text-sm text-gray-600'>Save/Cancel</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center'>
                <svg width='12' height='12' viewBox='0 0 24 24' fill='white'>
                  <path d='M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z' />
                </svg>
              </div>
              <span className='text-sm text-gray-600'>Change Style</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center'>
                <svg width='12' height='12' viewBox='0 0 24 24' fill='white'>
                  <path d='M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z' />
                </svg>
              </div>
              <span className='text-sm text-gray-600'>Drag to Resize</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 bg-red-500 rounded-full flex items-center justify-center'>
                <svg width='12' height='12' viewBox='0 0 24 24' fill='white'>
                  <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' />
                </svg>
              </div>
              <span className='text-sm text-gray-600'>Delete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyNoteDemo;