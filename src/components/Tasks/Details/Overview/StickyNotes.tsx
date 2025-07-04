import { useState } from 'react';

import { Plus, StickyNote, X } from 'lucide-react';
import { useProfileStore } from 'stores/profileStore';
import { useTaskStore } from 'stores/taskStore';
import dayjs from 'dayjs';

const stickyNoteColors = [
  { bg: '#FFE066', text: '#000000', name: 'Yellow' },
  { bg: '#FF9AA2', text: '#000000', name: 'Pink' },
  { bg: '#B5EAD7', text: '#000000', name: 'Mint' },
  { bg: '#C7CEEA', text: '#000000', name: 'Lavender' },
  { bg: '#FFDAC1', text: '#000000', name: 'Peach' },
  { bg: '#E2F0CB', text: '#000000', name: 'Lime' },
  { bg: '#F0C4C4', text: '#000000', name: 'Rose' },
  { bg: '#D4E4F7', text: '#000000', name: 'Sky Blue' },
];

const StickyNotes = () => {
  const [showStickyNoteForm, setShowStickyNoteForm] = useState(false);
  const [stickyNoteData, setStickyNoteData] = useState({} as any);

  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);

  const addStickyNote = () => {

  };

  const removeStickyNote = (_noteId: number) => {

  };

  return (
    <div className={`rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold flex items-center'>
            <StickyNote className='w-5 h-5 mr-2' />
            Sticky Notes (
            {taskDetails.stickyNotes?.length}
            )
          </h3>
          <button
            onClick={() => setShowStickyNoteForm(!showStickyNoteForm)}
            className='flex items-center space-x-2 px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
          >
            <Plus className='w-4 h-4' />
            <span className='text-sm'>Add Note</span>
          </button>
        </div>
      </div>
      <div className='p-6'>
        {/* Add Sticky Note Form */}
        {showStickyNoteForm && (
          <div className='mb-6 p-4 border rounded-lg border-gray-300 dark:border-gray-600'>
            <div className='space-y-4'>
              <textarea
                value={stickyNoteData.text}
                onChange={(e) => setStickyNoteData((prev: any) => ({ ...prev, text: e.target.value }))}
                placeholder='Write your note here...'
                className={`w-full h-24 p-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'}`}
              />

              {/* Color Picker */}
              <div className='flex items-center space-x-4'>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Color:
                </span>
                <div className='flex space-x-2'>
                  {stickyNoteColors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setStickyNoteData((prev: any) => ({
                        ...prev,
                        bg_color: color.bg,
                        text_color: color.text,
                      }))}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${stickyNoteData.bgColor === color.bg
                        ? 'border-gray-800 scale-110'
                        : 'border-gray-300'}`}
                      style={{ backgroundColor: color.bg }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className='flex space-x-2'>
                <button
                  onClick={addStickyNote}
                  className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
                >
                  Add Note
                </button>
                <button
                  onClick={() => {
                    setShowStickyNoteForm(false);
                    setStickyNoteData({ text: '', bgColor: '#FFE066', textColor: '#000000' });
                  }}
                  className={`px-4 py-2 rounded-lg border transition-colors ${darkMode
                    ? 'border-gray-600 hover:bg-gray-700'
                    : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sticky Notes Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {taskDetails.stickyNotes?.map((note) => (
            <div
              key={note.id}
              className='relative p-4 rounded-lg shadow-md transform rotate-1 hover:rotate-0 transition-transform duration-200 group'
              style={{
                backgroundColor: note.bg_color,
                color: note.text_color,
                minHeight: '120px',
              }}
            >
              <button
                onClick={() => removeStickyNote(note.id)}
                className='absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600'
              >
                <X className='w-3 h-3' />
              </button>
              <p className='text-sm leading-relaxed mb-3' style={{ color: note.text_color }}>
                {note.text}
              </p>
              <div className='text-xs opacity-70' style={{ color: note.text_color }}>
                {dayjs(note.created_at || new Date()).format('MMM DD, hh:mm A')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StickyNotes;