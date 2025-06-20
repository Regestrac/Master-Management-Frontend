import { Dispatch, SetStateAction, useState } from 'react';

import { useParams } from 'react-router-dom';
import { useTaskStore } from 'stores/taskStore';
import { toast } from 'react-toastify';

import FadingCircles from 'icons/FadingCircles';

import { generateSubTasks, saveSubTasks } from 'src/services/tasks';

type PropsType = {
  generatedTasks: { title: string; description: string; }[];
  setGeneratedTasks: Dispatch<SetStateAction<{ title: string; description: string; }[]>>;
};

function parseJsonArray(jsonString: string) {
  let cleanedJsonString = jsonString.trim(); // Trim whitespace from both ends

  // Check if the string starts with '```json' and ends with '```'
  if (cleanedJsonString.startsWith('```json') && cleanedJsonString.endsWith('```')) {
    // Remove '```json' from the beginning (and the newline after it)
    cleanedJsonString = cleanedJsonString.substring('```json\n'.length);
    // Remove '```' from the end
    cleanedJsonString = cleanedJsonString.substring(0, cleanedJsonString.length - '```'.length);
    cleanedJsonString = cleanedJsonString.trim(); // Trim again in case of extra newlines/spaces
  }

  try {
    const parsedData = JSON.parse(cleanedJsonString);

    // Ensure the parsed data is indeed an array
    if (!Array.isArray(parsedData)) {
      throw new Error('The provided JSON string does not represent an array.');
    }

    return parsedData;
  } catch {
    return [];
  }
}

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
          onClick={handleGenerateSubtasks}
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

export default GenerateSubtasksButtons;