import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const taskFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  status: z.enum(['incomplete', 'complete']),
  deadline: z.string().optional(),
  frequency: z.enum(['daily', 'alternate', 'weekly', 'monthly']).optional(),
  daysPerWeek: z.number().min(1).max(7).optional(),
  subtasks: z.array(z.object({
    title: z.string().min(1),
    done: z.boolean(),
  })).optional(),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

const CreateTaskForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      status: 'incomplete',
      subtasks: [{ title: '', done: false }],
    },

  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subtasks',
  });

  const onSubmit = (data: TaskFormData) => {
    console.log('Submitted:', data);
    // Handle submission here
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-xl mx-auto rounded-2xl shadow-md p-6 space-y-6'
    >
      <h2 className='text-xl font-bold'>Create New Task or Goal</h2>

      <div>
        <label className='block font-semibold'>Title</label>
        <input
          {...register('title')}
          className='mt-1 w-full rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-2'
          placeholder='e.g., Learn React'
        />
        {errors.title && <p className='text-red-500 text-sm'>{errors.title.message}</p>}
      </div>

      <div>
        <label className='block font-semibold'>Description</label>
        <textarea
          {...register('description')}
          className='mt-1 w-full rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-2'
          rows={3}
          placeholder='Describe the goal or task'
        />
      </div>

      <div>
        <label className='block font-semibold'>Deadline</label>
        <input
          type='date'
          {...register('deadline')}
          className='mt-1 w-full rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-2'
        />
      </div>

      <div>
        <label className='block font-semibold'>Frequency</label>
        <select
          {...register('frequency')}
          className='mt-1 w-full rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-2'
        >
          <option value=''>Select</option>
          <option value='daily'>Daily</option>
          <option value='alternate'>Alternate Days</option>
          <option value='weekly'>Weekly</option>
          <option value='monthly'>Monthly</option>
        </select>
      </div>

      <div>
        <label className='block font-semibold'>Days Per Week (optional)</label>
        <input
          type='number'
          {...register('daysPerWeek', { valueAsNumber: true })}
          className='mt-1 w-full rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-2'
          min={1}
          max={7}
        />
      </div>

      <div>
        <label className='block font-semibold mb-2'>Subtasks</label>
        {fields.map((field, index) => (
          <div key={field.id} className='flex items-center gap-2 mb-2'>
            <input
              {...register(`subtasks.${index}.title`)}
              placeholder={`Subtask ${index + 1}`}
              className='flex-1 p-2 rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-800'
            />
            <button
              type='button'
              onClick={() => remove(index)}
              className='text-red-500 hover:text-red-700'
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type='button'
          onClick={() => append({ title: '', done: false })}
          className='text-blue-600 hover:text-blue-800 text-sm'
        >
          + Add Subtask
        </button>
      </div>

      <button
        type='submit'
        disabled={isSubmitting}
        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md'
      >
        {isSubmitting ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
};

export default CreateTaskForm;
