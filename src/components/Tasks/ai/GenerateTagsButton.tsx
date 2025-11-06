import { Dispatch, SetStateAction, useState } from 'react';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import clsx from 'clsx';

import { AI_BUTTON_STYLE } from 'helpers/configs';
import { parseMarkdownJson } from 'helpers/utils';

import { useTaskStore } from 'stores/taskStore';

import { generateTags, updateTask } from 'services/tasks';

import FadingCircles from 'icons/FadingCircles';

type GenerateTagsButtonProps = {
  generatedTags: string[];
  setGeneratedTags: Dispatch<SetStateAction<string[]>>;
}

/**
 * GenerateTagsButton
 *
 * Button group for AI-generating tag suggestions. Mirrors the UX pattern of
 * the other AI buttons (Checklist, Subtasks, Description).
 */
const GenerateTagsButton = ({ generatedTags, setGeneratedTags }: GenerateTagsButtonProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();

  const taskDetails = useTaskStore((state) => state.currentTaskDetails);
  const updateTaskDetails = useTaskStore((state) => state.updateCurrentTaskDetails);

  const handleGenerateTags = () => {
    if (!id) { return; }

    const payload = {
      title: taskDetails?.title,
      existing_tags: taskDetails?.tags || [],
      description: taskDetails?.description,
      checklists: (taskDetails?.checklists || []).map((item) => item.title),
    };
    setIsLoading(true);
    generateTags(id, payload).then((res) => {
      try {
        setGeneratedTags(JSON.parse(res.tags).tags);
      } catch {
        setGeneratedTags(parseMarkdownJson(res.tags).tags);
      }
      setShowConfirmation(true);
      toast.success(res?.message || 'Tags generated');
    }).catch((err) => {
      toast.error(err?.error || 'Failed to generate tags');
    }).finally(() => setIsLoading(false));
  };

  const handleAcceptGeneration = () => {
    if (!id || generatedTags.length === 0) { return; }

    const payload = {
      tags: [
        ...new Set([
          ...(taskDetails?.tags || []),
          ...generatedTags,
        ]),
      ],
    };

    updateTask(id, payload).then(() => {
      updateTaskDetails({ tags: payload.tags });
      toast.success('Tags saved');
      setGeneratedTags([]);
      setShowConfirmation(false);
    }).catch((err) => {
      toast.error(err?.error || 'Failed to save tags');
    });
  };

  const handleRejectGeneration = () => {
    setGeneratedTags([]);
    setShowConfirmation(false);
  };

  return (
    <div className='flex gap-2'>
      {showConfirmation ? (
        <>
          <button
            type='button'
            onClick={handleAcceptGeneration}
            className={clsx(
              'px-2 py-1 text-xs text-primary-50 rounded transition-colors duration-200 cursor-pointer',
              AI_BUTTON_STYLE,
            )}
          >
            Accept
          </button>
          <button
            type='button'
            onClick={handleRejectGeneration}
            className='px-2 py-1 text-xs outline-1 text-primary-50 rounded hover:outline-1 hover:bg-neutral-300/20 transition-colors duration-200 cursor-pointer'
          >
            Close
          </button>
        </>
      ) : (
        <button
          type='button'
          onClick={handleGenerateTags}
          disabled={isLoading}
          className={clsx(
            'px-2 py-1 text-xs text-primary-50 rounded transition-colors duration-200',
            AI_BUTTON_STYLE,
            isLoading ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          Generate ✨
          {isLoading ? <FadingCircles radius={2} /> : null}
        </button>
      )}
    </div>
  );
};

export default GenerateTagsButton;
