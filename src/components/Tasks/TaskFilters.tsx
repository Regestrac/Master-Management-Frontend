import { useEffect, useMemo } from 'react';

import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

import SelectField from 'components/Shared/SelectField';

import { isEmpty } from 'src/helpers/utils';

const statusFilterOptions = [
  { label: 'All Tasks', value: 'all' },
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'inprogress' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paused', value: 'paused' },
  { label: 'Completed', value: 'completed' },
];

const priorityFilterOptions = [
  { label: 'All Priorities', value: 'all' },
  { label: 'High', value: 'high' },
  { label: 'Normal', value: 'normal' },
  { label: 'Low', value: 'low' },
];

const taskSortOptions = [
  { label: 'Priority', value: 'priority' },
  { label: 'Status', value: 'status' },
  { label: 'Due Date', value: 'dueDate' },
  { label: 'Created Date', value: 'createdDate' },
];

const TaskFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filteredStatusOptions = statusFilterOptions.filter((option) => searchParams.getAll('status')?.includes(option.value));
  const filteredPriorityOptions = priorityFilterOptions.filter((option) => searchParams.getAll('priority')?.includes(option.value));

  const methods = useForm({
    defaultValues: {
      status: isEmpty(filteredStatusOptions) ? [{ value: 'all', label: 'All Tasks' }] : filteredStatusOptions,
      priority: isEmpty(filteredPriorityOptions) ? [{ value: 'all', label: 'All Priorities' }] : filteredPriorityOptions,
      sortBy: taskSortOptions.find((option) => option.value === searchParams.get('sortBy')) || { value: 'priority', label: 'Priority' },
    },
  });

  const { control } = methods;

  const { status, sortBy, priority } = useWatch({ control });

  const urlFilterParams = useMemo(() => {
    let filterObject: { [key: string]: string | string[] } = {};
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      if (key === 'status') {
        filterObject = { ...filterObject, [key]: searchParams.getAll(key) };
      } else {
        filterObject = { ...filterObject, [key]: value };
      }
    });
    return filterObject;
  }, [searchParams]);

  useEffect(() => {
    const statuses = status?.map((option) => option?.value || '');
    const priorities = priority?.map((option) => option?.value || '');
    setSearchParams({ ...urlFilterParams, status: statuses || [], sortBy: sortBy?.value || '', priority: priorities || [] });
  }, [status, sortBy, setSearchParams, priority, urlFilterParams]);

  return (
    <FormProvider {...methods}>
      <div className='flex flex-1 flex-wrap items-center gap-4'>
        <SelectField
          label='Filter Tasks by Status:'
          name='status'
          options={statusFilterOptions}
          isMulti
        />
        <SelectField
          label='Filter Tasks by Priority:'
          name='priority'
          options={priorityFilterOptions}
          isMulti
        />
        <SelectField
          label='Sort Tasks By:'
          name='sortBy'
          options={taskSortOptions}
          isMulti={false}
        />

        {/* <div className='flex rounded-lg border border-gray-300 overflow-hidden'>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}
            >
              <CheckSquare className='w-4 h-4' />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 ${viewMode === 'kanban' ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}
            >
              <BarChart3 className='w-4 h-4' />
            </button>
          </div> */}
      </div>
    </FormProvider>
  );
};

export default TaskFilters;