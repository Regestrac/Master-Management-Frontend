// hooks/useDraggableNote.ts
import { useCallback, useEffect, useRef, useState } from 'react';

export function useDraggableNote(
  x: number,
  y: number,
  scale: number,
  offsetX: number,
  offsetY: number,
  onDragEnd: (_newX: number, _newY: number) => void,
) {
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);

      const mouseX = (e.clientX - offsetX) / scale;
      const mouseY = (e.clientY - offsetY) / scale;

      dragOffset.current = {
        x: mouseX - x,
        y: mouseY - y,
      };
    },
    [x, y, scale, offsetX, offsetY],
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) { return; }

      const mouseX = (e.clientX - offsetX) / scale;
      const mouseY = (e.clientY - offsetY) / scale;

      const newX = mouseX - dragOffset.current.x;
      const newY = mouseY - dragOffset.current.y;

      onDragEnd(newX, newY);
    },
    [isDragging, offsetX, offsetY, scale, onDragEnd],
  );

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  return {
    onMouseDown,
  };
}
