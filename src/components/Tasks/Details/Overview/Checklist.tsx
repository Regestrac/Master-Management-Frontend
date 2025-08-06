import { useEffect, useRef, useState } from 'react';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Check, List, Plus, Trash2 } from 'lucide-react';

import useModalStore from 'stores/modalStore';
import { useProfileStore } from 'stores/profileStore';
import { useTaskStore } from 'stores/taskStore';

import GenerateChecklistButton from 'components/Tasks/ai/GenerateChecklistButton';

import {
  getChecklists,
  saveChecklist,
  updateChecklist,
  deleteChecklist as deleteChecklistApi,
} from 'src/services/checklist';

const Checklist = () => {
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const updateTaskDetails = useTaskStore((state) => state.updateCurrentTaskDetails);
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);
  const updateVisibility = useModalStore((state) => state.updateVisibility);

  const { id } = useParams();

  const shouldFetchChecklist = useRef(true);

  const toggleChecklistItem = (cid: number) => {
    const item = taskDetails.checklist.find((c) => c.id === cid);
    if (!item) {
      return;
    }
    updateChecklist(cid, { completed: !item.completed }).then((updated) => {
      updateTaskDetails({ ...taskDetails, checklist: taskDetails.checklist.map((c) => (c.id === cid ? { ...c, ...updated?.data } : c)) });
    }).catch((err) => {
      toast.error(err?.error || 'Could not update checklist item');
    });
  };

  const removeChecklistItem = (cid: number) => {
    const deleteChecklist = () => {
      deleteChecklistApi(cid).then((res) => {
        toast.success(res?.message || 'Checklist item deleted successfully');
        updateTaskDetails({ ...taskDetails, checklist: taskDetails.checklist.filter((c) => c.id !== cid) });
      }).catch((err) => {
        toast.error(err?.error || 'Could not delete checklist item');
      });
    };
    updateVisibility({
      modalType: 'confirmDeleteModal',
      isVisible: true,
      extraProps: {
        title: 'Delete Checklist Item',
        description: 'Are you sure you want to delete this checklist item?',
        onSuccess: deleteChecklist,
      },
    });
  };

  const addChecklistItem = () => {
    const title = newChecklistItem.trim();
    if (!title) {
      return;
    }
    saveChecklist({ task_id: taskDetails.id, title }).then((created) => {
      updateTaskDetails({ ...taskDetails, checklist: [...taskDetails.checklist, created?.data] });
      setNewChecklistItem('');
    }).catch((err) => {
      toast.error(err?.error || 'Could not add checklist item');
    });
  };

  useEffect(() => {
    if (id && shouldFetchChecklist.current && taskDetails.id) {
      getChecklists(`task_id=${id}`).then((res) => {
        updateTaskDetails({ ...taskDetails, checklist: res?.data });
      }).catch((err) => {
        toast.error(err?.error || 'Failed to load checklist');
      });
      shouldFetchChecklist.current = false;
    }
  }, [id, taskDetails, updateTaskDetails]);

  return (
    <div className={`rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold flex items-center'>
            <List className='w-5 h-5 mr-2' />
            Checklist (
            {taskDetails.checklist?.filter((item) => item.completed).length || 0}
            /
            {taskDetails.checklist?.length || 0}
            )
          </h3>
          <div className='text-sm flex items-center gap-3'>
            <GenerateChecklistButton />
            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {Math.round((taskDetails.checklist?.filter((item) => item.completed).length / taskDetails.checklist?.length) * 100) || 0}
              % Complete
            </span>
          </div>
        </div>
      </div>
      <div className='p-6'>
        {/* Add new checklist item */}
        <div className='flex space-x-2 mb-6'>
          <input
            type='text'
            value={newChecklistItem}
            onChange={(e) => setNewChecklistItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
            placeholder='Add a checklist item...'
            className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300'}`}
          />
          <button
            onClick={addChecklistItem}
            className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
          >
            <Plus className='w-4 h-4' />
          </button>
        </div>

        {/* Checklist items */}
        <div className='space-y-2'>
          {taskDetails.checklist?.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${item.completed ? 'opacity-75' : ''}`}
            >
              <div className='flex items-center space-x-3 flex-1'>
                <button
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${item.completed
                    ? 'bg-purple-500 border-purple-500'
                    : darkMode
                      ? 'border-gray-500 hover:border-purple-500'
                      : 'border-gray-300 hover:border-purple-500'}`}
                >
                  {item.completed && <Check className='w-2.5 h-2.5 text-white' />}
                </button>
                <p className={`${item.completed ? 'line-through' : ''}`}>
                  {item.title}
                </p>
              </div>
              <button
                onClick={() => removeChecklistItem(item.id)}
                className={`p-1 rounded transition-colors ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-500'}`}
              >
                <Trash2 className='w-3 h-3' />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Checklist;