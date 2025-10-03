import { useCallback, useEffect, useRef } from 'react';

import { useForm, FormProvider } from 'react-hook-form';
import { Menu, X, Sun, Moon } from 'lucide-react';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useNavbarStore } from 'stores/navbarStore';
import { useSettingsStore } from 'stores/settingsStore';

import { updateTheme } from 'services/settings';

import DateRangePicker, { DateRange } from 'components/Shared/DateRangePicker';

const AnalyticsHeader = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const setShowNavbar = useNavbarStore((state) => state.setShowNavbar);
  const showNavbar = useNavbarStore((state) => state.showNavbar);

  const shouldUpdateParamsRef = useRef<boolean>(true);

  const [searchParams, setSearchParams] = useSearchParams();

  const methods = useForm<{ dateRange: DateRange }>({
    defaultValues: {
      dateRange: {
        startDate: (() => {
          const date = new Date();
          date.setDate(date.getDate() - 6); // last 7 days inclusive (today and previous 6)
          return date;
        })(),
        endDate: new Date(),
      },
    },
  });

  const handleSidebarToggle = () => {
    setShowNavbar(!showNavbar);
  };

  const updateAppTheme = () => {
    updateSettings({ theme: darkMode ? 'light' : 'dark' });
    updateTheme({ theme: darkMode ? 'light' : 'dark' }).then((res) => {
      updateSettings({ theme: res?.theme });
    }).catch((err) => {
      toast.error(err?.error);
    });
  };

  const formatDate = (date: Date | null): string => date ? dayjs(date).format('DD-MM-YYYY') : '';

  const getPreviousPeriod = useCallback((startDate: Date, endDate: Date) => {
    const diff = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
    const prevEnd = dayjs(startDate).subtract(1, 'day');
    const prevStart = prevEnd.subtract(diff - 1, 'day');
    return { prevStart, prevEnd };
  }, []);

  const handleDateApply = useCallback(({ startDate, endDate }: DateRange) => {
    const params = new URLSearchParams();

    if (!startDate || !endDate) {
      setSearchParams(params);
      return;
    }

    // Main params
    params.set('startDate', formatDate(startDate));
    params.set('endDate', formatDate(endDate));

    const setPrev = (s: dayjs.Dayjs, e: dayjs.Dayjs) => {
      params.set('prevStartDate', s.format('DD-MM-YYYY'));
      params.set('prevEndDate', e.format('DD-MM-YYYY'));
    };

    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const today = dayjs();

    if (start.isSame(end, 'day') && start.isSame(today, 'day')) {
      // Today → yesterday
      const y = start.subtract(1, 'day');
      setPrev(y, y);
    } else if (
      start.isSame(today.startOf('week'), 'day') &&
      end.isSame(today, 'day')
    ) {
      // This week → last week
      setPrev(start.subtract(7, 'day'), start.subtract(1, 'day'));
    } else if (
      start.isSame(today.startOf('month'), 'day') &&
      end.isSame(today, 'day')
    ) {
      // This month → last month
      setPrev(start.subtract(1, 'month').startOf('month'), start.subtract(1, 'month').endOf('month'));
    } else if (
      start.isSame(today.startOf('year'), 'day') &&
      end.isSame(today, 'day')
    ) {
      // This year → last year
      setPrev(start.subtract(1, 'year').startOf('year'), start.subtract(1, 'year').endOf('year'));
    } else if (end.isSame(today, 'day')) {
      // Last N days (7, 30, 365) → previous period
      const days = end.diff(start, 'day');
      if ([7, 30, 365].includes(days)) {
        const { prevStart, prevEnd } = getPreviousPeriod(start.toDate(), end.toDate());
        setPrev(dayjs(prevStart), dayjs(prevEnd));
      }
    }

    // Update params
    setSearchParams(params);
  }, [getPreviousPeriod, setSearchParams]);

  // On first mount, if URL has no date params, default to last 7 days and update URL
  useEffect(() => {
    const hasParams = !!(searchParams.get('startDate') && searchParams.get('endDate'));
    if (hasParams || !shouldUpdateParamsRef.current) {
      shouldUpdateParamsRef.current = false;
      return;
    }
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6); // last 7 days inclusive
    methods.setValue('dateRange', { startDate: start, endDate: end });
    handleDateApply({ startDate: start, endDate: end });
    shouldUpdateParamsRef.current = false;
  }, [handleDateApply, methods, searchParams]);

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
              onApply={handleDateApply}
            />
            <button className='flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
              <span className='hidden sm:inline'>Export Report</span>
            </button>
            <button
              onClick={updateAppTheme}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              {darkMode ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
            </button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default AnalyticsHeader;