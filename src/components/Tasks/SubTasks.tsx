import { useEffect, useRef, useState } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Input from 'components/Shared/Input';
import GenerateSubtasksButtons from 'components/Tasks/GenerateSubtasksButtons';

import DeleteIcon from 'icons/DeleteIcon';

import { createTask, deleteTask, getSubTasks } from 'src/services/tasks';

type Props = {}

const SubTasks = (_props: Props) => {
  const [subtasks, setSubtasks] = useState<{ title: string; id: number; }[]>([]);
  const [generatedTasks, setGeneratedTasks] = useState<{ title: string; description: string; }[]>([]);

  // const deleteTaskFromStore = useTaskStore((state) => state.deleteTask);

  const { id } = useParams<{ id: string }>();

  const subtasksFetchedRef = useRef(false);

  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: { title: '' },
  });

  const { handleSubmit, setValue } = methods;

  const handleAddSubtask = (formData: { title: string; }) => {
    if (formData?.title && id) {
      const payload = {
        title: formData.title,
        status: 'todo' as const,
        time_spend: 0,
        parent_id: Number(id),
      };
      createTask(payload).then((res) => {
        toast.success(res?.message || 'Successfully created task');
        setSubtasks([...subtasks, { ...payload, id: res?.data?.id }]);
        // addTask({ id: res?.data?.id, title: formData?.title || '', status: 'todo' as const, timeSpend: 0 });
        setValue('title', '');
      }).catch((err) => {
        toast.error(err?.error || 'Failed to create task');
      });
    }
  };

  const handleSubTaskClick = (subtaskId: number) => {
    navigate(`/tasks/${subtaskId}`);
  };

  const handleDeleteSubTask = (e: React.MouseEvent, subtaskId: number) => {
    e.stopPropagation();
    if (subtaskId) {
      deleteTask(subtaskId).then((res) => {
        toast.success(res?.message || 'Successfully deleted sub task');
        // deleteTaskFromStore(subtaskId);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to delete sub task');
      });
      setSubtasks(subtasks.filter((subtask) => subtask.id !== subtaskId));
    }
  };

  useEffect(() => {
    if (id && !subtasksFetchedRef.current) {
      getSubTasks(id).then((res) => {
        setSubtasks(res?.data || []);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch subtasks');
      });
      subtasksFetchedRef.current = true;
    }
  }, [id]);

  return (
    <div>
      <div className='flex gap-2 mb-3'>
        <h3 className='text-lg font-semibold'>Subtasks</h3>
        <GenerateSubtasksButtons setGeneratedTasks={setGeneratedTasks} generatedTasks={generatedTasks} />
      </div>
      {generatedTasks.length ? (
        <ul className='space-y-2 bg-secondary-bg rounded-xl p-2 mb-4'>
          <div className='text-sm text-gray-500 mb-2'>
            {generatedTasks.length}
            &nbsp;tasks (with description) generated:
          </div>
          {generatedTasks.map((subtask) => (
            <li
              key={subtask?.title}
              className='flex justify-between items-center p-2 rounded-md outline-primary outline-1'
            >
              <span>{subtask?.title}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <ul className='space-y-2'>
        {subtasks.map((subtask) => (
          <li
            key={subtask?.id}
            className='flex justify-between items-center p-2 rounded-md cursor-pointer outline-primary outline-1'
            onClick={() => handleSubTaskClick(subtask?.id)}
          >
            <span>{subtask?.title}</span>
            <button onClick={(e) => handleDeleteSubTask(e, subtask?.id)} className='cursor-pointer'><DeleteIcon /></button>
          </li>
        ))}
      </ul>
      <div className='mt-4 flex space-x-2'>
        <FormProvider {...methods}>
          <Input name='title' label='' placeholder='Enter Subtask Title' className='flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm' />
          <button
            onClick={handleSubmit(handleAddSubtask)}
            className='bg-indigo-500 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-600 mb-6'
          >
            Add
          </button>
        </FormProvider>
      </div>
    </div>
  );
};

export default SubTasks;