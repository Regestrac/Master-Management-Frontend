import { useEffect, useRef, useState } from 'react';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Check, List, Plus, Trash2 } from 'lucide-react';

import { isEmpty } from 'helpers/utils';

import useModalStore from 'stores/modalStore';
import { useTaskStore } from 'stores/taskStore';
import { useSettingsStore } from 'stores/settingsStore';

import GenerateChecklistButton from 'components/Tasks/ai/GenerateChecklistButton';
import Outline from 'components/Shared/Outline';

import {
  getChecklists,
  saveChecklist,
  updateChecklist,
  deleteChecklist as deleteChecklistApi,
} from 'src/services/checklist';

type GeneratedChecklistType = {
  id: number;
  title: string;
};

const Checklist = () => {
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [generatedChecklist, setGeneratedChecklist] = useState<GeneratedChecklistType[]>([]);

  const updateTaskDetails = useTaskStore((state) => state.updateCurrentTaskDetails);
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const taskDetails = useTaskStore((state) => state.currentTaskDetails);
  const updateVisibility = useModalStore((state) => state.updateVisibility);

  const { id } = useParams();

  const shouldFetchChecklist = useRef(true);

  const startEditing = (cid: number, title: string) => {
    setEditingId(cid);
    setEditingValue(title);
  };

  const saveEdit = (cid: number) => {
    const title = editingValue.trim();
    if (!title) {
      setEditingId(null);
      return;
    }
    updateChecklist(cid, { title }).then((updated) => {
      updateTaskDetails({
        ...taskDetails,
        checklists: taskDetails.checklists.map((c) => (c.id === cid ? { ...c, ...updated?.data } : c)),
      });
      setEditingId(null);
    }).catch((err) => {
      toast.error(err?.error || 'Could not update checklist title');
    });
  };

  const toggleChecklistItem = (cid: number) => {
    const item = taskDetails.checklists.find((c) => c.id === cid);
    if (!item) {
      return;
    }
    updateChecklist(cid, { completed: !item.completed }).then((updated) => {
      updateTaskDetails({ ...taskDetails, checklists: taskDetails.checklists.map((c) => (c.id === cid ? { ...c, ...updated?.data } : c)) });
    }).catch((err) => {
      toast.error(err?.error || 'Could not update checklist item');
    });
  };

  const removeChecklistItem = (cid: number) => {
    const deleteChecklist = () => {
      deleteChecklistApi(cid).then((res) => {
        toast.success(res?.message || 'Checklist item deleted successfully');
        updateTaskDetails({ ...taskDetails, checklists: taskDetails.checklists.filter((c) => c.id !== cid) });
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
      updateTaskDetails({ ...taskDetails, checklists: [...taskDetails.checklists, created?.data] });
      setNewChecklistItem('');
    }).catch((err) => {
      toast.error(err?.error || 'Could not add checklist item');
    });
  };

  useEffect(() => {
    if (id && shouldFetchChecklist.current && taskDetails.id) {
      getChecklists(`task_id=${id}`).then((res) => {
        updateTaskDetails({ ...taskDetails, checklists: res?.data });
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
            {taskDetails.checklists?.filter((item) => item.completed).length || 0}
            /
            {taskDetails.checklists?.length || 0}
            )
          </h3>
          <div className='text-sm flex items-center gap-3'>
            <GenerateChecklistButton generatedChecklist={generatedChecklist} setGeneratedChecklist={setGeneratedChecklist} />
            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {Math.round((taskDetails.checklists?.filter((item) => item.completed).length / taskDetails.checklists?.length) * 100) || 0}
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
            className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500 ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300'}`}
            aria-label='New checklist item'
          />
          <button
            onClick={addChecklistItem}
            aria-label='Add checklist item'
            className='px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors'
          >
            <Plus className='w-4 h-4' />
          </button>
        </div>

        {/* Checklist items */}
        <div className='space-y-2'>
          {!isEmpty(generatedChecklist) && (
            <Outline colors={['bg-primary', 'bg-primary-500']} width='2px' variant='rotate' animationDuration='2s'>
              <div className='space-y-2 bg-neutral-900 p-2 rounded-xl'>
                {Array.isArray(generatedChecklist) && generatedChecklist?.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div className='flex items-center space-x-3 flex-1'>
                      <p>
                        {item.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Outline>
          )}
          {taskDetails.checklists?.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${item.completed ? 'opacity-75' : ''}`}
            >
              <div className='flex items-center space-x-3 flex-1'>
                <button
                  onClick={() => toggleChecklistItem(item.id)}
                  aria-label={`${item.completed ? 'Mark as incomplete' : 'Mark as complete'}: ${item.title}`}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${item.completed
                    ? 'bg-primary-500 border-primary-500'
                    : darkMode
                      ? 'border-gray-500 hover:border-primary-500'
                      : 'border-gray-300 hover:border-primary-500'}`}
                >
                  {item.completed && <Check className='w-2.5 h-2.5 text-white' />}
                </button>
                {editingId === item.id ? (
                  <input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onBlur={() => saveEdit(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        saveEdit(item.id);
                      } else if (e.key === 'Escape') {
                        setEditingId(null);
                      }
                    }}
                    className={`${item.completed ? 'line-through' : ''} flex-1 bg-transparent outline-none border-none`}
                  />
                ) : (
                  <p
                    role='button'
                    tabIndex={0}
                    onClick={() => !item.completed && startEditing(item.id, item.title)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (!item.completed) {
                          startEditing(item.id, item.title);
                        }
                      }
                    }}
                    className={`${item.completed ? 'line-through' : ''} ${!item.completed ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-1' : ''}`}
                    aria-label={`Edit checklist item: ${item.title}${item.completed ? ' (completed)' : ''}`}
                  >
                    {item.title}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeChecklistItem(item.id)}
                aria-label={`Remove checklist item: ${item.title}`}
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