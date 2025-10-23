import { Dispatch, SetStateAction, useState } from 'react';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import clsx from 'clsx';

import { parseMarkdownJson } from 'helpers/utils';
import { AI_BUTTON_STYLE } from 'helpers/configs';

import { useTaskStore } from 'stores/taskStore';

import { generateChecklist, saveChecklists } from 'services/checklist';

import FadingCircles from 'icons/FadingCircles';

type GeneratedChecklistType = {
  id: number;
  title: string;
};

type GenerateChecklistPropsType = {
  generatedChecklist: GeneratedChecklistType[];
  setGeneratedChecklist: Dispatch<SetStateAction<GeneratedChecklistType[]>>;
}

/**
 * GenerateChecklistButton
 *
 * Renders an "AI Generate" button for creating suggested checklist items. After
 * generation, the component shows Accept / Close actions to either save the
 * generated checklist to the backend or discard it. Pattern follows the other
 * generators inside `src/components/Tasks/ai`.
 */
const GenerateChecklistButton = ({ generatedChecklist, setGeneratedChecklist }: GenerateChecklistPropsType) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const taskDetails = useTaskStore((state) => state.currentTaskDetails);
  const updateTaskDetails = useTaskStore((state) => state.updateCurrentTaskDetails);

  const { id } = useParams();

  const handleGenerateChecklist = () => {
    const payload = {
      title: taskDetails?.title,
      existing: taskDetails?.checklists || [],
      description: taskDetails?.description,
    };
    if (!id) { return; }
    setIsLoading(true);
    generateChecklist(id, payload).then((res) => {
      setGeneratedChecklist(parseMarkdownJson(res.data).checklists);
      setShowConfirmation(true);
      toast.success(res?.message || 'Checklist generated');
    }).catch((err) => {
      toast.error(err?.error || 'Failed to generate checklist');
    }).finally(() => {
      setIsLoading(false);
    });
  };

  const handleAcceptGeneration = () => {
    if (!id || generatedChecklist.length === 0) { return; }
    const payload = generatedChecklist.map((c) => ({ title: c.title, task_id: Number(id) }));
    saveChecklists(payload).then((res) => {
      toast.success(res?.message || 'Checklist saved');
      setGeneratedChecklist([]);
      updateTaskDetails({ ...taskDetails, checklists: [...taskDetails.checklists, ...res.data] });
      setShowConfirmation(false);
    }).catch((err) => {
      toast.error(err?.error || 'Failed to save checklist');
    });
  };

  const handleRejectGeneration = () => {
    setGeneratedChecklist([]);
    setShowConfirmation(false);
  };

  return (
    <div className='flex gap-2 mb-0'>
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
          onClick={handleGenerateChecklist}
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

export default GenerateChecklistButton;
