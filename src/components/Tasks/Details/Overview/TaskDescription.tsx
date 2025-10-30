import { useCallback, useEffect, useRef, useState } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

import { useTaskStore } from 'stores/taskStore';
import { useSettingsStore } from 'stores/settingsStore';

import { updateTask } from 'services/tasks';

import GenerateDescriptionButtons from 'components/Tasks/ai/GenerateDescriptionButtons';
import Input from 'components/Shared/Input';

const TaskDescription = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(200);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);

  const taskDetailsRef = useRef({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { id } = useParams();
  const methods = useForm();

  const { reset, getValues } = methods;

  const { description } = getValues();

  const handleUpdateTask = (payload: object) => {
    if (id && taskDetails?.description !== getValues('description')) {
      updateTask(id, payload).then((res) => {
        reset(getValues());
        toast.success(res?.message || 'Updated successfully');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to update task');
      });
    }
  };

  const saveDescription = () => {
    if (
      getValues('description')?.trim() &&
      taskDetails?.description !== getValues('description')
    ) {
      handleUpdateTask({ description: getValues('description') });
    }
  };

  const adjustTextareaHeight = useCallback(() => {
    const textAreaElement = textareaRef.current;
    if (textAreaElement) {
      // Temporarily reset height to measure full scrollHeight
      textAreaElement.style.height = 'auto';
      const scrollHeight = textAreaElement.scrollHeight;

      if (scrollHeight > 200) {
        setShowToggle(true);
      } else {
        setShowToggle(false);
      }

      if (isExpanded) {
        setTextareaHeight(Math.min(scrollHeight, 1000));
      } else {
        setTextareaHeight(200);
      }
    }
  }, [isExpanded]);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
    adjustTextareaHeight();
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [adjustTextareaHeight, description]);

  useEffect(() => {
    if (taskDetails !== taskDetailsRef.current) {
      reset(taskDetails);
      taskDetailsRef.current = taskDetails;
    }
  }, [adjustTextareaHeight, reset, taskDetails]);

  return (
    <FormProvider {...methods}>
      <div
        className={clsx(
          'rounded-xl border transition-colors',
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
        )}
      >
        <div
          className={clsx(
            'p-6 border-b flex items-center justify-between',
            darkMode ? 'border-gray-700' : 'border-gray-200',
          )}
        >
          <h3 className='text-lg font-semibold'>Description</h3>
          <div className='flex flex-row gap-3'>
            <GenerateDescriptionButtons />
          </div>
        </div>

        <div className='p-6 relative'>
          <Input
            ref={textareaRef}
            name='description'
            label=''
            type='textarea'
            rows={6}
            placeholder='Enter task description...'
            onBlur={saveDescription}
            className={`w-full resize-none transition-all duration-300 ease-in-out p-4 pb-6 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500 scrollbar-sm ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-gray-50 border-gray-300 text-gray-900'}`}
            style={{ height: `${textareaHeight}px` }}
          />

          {showToggle && (
            <div className={`absolute bottom-2 left-0 right-0 flex justify-center py-2 ${darkMode ? 'bg-gradient-to-t from-gray-800 to-transparent' : 'bg-gradient-to-t from-white to-transparent'}`}>
              <button
                onClick={toggleExpanded}
                className={`flex items-center gap-1 px-4 py-1 rounded-full text-sm font-medium shadow-md border ${darkMode
                  ? 'text-blue-400 hover:text-blue-300 bg-gray-700 hover:bg-gray-600 border-gray-600'
                  : 'text-blue-600 hover:text-blue-700 bg-white hover:bg-gray-50 border-gray-200'}`}
              >
                {isExpanded ? (
                  <>
                    <span>Show Less</span>
                    <ChevronUp size={16} />
                  </>
                ) : (
                  <>
                    <span>Show More</span>
                    <ChevronDown size={16} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  );
};

export default TaskDescription;
