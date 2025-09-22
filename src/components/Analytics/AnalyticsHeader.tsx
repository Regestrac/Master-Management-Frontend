import { useForm, FormProvider } from 'react-hook-form';
import { Menu, X } from 'lucide-react';

import { useProfileStore } from 'stores/profileStore';
import { useNavbarStore } from 'stores/navbarStore';

import DateRangePicker, { DateRange } from 'components/Shared/DateRangePicker';

const AnalyticsHeader = () => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';
  const setShowNavbar = useNavbarStore((state) => state.setShowNavbar);
  const showNavbar = useNavbarStore((state) => state.showNavbar);

  const methods = useForm<{ dateRange: DateRange }>({
    defaultValues: {
      dateRange: {
        startDate: (() => {
          const date = new Date();
          date.setDate(date.getDate() - 7);
          return date;
        })(),
        endDate: new Date(),
      },
    },
  });

  const handleSidebarToggle = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <FormProvider {...methods}>
      <div className={`sm:ml-70 fixed top-0 left-0 right-0 z-40 ${darkMode ? 'bg-gray-900' : 'bg-white'} border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} px-4 lg:px-6 py-4`}>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
          <div className='w-full md:w-auto flex items-center justify-between'>
            <div>
              <h3 className='text-2xl font-bold mb-2'>Analytics & Insights</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Track your productivity patterns and goal progress
              </p>
            </div>
            {/* Hamburger icon visible on small screens */}
            <button
              className={`sm:hidden ml-2 p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              onClick={handleSidebarToggle}
              aria-label='Toggle sidebar'
            >
              {showNavbar ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
            </button>
          </div>
          <div className='flex items-center gap-4'>
            <DateRangePicker
              name='dateRange'
              placeholder='Select date range'
              className='min-w-[280px]'
            />
            <button className='flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
              <span className='hidden sm:inline'>Export Report</span>
            </button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default AnalyticsHeader;