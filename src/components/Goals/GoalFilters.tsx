import { useEffect, useMemo } from 'react';

import { Grid2X2, List } from 'lucide-react';
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

  const urlFilterParams = useMemo(() => {
    let filterObject: { [key: string]: string | string[] } = {};
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      if (key === 'status' || key === 'category') {
        filterObject = { ...filterObject, [key]: searchParams.getAll(key) };
      } else {
        filterObject = { ...filterObject, [key]: value };
      }
    });
    return filterObject;
  }, [searchParams]);

  useEffect(() => {
    const statuses = status?.map((option) => option?.value || '');
    const priorities = category?.map((option) => option?.value || '');
    setSearchParams({ ...urlFilterParams, status: statuses || [], sortBy: sortBy?.value || '', priority: priorities || [], view: searchParams.get('view') || 'grid' });
  }, [status, sortBy, setSearchParams, category, urlFilterParams, searchParams]);

  const handleUpdateView = (view: 'list' | 'grid') => {
    setSearchParams({ ...urlFilterParams, view });
  };

  return (
    <FormProvider {...methods}>
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
    </FormProvider>
  );
};

export default GoalFilters;