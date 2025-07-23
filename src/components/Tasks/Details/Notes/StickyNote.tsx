import React, { useRef, useEffect } from 'react';

type Props = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  onChange: (id: number, text: string) => void;
  onDragEnd: (id: number, x: number, y: number) => void;
  onResize: (id: number, width: number, height: number) => void;
};

const StickyNote: React.FC<Props> = ({
  id,
  x,
  y,
  width,
  height,
  text,
  onChange,
  onDragEnd,
  onResize,
}) => {
  const noteRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Dragging the header
  useEffect(() => {
    const el = noteRef.current;
    if (!el) { return; }

    let startX = 0,
      startY = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).classList.contains('header')) { return; }
      startX = e.clientX;
      startY = e.clientY;

      const onMove = (e: MouseEvent) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;
        onDragEnd(id, x + dx, y + dy);
      };

      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    };

    el.addEventListener('mousedown', onMouseDown);

    // eslint-disable-next-line consistent-return
    return () => {
      el.removeEventListener('mousedown', onMouseDown);
    };
  }, [x, y, id, onDragEnd]);

  // Resizing
  useEffect(() => {
    const el = resizeRef.current;
    if (!el) { return; }

    let startX = 0,
      startY = 0;

    const onMouseDown = (e: MouseEvent) => {
      e.stopPropagation();
      startX = e.clientX;
      startY = e.clientY;

      const onMove = (e: MouseEvent) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;
        onResize(id, width + dx, height + dy);
      };

      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    };

    el.addEventListener('mousedown', onMouseDown);

    // eslint-disable-next-line consistent-return
    return () => {
      el.removeEventListener('mousedown', onMouseDown);
    };
  }, [width, height, id, onResize]);

  return (
    <div
      ref={noteRef}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        background: '#fff8a6',
        border: '1px solid #ccc',
        borderRadius: 6,
        boxShadow: '2px 2px 6px rgba(0,0,0,0.2)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        fontSize: 14,
      }}
    >
      <div
        className='header'
        style={{
          background: '#ffeb3b',
          padding: '6px 8px',
          fontWeight: 'bold',
          borderBottom: '1px solid #ccc',
          cursor: 'grab',
        }}
      >
        Note
        {' '}
        {id}
      </div>
      <textarea
        value={text}
        onChange={(e) => onChange(id, e.target.value)}
        style={{
          width: '100%',
          height: 'calc(100% - 28px)',
          border: 'none',
          outline: 'none',
          resize: 'none',
          background: 'transparent',
          padding: 8,
          fontSize: '1em',
          fontFamily: 'sans-serif',
        }}
      />
      <div
        ref={resizeRef}
        style={{
          position: 'absolute',
          right: 4,
          bottom: 4,
          width: 10,
          height: 10,
          background: '#999',
          cursor: 'nwse-resize',
        }}
      />
    </div>
  );
};

export default StickyNote;
