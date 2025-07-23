import { useEffect } from 'react';

import { Grid2X2, List, Plus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { isEmpty } from 'helpers/utils';

import { useProfileStore } from 'stores/profileStore';

import SelectField from 'components/Shared/SelectField';

const statusFilterOptions = [
  { label: 'All Tasks', value: 'all' },
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'inprogress' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paused', value: 'paused' },
  { label: 'Completed', value: 'completed' },
];

const categoryFilterOptions = [
  { label: 'All Category', value: 'all' },
  { label: 'Personal', value: 'personal' },
  { label: 'Career', value: 'career' },
  { label: 'Health', value: 'health' },
  { label: 'Improvement', value: 'improvement' },
];

const goalSortOptions = [
  // { label: 'Priority', value: 'priority' },
  { label: 'Status', value: 'status' },
  { label: 'Due Date', value: 'dueDate' },
  { label: 'Created Date', value: 'createdDate' },
];

const GoalFilters = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  const [searchParams, setSearchParams] = useSearchParams();

  const filteredStatusOptions = statusFilterOptions.filter((option) => searchParams.getAll('status')?.includes(option.value));
  const filteredCategoryOptions = categoryFilterOptions.filter((option) => searchParams.getAll('category')?.includes(option.value));

  const methods = useForm({
    defaultValues: {
      status: isEmpty(filteredStatusOptions) ? [{ value: 'all', label: 'All Tasks' }] : filteredStatusOptions,
      category: isEmpty(filteredCategoryOptions) ? [{ value: 'all', label: 'All Category' }] : filteredCategoryOptions,
      sortBy: goalSortOptions.find((option) => option.value === searchParams.get('sortBy')) || { value: 'createDate', label: 'Created Date' },
    },
  });

  const { control } = methods;

  const { status, category, sortBy } = useWatch({ control });

  useEffect(() => {
    const statuses = status?.map((option) => option?.value || '');
    const priorities = category?.map((option) => option?.value || '');
    setSearchParams((prev) => ({ ...prev, status: statuses || [], sortBy: sortBy?.value || '', priority: priorities || [], view: prev.get('view') || 'grid' }));
  }, [status, sortBy, setSearchParams, category]);

  const handleUpdateView = (view: 'list' | 'grid') => {
    setSearchParams((prev) => ({ ...prev, view }));
  };

  const handleCreateGoal = () => {

  };

  return (
    <FormProvider {...methods}>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
        <div className='flex flex-wrap gap-4 items-end'>

          <SelectField
            label='Filter Goals by Status:'
            name='status'
            options={statusFilterOptions}
            isMulti
          />

          <SelectField
            label='Filter Goals by Category:'
            name='category'
            options={categoryFilterOptions}
            isMulti
          />

          <SelectField
            label='Sort Goals By:'
            name='sortBy'
            options={goalSortOptions}
            isMulti={false}
          />

          <div className='flex rounded-lg border border-gray-300 overflow-hidden'>
            <button
              onClick={() => handleUpdateView('grid')}
              className={`p-2 ${searchParams.get('view') === 'grid' ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}
            >
              <Grid2X2 className='w-4 h-4' />
            </button>
            <button
              onClick={() => handleUpdateView('list')}
              className={`p-2 ${searchParams.get('view') === 'list' ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}
            >
              <List className='w-4 h-4' />
            </button>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <button
            onClick={handleCreateGoal}
            className='flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
          >
            <Plus className='w-4 h-4' />
            <span>New Goal</span>
          </button>
        </div>
      </div>
    </FormProvider>
  );
};

export default GoalFilters;