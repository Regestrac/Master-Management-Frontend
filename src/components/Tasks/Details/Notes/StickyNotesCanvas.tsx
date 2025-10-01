import React, { useState, useRef, useEffect, useCallback } from 'react';

import { Plus, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

import { StickyNoteDataType } from 'helpers/sharedTypes';
import { omit } from 'helpers/utils';

import { useSettingsStore } from 'stores/settingsStore';

import { createNote, deleteNote, getAllNotes, updateNote } from 'services/note';

import StickyNote from 'components/Tasks/Details/Notes/StickyNote';

const StickyNotesCanvas = () => {
  const [notes, setNotes] = useState<StickyNoteDataType[]>([]);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [_lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const { id } = useParams();

  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldFetchNotesRef = useRef(true);

  // Generate unique ID for new notes
  const generateId = () => `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Handle zoom with Ctrl+Scroll
  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newScale = Math.max(0.1, Math.min(3, scale + delta));
      setScale(newScale);
    }
  }, [scale]);

  // Handle Ctrl+Click to add new note
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.ctrlKey && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      // Convert screen coordinates to canvas coordinates, accounting for current pan & scale
      const x = (e.clientX - rect.left - pan.x) / scale;
      const y = (e.clientY - rect.top - pan.y) / scale;
      const newNote: StickyNoteDataType = {
        id: generateId(),
        x: x - 75, // Center the note on click (allow negative for panned view)
        y: y - 50,
        width: 150,
        height: 100,
        content: '',
        bgColor: '#fef3c7', // Default yellow
        textColor: '#000000',
        borderColor: '#f59e0b',
      };

      setNotes((prev) => [...prev, newNote]);
    }
  }, [scale, pan]);

  // Handle panning with middle mouse button or space+drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) { // Middle mouse or Shift+Left mouse
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      const newPan = {
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      };
      setPan(newPan);
    }
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Set up event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
    }

    if (isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('wheel', handleWheel);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleWheel, handleMouseMove, handleMouseUp, isPanning]);

  // Update note
  const handleUpdateNote = useCallback((id: string, updates: Partial<StickyNoteDataType>) => {
    setNotes((prev) => prev.map((note) =>
      note.id === id ? { ...note, ...updates } : note,
    ));
  }, []);

  // Delete note
  const handleDeleteNote = useCallback((id: string) => {
    if (typeof id === 'string' && id.includes('note_')) {
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } else {
      deleteNote(Number(id)).then((res) => {
        setNotes((prev) => prev.filter((note) => note.id !== id));
        toast.success(res?.message || 'Deleted successfully');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to delete note');
      });
    }
  }, []);

  // Reset view
  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  // Zoom controls
  const zoomIn = () => setScale((prev) => Math.min(3, prev + 0.1));
  const zoomOut = () => setScale((prev) => Math.max(0.1, prev - 0.1));

  // Add sample note for demonstration
  const addSampleNote = () => {
    const newNote: StickyNoteDataType = {
      id: generateId(),
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: 150,
      height: 100,
      content: 'Sample note\nDouble-click to edit!',
      bgColor: '#fce7f3', // Pink
      textColor: '#000000',
      borderColor: '#ec4899',
    };
    setNotes((prev) => [...prev, newNote]);
  };

  const handleTextareaBlur = (noteData: StickyNoteDataType) => {
    const payload = {
      task_id: Number(id),
      ...omit(noteData, ['bgColor', 'textColor', 'borderColor', 'id']),
      bg_color: noteData.bgColor,
      text_color: noteData.textColor,
      border_color: noteData.borderColor,
    };
    if (typeof noteData.id === 'string' && noteData.id.includes('note_')) {
      createNote(payload).then((res) => {
        toast.success(res?.message || 'Created successfully');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to create note');
      });
    } else {
      updateNote(Number(noteData.id), payload).then((res) => {
        toast.success(res?.message || 'Updated successfully');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to update note');
      });
    }
  };

  useEffect(() => {
    if (id && shouldFetchNotesRef.current) {
      getAllNotes(id).then((res) => {
        setNotes(res.data.map((note: any) => ({
          id: note.id,
          x: note.x,
          y: note.y,
          width: note.width,
          height: note.height,
          content: note.content,
          bgColor: note.bg_color,
          textColor: note.text_color,
          borderColor: note.border_color,
          variant: note.variant,
          createdAt: note.created_at,
        })));
      }).catch((err) => {
        toast.error(err?.error || 'Failed to get notes');
      });
      shouldFetchNotesRef.current = false;
    }
  }, [id]);

  return (
    <div className='relative w-full h-full overflow-hidden' ref={containerRef}>
      {/* Toolbar */}
      <div className={`absolute top-4 left-4 z-10 flex items-center space-x-2 p-2 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} border`}>
        <button
          onClick={addSampleNote}
          className={`p-2 rounded transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          title='Add Sample Note'
        >
          <Plus className='w-4 h-4' />
        </button>

        <div className={`w-px h-6 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />

        <button
          onClick={zoomOut}
          className={`p-2 rounded transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          title='Zoom Out'
        >
          <ZoomOut className='w-4 h-4' />
        </button>

        <span className={`text-sm px-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {Math.round(scale * 100)}
          %
        </span>
        <button
          onClick={zoomIn}
          className={`p-2 rounded transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          title='Zoom In'
        >
          <ZoomIn className='w-4 h-4' />
        </button>

        <div className={`w-px h-6 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />

        <button
          onClick={resetView}
          className={`p-2 rounded transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          title='Reset View'
        >
          <RotateCcw className='w-4 h-4' />
        </button>
      </div>

      {/* Instructions */}
      <div className={`absolute top-4 right-4 z-10 p-3 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-white border-gray-200 text-gray-600'} border text-sm max-w-xs`}>
        <div className='space-y-1'>
          <div>
            <strong>Ctrl + Click:</strong>
            {' '}
            Add note
          </div>
          <div>
            <strong>Ctrl + Scroll:</strong>
            {' '}
            Zoom
          </div>
          <div>
            <strong>Shift + Drag:</strong>
            {' '}
            Pan canvas
          </div>
          <div>
            <strong>Double-click:</strong>
            {' '}
            Edit note
          </div>
          <div>
            <strong>Drag edges:</strong>
            {' '}
            Resize note
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={`w-full h-full relative ${isPanning ? 'cursor-grabbing' : 'cursor-crosshair'} ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        style={{
          backgroundImage: darkMode
            ? 'radial-gradient(circle, #374151 1px, transparent 1px)'
            : 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
          backgroundSize: `${20 * scale}px ${20 * scale}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      >
        {/* Transform container for notes */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: '0 0',
          }}
        >
          {notes.map((note) => (
            <StickyNote
              key={note.id}
              note={note}
              onUpdate={handleUpdateNote}
              onDelete={handleDeleteNote}
              scale={scale}
              isDarkMode={darkMode}
              onBlur={handleTextareaBlur}
            />
          ))}
        </div>

        {/* Empty state */}
        {notes.length === 0 && (
          <div className={`absolute inset-0 flex items-center justify-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <div className='text-center'>
              <div className='text-lg mb-2'>No sticky notes yet</div>
              <div className='text-sm'>Ctrl + Click anywhere to add your first note</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyNotesCanvas;
