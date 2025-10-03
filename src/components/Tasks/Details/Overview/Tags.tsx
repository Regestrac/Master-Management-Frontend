import { useCallback, useMemo, useRef, useState } from 'react';

import { Plus, Tag, X, Check } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

import { useTaskStore } from 'stores/taskStore';
import { useSettingsStore } from 'stores/settingsStore';

import { updateTask } from 'services/tasks';

import GenerateTagsButton from 'components/Tasks/ai/GenerateTagsButton';
import Outline from 'components/Shared/Outline';

const Tags = () => {
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const taskDetails = useTaskStore((s) => s.currentTaskDetails);
  const updateTaskDetails = useTaskStore((s) => s.updateCurrentTaskDetails);

  const tags = useMemo(() => taskDetails?.tags || [], [taskDetails?.tags]);

  const inputRef = useRef<HTMLInputElement>(null);

  const { id } = useParams();

  const focusInput = () => setTimeout(() => inputRef.current?.focus(), 0);

  const normalise = (tag: string) => tag.trim().toLowerCase();

  const saveTags = useCallback((type: 'add' | 'remove') => {
    if (id && taskDetails?.tags?.length > 0) {
      updateTask(id, { tags: taskDetails?.tags }).then(() => {
        toast.success(`Tag ${type === 'add' ? 'added' : 'removed'}`);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to update tags!');
      });
    };
  }, [id, taskDetails?.tags]);

  const addTag = (newTag: string) => {
    const trimmed = normalise(newTag);
    if (!trimmed) { return; }
    if (tags?.some((t) => normalise(t) === trimmed)) {
      setError('Tag already exists');
      return;
    }
    const updatedTags = [...tags, newTag.trim()];
    updateTaskDetails({ ...taskDetails, tags: updatedTags });
    saveTags('add');
    setInput('');
    focusInput();
    setError('');
  };

  const removeTag = (tagToRemove: string) => {
    updateTaskDetails({ ...taskDetails, tags: tags?.filter((t) => t !== tagToRemove) });
    saveTags('remove');
  };

  const startAdding = () => {
    setAdding(true);
    setError('');
    focusInput();
  };

  const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Escape') {
      setAdding(false);
      setInput('');
      setError('');
    }
  };

  const handleInputBlur = () => {
    if (!input.trim()) {
      setAdding(false);
      setInput('');
      setError('');
    }
  };

  return (
    <div className={clsx('rounded-xl border transition-all', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
      {/* Header */}
      <div className={clsx('p-6 border-b', darkMode ? 'border-gray-700' : 'border-gray-200')}>
        <div className='flex items-center justify-between'>
          <h3 className={clsx('text-lg font-semibold flex items-center', darkMode ? 'text-white' : 'text-gray-900')}>
            <Tag className='w-5 h-5 mr-2' />
            Tags
          </h3>
          <div className='flex items-center gap-3'>
            <GenerateTagsButton generatedTags={generatedTags} setGeneratedTags={setGeneratedTags} />
            <span className={clsx('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>
              {tags?.length}
              {' '}
              tag
              {tags?.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className='p-6 space-y-4 min-h-56'>
        {/* --- Empty state ---------------------------------------------------- */}
        {tags?.length === 0 && generatedTags.length === 0 && !adding && (
          <div className='flex flex-col items-center gap-4 pt-8 pb-2'>
            <Tag className='w-8 h-8 opacity-50' />
            <p className={clsx('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>No tags yet. Add your first tag to get started.</p>
          </div>
        )}
        {/* --- Pending AI generated tags -------------------------------------- */}
        {generatedTags.length > 0 && (
          <Outline colors={['bg-primary', 'bg-primary-500']} width='2px' variant='rotate'>
            <div className='flex flex-wrap gap-2 p-3 rounded-2xl'>
              {generatedTags.map((tag) => (
                <span
                  key={`generated-${tag}`}
                  className={clsx(
                    'group inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                    darkMode
                      ? 'bg-gradient-to-r from-primary-900/40 to-blue-900/40 text-primary-300 border border-primary-700/50 hover:border-primary-600'
                      : 'bg-gradient-to-r from-primary-50 to-blue-50 text-primary-700 border border-primary-200 hover:border-primary-300',
                  )}
                >
                  #
                  {tag}
                </span>
              ))}
            </div>
          </Outline>
        )}

        {/* --- Existing tags --------------------------------------------------- */}
        {tags?.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {tags?.map((tag) => (
              <span
                key={tag}
                className={clsx(
                  'group inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                  darkMode
                    ? 'bg-gradient-to-r from-primary-900/40 to-blue-900/40 text-primary-300 border border-primary-700/50 hover:border-primary-600'
                    : 'bg-gradient-to-r from-primary-50 to-blue-50 text-primary-700 border border-primary-200 hover:border-primary-300',
                )}
              >
                #
                {tag}
                <button
                  type='button'
                  onClick={() => removeTag(tag)}
                  className={clsx(
                    'ml-1.5 p-0.5 rounded-full opacity-60 hover:opacity-100 transition-all hover:scale-110',
                    darkMode ? 'hover:bg-red-900/50 text-red-400' : 'hover:bg-red-100 text-red-600',
                  )}
                >
                  <X className='w-3 h-3' />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* --- Add tag flow ---------------------------------------------------- */}
        {adding ? (
          <div className='relative w-fit'>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError('');
              }}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKey}
              placeholder='Enter tag'
              maxLength={24}
              className={clsx(
                'pl-3 pr-10 py-1.5 min-w-[120px] rounded-full text-sm font-medium outline-none border-2 border-dashed',
                error
                  ? darkMode
                    ? 'border-red-600 bg-red-900/20 text-red-400 placeholder-red-500'
                    : 'border-red-400 bg-red-50 text-red-700 placeholder-red-400'
                  : darkMode
                    ? 'border-primary-600 bg-gray-800 text-primary-300 placeholder-gray-500 focus:border-primary-500'
                    : 'border-primary-400 bg-white text-primary-700 placeholder-gray-400 focus:border-primary-500',
              )}
            />
            <button
              type='button'
              disabled={!input.trim()}
              onClick={() => addTag(input)}
              className={clsx(
                'absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-transform hover:scale-110',
                darkMode ? 'text-green-400 hover:bg-green-900/30' : 'text-green-600 hover:bg-green-100',
              )}
            >
              <Check className='w-4 h-4' />
            </button>
            {error && (
              <p className={clsx('absolute top-full mt-1 text-xs', darkMode ? 'text-red-300' : 'text-red-600')}>{error}</p>
            )}
          </div>
        ) : (
          <div className='flex justify-center'>
            <button
              type='button'
              onClick={startAdding}
              className={clsx(
                'inline-flex items-center px-3 py-1.5 border-2 border-dashed rounded-full text-sm font-medium transition-all hover:scale-105',
                darkMode
                  ? 'border-gray-600 text-gray-400 hover:border-primary-500 hover:text-primary-400 hover:bg-primary-900/20'
                  : 'border-gray-300 text-gray-500 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50',
              )}
            >
              <Plus className='w-3 h-3 mr-1' />
              Add tag
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tags;