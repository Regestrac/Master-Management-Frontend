import React, { useState } from 'react';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Draggable from 'react-draggable';

type StickyNote = {
  id: number;
  x: number;
  y: number;
  content: string;
};

const StickyNote = React.forwardRef<HTMLDivElement, any>((props, ref) => (
  <div
    ref={ref}
    {...props}
    className='absolute w-48 h-48 bg-yellow-200 p-4 rounded shadow cursor-move'
  >
    <textarea
      className='w-full h-full resize-none bg-transparent outline-none'
      defaultValue={props.content}
    />
  </div>
));

export default function StickyNoteCanvasDiv() {
  const [notes, setNotes] = useState<StickyNote[]>([]);

  const addNote = () => {
    setNotes((prev) => [
      ...prev,
      {
        id: notes.length + 1,
        x: 100,
        y: 100,
        content: 'New Note',
      },
    ]);
  };

  const updateNotePosition = (id: number, x: number, y: number) => {
    setNotes((prev) =>
      prev.map((note) => (note?.id === id ? { ...note, x, y } : note)),
    );
  };

  return (
    <>
      <button
        onClick={addNote}
        className='z-50 px-4 py-2 bg-red-600 text-white rounded shadow'
      >
        Add Sticky Note
      </button>
      <div className='w-full h-full overflow-hidden'>

        <TransformWrapper
          initialScale={1}
          minScale={0.2}
          maxScale={4}
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: true }}
        >
          <TransformComponent
            wrapperClass='w-full h-screen'
            contentClass='relative w-[4000px] h-[4000px] bg-white'
          >
            {notes.map((note) => (
              <Draggable
                key={note?.id}
                defaultPosition={{ x: note?.x, y: note?.y }}
                onStop={(_, data) => updateNotePosition(note?.id, data.x, data.y)}
              >
                <StickyNote content={note.content} />
              </Draggable>
            ))}
          </TransformComponent>
        </TransformWrapper>
      </div>
    </>
  );
}
