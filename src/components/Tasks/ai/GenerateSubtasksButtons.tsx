import { Dispatch, SetStateAction, useState } from 'react';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import clsx from 'clsx';

import { parseJsonArray } from 'helpers/utils';
import { AI_BUTTON_STYLE } from 'helpers/configs';

import { useTaskStore } from 'stores/taskStore';

import { generateSubTasks, saveSubTasks } from 'services/tasks';

import FadingCircles from 'icons/FadingCircles';

type PropsType = {
  generatedTasks: { title: string; description: string; }[];
  setGeneratedTasks: Dispatch<SetStateAction<{ title: string; description: string; }[]>>;
};

const GenerateSubtasksButtons = ({ generatedTasks, setGeneratedTasks }: PropsType) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = useTaskStore((state) => state.currentTaskDetails?.title);
  const description = useTaskStore((state) => state.currentTaskDetails?.description);

  const { id } = useParams();

  const handleGenerateSubtasks = () => {
    if (id) {
      setIsLoading(true);
      generateSubTasks(id, { title, description }).then((res) => {
        setGeneratedTasks(parseJsonArray(res?.data));
        setShowConfirmation(true);
        setIsLoading(false);
      }).catch((err) => {
        setIsLoading(false);
        toast.error(err?.error || 'Failed to generate subtasks');
      });
    };
  };

  const handleAcceptGeneration = () => {
    setShowConfirmation(false);
    if (id && generatedTasks.length) {
      saveSubTasks(id, generatedTasks).then((res) => {
        toast.success(res?.message || 'Subtasks saved successfully');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to save subtasks');
      });
    }
  };

  const handleRejectGeneration = () => {
    setShowConfirmation(false);
    setGeneratedTasks([]);
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
          onClick={handleGenerateSubtasks}
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

export default GenerateSubtasksButtons;