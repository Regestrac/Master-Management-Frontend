import { useForm, FormProvider } from 'react-hook-form';

import { SelectOptionType } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';

import SelectField from 'components/Shared/SelectField';

const AnalyticsHeader = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  const rangeOptions: SelectOptionType[] = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
  ];

  const methods = useForm<{ analyticsRange: SelectOptionType }>({
    defaultValues: {
      analyticsRange: rangeOptions[0],
    },
  });

  return (
    <FormProvider {...methods}>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8'>
        <div>
          <h3 className='text-2xl font-bold mb-2'>Analytics & Insights</h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Track your productivity patterns and goal progress
          </p>
        </div>
        <div className='flex items-center gap-4'>
          <SelectField
            name='analyticsRange'
            options={rangeOptions}
            placeholder='Select range'
            isMulti={false}
            className='min-w-[180px]'
          />
          <button className='flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
            </svg>
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </FormProvider>
  );
};

export default AnalyticsHeader;