import { useEffect, useRef } from 'react';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useTaskStore } from 'stores/taskStore';

import { getTask } from 'services/tasks';

import TaskDescription from 'components/Tasks/Details/Overview/TaskDescription';
import Checklist from 'components/Tasks/Details/Overview/Checklist';
import Tags from 'components/Tasks/Details/Overview/Tags';
import SubTasks from 'components/Tasks/Details/SubTasks/SubTasks';
import TaskStatus from 'components/Tasks/Details/Overview/TaskStatus';

const TaskOverview = () => {
  const updateCurrentTaskDetails = useTaskStore((state) => state.updateCurrentTaskDetails);

  const prevTaskIdRef = useRef('');

  const { id } = useParams();

  useEffect(() => {
    if (id && prevTaskIdRef.current !== id) {
      getTask(id).then((fetchedTask) => {
        updateCurrentTaskDetails(fetchedTask?.data);
        // setIsLoading(false);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch task details.');
        // setIsLoading(false);
      });
      prevTaskIdRef.current = id;
    }
  }, [id, updateCurrentTaskDetails]);

  return (
    <div className='grid lg:grid-cols-5 gap-4 space-y-6'>
      <div className='lg:col-span-3 overflow-auto max-h-[70vh] flex flex-col space-y-6 pr-2 scrollbar-sm'>
        <TaskDescription />
        <SubTasks />
      </div>
      <div className='lg:col-span-2 overflow-auto max-h-[70vh] flex flex-col space-y-6 pr-2 scrollbar-sm'>
        <Checklist />
        {/* <StickyNotes /> */}
        <Tags />
        <TaskStatus />
      </div>

      {/* Attachments */}
      {/* <div className={`rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold flex items-center'>
              <Paperclip className='w-5 h-5 mr-2' />
              Attachments (
              {taskData.attachments.length}
              )
            </h3>
            <button className='flex items-center space-x-2 px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'>
              <Plus className='w-4 h-4' />
              <span className='text-sm'>Add File</span>
            </button>
          </div>
        </div>
        <div className='p-6'>
          <div className='space-y-3'>
            {taskData.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center'>
                    <Paperclip className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                  </div>
                  <div>
                    <p className='font-medium'>{attachment.name}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {attachment.type}
                      {' '}
                      •
                      {attachment.size}
                      {' '}
                      •
                      {formatDate(attachment.uploadDate)}
                    </p>
                  </div>
                </div>
                <div className='flex items-center space-x-2'>
                  <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                    </svg>
                  </button>
                  <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-500'}`}>
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default TaskOverview;