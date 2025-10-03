import { useState } from 'react';

import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import FadingCircles from 'icons/FadingCircles';

import { generateDescription, updateTask } from 'src/services/tasks';

const GenerateDescriptionButtons = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const { reset, getValues, setValue } = useFormContext();

  const handleUpdateTask = (payload: object) => {
    if (id) {
      updateTask(id, payload).then((res) => {
        reset(getValues());
        toast.success(res?.message || 'Updated successfully');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to update task');
      });
    }
  };

  const handleGenerateDescription = () => {
    if (id) {
      setIsLoading(true);
      generateDescription(id, { topic: getValues('title') }).then((res) => {
        setShowConfirmation(true);
        setValue('description', res?.description);
        toast.success(res?.message || 'Description generated successfully');
        setIsLoading(false);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to generate description');
        setIsLoading(false);
      });
    }
  };

  const handleAcceptGeneration = () => {
    handleUpdateTask({ description: getValues('description') });
    setShowConfirmation(false);
  };

  const handleRejectGeneration = () => {
    reset();
    setShowConfirmation(false);
  };
  return (
    <div className='flex justify-end gap-2 mb-0'>
      {showConfirmation ? (
        <>
          <button
            type='button'
            onClick={handleAcceptGeneration}
            className='px-2 py-1 text-xs bg-blue-600 text-text rounded hover:bg-hover-secondary transition-colors duration-200 cursor-pointer'
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
          onClick={handleGenerateDescription}
          disabled={isLoading}
          className={`px-2 py-1 text-xs bg-blue-600 text-text rounded hover:bg-hover-blue-600 transition-colors duration-200 ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          Generate ✨
          {isLoading ? <FadingCircles radius={2} /> : null}
        </button>
      )}
    </div>
  );
};

export default GenerateDescriptionButtons;