import { useState } from 'react';

import clsx from 'clsx';
import { Edit, Plus, StickyNote, X } from 'lucide-react';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { useTaskStore } from 'stores/taskStore';
import { useSettingsStore } from 'stores/settingsStore';

import { createNote, deleteNote, updateNote } from 'services/note';

import Input from 'components/Shared/Input';

type StickyNoteFormType = {
  text: string;
  bg_color: string;
  text_color: string;
  id?: number;
};

const stickyNoteColors = [
  { id: 1, bg: '#FF9AA2', text: '#000000', name: 'Pink' },
  { id: 2, bg: '#FFE066', text: '#000000', name: 'Yellow' },
  { id: 3, bg: '#B5EAD7', text: '#000000', name: 'Mint' },
  { id: 4, bg: '#C7CEEA', text: '#000000', name: 'Lavender' },
  { id: 5, bg: '#FFDAC1', text: '#000000', name: 'Peach' },
  { id: 6, bg: '#E2F0CB', text: '#000000', name: 'Lime' },
  { id: 7, bg: '#F0C4C4', text: '#000000', name: 'Rose' },
  { id: 8, bg: '#D4E4F7', text: '#000000', name: 'Sky Blue' },
];

const StickyNotes = () => {
  const [showStickyNoteForm, setShowStickyNoteForm] = useState(false);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);
  const updateCurrentTaskDetails = useTaskStore((state) => state.updateCurrentTaskDetails);

  const { id } = useParams();

  const methods = useForm<StickyNoteFormType>({
    defaultValues: {
      text: '',
      bg_color: stickyNoteColors[0].bg,
      text_color: stickyNoteColors[0].text,
    },
  });

  const { handleSubmit, setValue, control, reset } = methods;

  const { bg_color } = useWatch({ control });

  const handleCancelNote = () => {
    setShowStickyNoteForm(false);
    reset({
      text: '',
      bg_color: stickyNoteColors[0].bg,
      text_color: stickyNoteColors[0].text,
    });
  };

  const addStickyNote = (formData: StickyNoteFormType) => {
    if (id && formData.text) {
      const payload = {
        task_id: Number(id),
        ...formData,
      };

      if (formData?.id) {
        updateNote(formData.id, payload).then((res) => {
          toast.success(res?.message);
          const finalNotesData = taskDetails.notes.map((item) => item.id === formData.id ? res?.data : item);
          updateCurrentTaskDetails({ notes: finalNotesData });
          handleCancelNote();
        }).catch((err) => {
          toast.error(err?.error);
        });
      } else {
        createNote(payload).then((res) => {
          toast.success(res?.message);
          updateCurrentTaskDetails({ notes: [...taskDetails.notes, res?.data] });
          handleCancelNote();
        }).catch((err) => {
          toast.error(err?.error);
        });
      }
    }
  };

  const handleEditNote = (noteId: number) => {
    const noteInfo = taskDetails.notes.find((item) => item.id === noteId);
    reset({
      id: noteId,
      bg_color: noteInfo?.bg_color,
      text: noteInfo?.text,
      text_color: noteInfo?.text_color,
    });
    setShowStickyNoteForm(true);
  };

  const removeStickyNote = (noteId: number) => {
    // TODO: Need to add confirmation
    deleteNote(noteId).then((res) => {
      toast.success(res?.message);
      updateCurrentTaskDetails({ notes: taskDetails.notes.filter((item) => item.id !== noteId) });
    }).catch((err) => {
      toast.error(err?.error);
    });
  };

  return (
    <div
      className={clsx(
        'rounded-xl border transition-colors',
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
      )}
    >
      <div className={clsx('p-6 border-b', darkMode ? 'border-gray-700' : 'border-gray-200')}>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold flex items-center'>
            <StickyNote className='w-5 h-5 mr-2' />
            Sticky Notes (
            {taskDetails.notes?.length || 0}
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
          <FormProvider {...methods}>
            <div className={clsx('mb-6 p-4 border rounded-lg', darkMode ? 'border-gray-600' : 'border-gray-300')}>
              <div className='space-y-4'>
                <Input
                  name='text'
                  label=''
                  type='textarea'
                  placeholder='Write your note here...'
                  className={clsx(
                    'w-full h-24 p-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-purple-500',
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300',
                  )}
                />

                {/* Color Picker */}
                <div className='flex items-center space-x-4'>
                  <span className={clsx('text-sm font-medium', darkMode ? 'text-gray-300' : 'text-gray-700')}>
                    Color:
                  </span>
                  <div className='flex space-x-2'>
                    {stickyNoteColors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setValue('bg_color', color.bg);
                          setValue('text_color', color.text);
                        }}
                        className={clsx(
                          'w-6 h-6 rounded-full transition-all cursor-pointer',
                          bg_color === color.bg ? 'border-2 border-neutral-500 outline-primary-500 outline-2' : 'border-none',
                        )}
                        style={{ backgroundColor: color.bg }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className='flex space-x-2'>
                  <button
                    onClick={handleSubmit(addStickyNote)}
                    className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
                  >
                    Add Note
                  </button>
                  <button
                    onClick={handleCancelNote}
                    className={clsx(
                      'px-4 py-2 rounded-lg border transition-colors',
                      darkMode
                        ? 'border-gray-600 hover:bg-gray-700'
                        : 'border-gray-300 hover:bg-gray-50',
                    )}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </FormProvider>
        )}

        {/* Sticky Notes Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {taskDetails.notes?.map((note) => (
            <div
              key={note?.id}
              className='relative p-4 rounded-lg shadow-md transform rotate-1 hover:rotate-0 transition-transform duration-200 group h-fit'
              style={{
                backgroundColor: note?.bg_color,
                color: note?.text_color,
                minHeight: '200px',
              }}
            >
              <button
                onClick={() => handleEditNote(note?.id)}
                className='absolute cursor-pointer top-2 right-10 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary-600'
              >
                <Edit className='w-3 h-3' />
              </button>
              <button
                onClick={() => removeStickyNote(note?.id)}
                className='absolute cursor-pointer top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600'
              >
                <X className='w-3 h-3' />
              </button>
              <p className='text-sm leading-relaxed mb-3 mt-4' style={{ color: note?.text_color }}>
                {note?.text}
              </p>
              <div className='text-xs opacity-70' style={{ color: note?.text_color }}>
                {dayjs(note?.created_at || new Date()).format('MMM DD, hh:mm A')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StickyNotes;