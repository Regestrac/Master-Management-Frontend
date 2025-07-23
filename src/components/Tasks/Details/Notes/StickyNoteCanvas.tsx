import React, { useState, useRef, useEffect } from 'react';

import StickyNote from './StickyNote';

const CanvasContainer = () => {
  const [notes, setNotes] = useState([
    { id: 1, x: 100, y: 100, width: 200, height: 150, text: 'Note 1' },
    { id: 2, x: 300, y: 300, width: 200, height: 150, text: 'Note 2' },
  ]);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom on Ctrl + Scroll
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      setScale((prev) => Math.max(0.2, Math.min(prev + delta, 3)));
    }
  };

  // Drag-to-pan
  useEffect(() => {
    let isDragging = false;
    let start = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0 || e.ctrlKey) { return; }
      isDragging = true;
      start = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) { return; }
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      start = { x: e.clientX, y: e.clientY };
      setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const el = containerRef.current;
    el?.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      el?.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const handleNoteChange = (id: number, newText: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text: newText } : n)),
    );
  };

  const handleNoteDrag = (id: number, newX: number, newY: number) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, x: newX, y: newY } : n)),
    );
  };

  const handleNoteResize = (id: number, newWidth: number, newHeight: number) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, width: newWidth, height: newHeight } : n)),
    );
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className='w-full h-full'
      style={{
        overflow: 'hidden',
        background: '#f0f0f0',
        position: 'relative',
        cursor: 'grab',
      }}
    >
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'top left',
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      >
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            id={note.id}
            x={note.x}
            y={note.y}
            width={note.width}
            height={note.height}
            text={note.text}
            onChange={handleNoteChange}
            onDragEnd={handleNoteDrag}
            onResize={handleNoteResize}
          />
        ))}
      </div>
    </div>
  );
};

export default CanvasContainer;
