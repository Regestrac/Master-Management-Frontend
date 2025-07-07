import { useState } from 'react';

import { AlignLeft, Bold, Edit3, Italic, Link2, List, Save, Type, Underline } from 'lucide-react';
import { useProfileStore } from 'stores/profileStore';
import { useTaskStore } from 'stores/taskStore';

const TaskNotes = () => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);

  const [editData, setEditData] = useState({
    description: taskDetails.description,
    notes: taskDetails.stickyNotes,
  });

  const saveNotes = () => {
    setIsEditingNotes(false);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  // Simple HTML editor functions
  const execCommand = (command: any, value: any = null) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className={`rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold flex items-center'>
            <Edit3 className='w-5 h-5 mr-2' />
            Notes
          </h3>
          <button
            onClick={() => {
              if (isEditingNotes) {
                saveNotes();
              } else {
                setIsEditingNotes(true);
                setEditData((prev) => ({ ...prev, notes: taskDetails.stickyNotes }));
              }
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isEditingNotes
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
          >
            {isEditingNotes ? <Save className='w-4 h-4' /> : <Edit3 className='w-4 h-4' />}
            <span>{isEditingNotes ? 'Save' : 'Edit'}</span>
          </button>
        </div>
      </div>
      <div className='p-6'>
        {isEditingNotes ? (
          <div className='space-y-4'>
            {/* HTML Editor Toolbar */}
            <div className={`flex items-center space-x-2 p-3 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
              <button
                onClick={() => execCommand('bold')}
                className={`p-2 rounded transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                title='Bold'
              >
                <Bold className='w-4 h-4' />
              </button>
              <button
                onClick={() => execCommand('italic')}
                className={`p-2 rounded transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                title='Italic'
              >
                <Italic className='w-4 h-4' />
              </button>
              <button
                onClick={() => execCommand('underline')}
                className={`p-2 rounded transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                title='Underline'
              >
                <Underline className='w-4 h-4' />
              </button>

              <div className={`w-px h-6 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />

              <button
                onClick={() => execCommand('insertUnorderedList')}
                className={`p-2 rounded transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                title='Bullet List'
              >
                <List className='w-4 h-4' />
              </button>
              <button
                onClick={() => execCommand('insertOrderedList')}
                className={`p-2 rounded transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                title='Numbered List'
              >
                <Type className='w-4 h-4' />
              </button>

              <div className={`w-px h-6 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />

              <button
                onClick={insertLink}
                className={`p-2 rounded transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                title='Insert Link'
              >
                <Link2 className='w-4 h-4' />
              </button>
              <button
                onClick={() => execCommand('formatBlock', 'blockquote')}
                className={`p-2 rounded transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                title='Quote'
              >
                <AlignLeft className='w-4 h-4' />
              </button>
            </div>

            {/* Content Editable Area */}
            <div
              contentEditable
              dangerouslySetInnerHTML={{ __html: editData.notes }}
              onInput={(e) => setEditData((prev) => ({ ...prev, notes: (e.target as any).innerHTML }))}
              className={`min-h-64 p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300'}`}
              style={{
                maxHeight: '500px',
                overflowY: 'auto',
              }}
            />

            <div className='flex space-x-2'>
              <button
                onClick={saveNotes}
                className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
              >
                Save Notes
              </button>
              <button
                onClick={() => {
                  setIsEditingNotes(false);
                  setEditData((prev) => ({ ...prev, notes: taskDetails.stickyNotes }));
                }}
                className={`px-4 py-2 rounded-lg border transition-colors ${darkMode
                  ? 'border-gray-600 hover:bg-gray-700'
                  : 'border-gray-300 hover:bg-gray-50'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}
            dangerouslySetInnerHTML={{ __html: taskDetails.stickyNotes }}
          />
        )}
      </div>
    </div>
  );
};

export default TaskNotes;