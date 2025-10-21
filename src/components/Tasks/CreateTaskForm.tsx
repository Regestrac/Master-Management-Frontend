import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const taskFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  status: z.enum(['todo', 'inprogress', 'pending', 'paused', 'complete']),
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
      status: 'todo',
      subtasks: [{ title: '', done: false }],
    },

  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subtasks',
  });

  const onSubmit = (_data: TaskFormData) => {
    // Handle submission here
    // TODO: Implement task creation logic
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-xl mx-auto rounded-2xl shadow-md p-6 space-y-6'
    >
      <h2 className='text-xl font-bold'>Create New Task or Goal</h2>

      <div>
        <label htmlFor='task-title' className='block font-semibold'>Title</label>
        <input
          id='task-title'
          {...register('title')}
          className='mt-1 w-full rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-2'
          placeholder='e.g., Learn React'
          aria-describedby={errors.title ? 'title-error' : undefined}
          aria-invalid={errors.title ? 'true' : 'false'}
        />
        {errors.title && <p id='title-error' className='text-red-500 text-sm' role='alert'>{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor='task-description' className='block font-semibold'>Description</label>
        <textarea
          id='task-description'
          {...register('description')}
          className='mt-1 w-full rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-2'
          rows={3}
          placeholder='Describe the goal or task'
        />
      </div>

      <div>
        <label htmlFor='task-deadline' className='block font-semibold'>Deadline</label>
        <input
          id='task-deadline'
          type='date'
          {...register('deadline')}
          className='mt-1 w-full rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-2'
        />
      </div>

      <div>
        <label htmlFor='task-frequency' className='block font-semibold'>Frequency</label>
        <select
          id='task-frequency'
          {...register('frequency')}
          className='mt-1 w-full rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-2'
        >
          <option value=''>Select frequency</option>
          <option value='daily'>Daily</option>
          <option value='alternate'>Alternate Days</option>
          <option value='weekly'>Weekly</option>
          <option value='monthly'>Monthly</option>
        </select>
      </div>

      <div>
        <label htmlFor='days-per-week' className='block font-semibold'>Days Per Week (optional)</label>
        <input
          id='days-per-week'
          type='number'
          {...register('daysPerWeek', { valueAsNumber: true })}
          className='mt-1 w-full rounded-md border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-2'
          min={1}
          max={7}
          aria-describedby='days-per-week-help'
        />
        <p id='days-per-week-help' className='text-xs text-gray-500 mt-1'>Enter a number between 1 and 7</p>
      </div>

      <div>
        <label className='block font-semibold mb-2'>Subtasks</label>
        <div role='group' aria-labelledby='subtasks-label'>
          <span id='subtasks-label' className='sr-only'>Subtasks list</span>
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
                aria-label={`Remove subtask ${index + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type='button'
            onClick={() => append({ title: '', done: false })}
            className='text-blue-600 hover:text-blue-800 text-sm'
            aria-label='Add new subtask'
          >
            + Add Subtask
          </button>
        </div>
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
