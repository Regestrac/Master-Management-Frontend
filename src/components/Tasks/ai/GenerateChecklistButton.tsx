import { useState } from 'react';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { generateChecklist, saveChecklists } from 'services/checklist';

import FadingCircles from 'icons/FadingCircles';

/**
 * GenerateChecklistButton
 *
 * Renders an "AI Generate" button for creating suggested checklist items. After
 * generation, the component shows Accept / Close actions to either save the
 * generated checklist to the backend or discard it. Pattern follows the other
 * generators inside `src/components/Tasks/ai`.
 */
const GenerateChecklistButton = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedChecklist, setGeneratedChecklist] = useState<{ title: string }[]>([]);

  const { id } = useParams();

  const handleGenerateChecklist = () => {
    if (!id) { return; }
    setIsLoading(true);
    generateChecklist({ taskId: id })
      .then((res) => {
        if (Array.isArray(res?.data)) {
          setGeneratedChecklist(res.data as { title: string }[]);
        }
        setShowConfirmation(true);
        toast.success(res?.message || 'Checklist generated');
      })
      .catch((err) => {
        toast.error(err?.error || 'Failed to generate checklist');
      })
      .finally(() => setIsLoading(false));
  };

  const handleAcceptGeneration = () => {
    if (!id || generatedChecklist.length === 0) { return; }
    saveChecklists(generatedChecklist.map((c) => ({ ...c, taskId: id })))
      .then((res) => {
        toast.success(res?.message || 'Checklist saved');
        setGeneratedChecklist([]);
        setShowConfirmation(false);
      })
      .catch((err) => {
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
            className='px-2 py-1 text-xs bg-primary text-text rounded hover:bg-hover-secondary transition-colors duration-200 cursor-pointer'
          >
            Accept
          </button>
          <button
            type='button'
            onClick={handleRejectGeneration}
            className='px-2 py-1 text-xs outline-1 text-text rounded hover:outline-1 hover:bg-hover-secondary transition-colors duration-200 cursor-pointer'
          >
            Close
          </button>
        </>
      ) : (
        <button
          type='button'
          onClick={handleGenerateChecklist}
          disabled={isLoading}
          className={`px-2 py-1 text-xs bg-primary text-text rounded hover:bg-hover-primary transition-colors duration-200 ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          Generate ✨
          {isLoading ? <FadingCircles radius={2} /> : null}
        </button>
      )}
    </div>
  );
};

export default GenerateChecklistButton;
