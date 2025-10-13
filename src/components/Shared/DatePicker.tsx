import { useRef, useCallback, useMemo, memo, useState } from 'react';

import { useController, useFormContext } from 'react-hook-form';
import { Calendar } from 'lucide-react';
import { DateObject, Calendar as RMDPCalendar } from 'react-multi-date-picker';
import clsx from 'clsx';

import { useSettingsStore } from 'stores/settingsStore';

export type DatePickerMode = 'calendar' | 'month' | 'year';

export type DatePickerProps = {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  mode?: DatePickerMode;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (_date: Date | null) => void;
};

// Convert DateObject to Date for compatibility
const convertDateObjectToDate = (dateObj: DateObject | null): Date | null => {
  if (!dateObj) {
    return null;
  }
  return dateObj.toDate();
};

// Convert Date to DateObject for react-multi-date-picker
const convertDateToDateObject = (_date: Date | null): DateObject | null => {
  if (!_date) {
    return null;
  }
  return new DateObject(_date);
};

const DatePickerComponent = ({
  name,
  label,
  placeholder = 'Select date',
  className = '',
  mode = 'calendar',
  disabled = false,
  required = false,
  error,
  format,
  minDate,
  maxDate,
  onChange,
}: DatePickerProps) => {
  const { settings } = useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef<any>(null);

  const { control } = useFormContext();

  const {
    field: { value, onChange: fieldOnChange },
    fieldState: { error: fieldError },
  } = useController({
    name,
    control,
    rules: { required: required ? 'This field is required' : false },
  });

  // Memoize the date value to prevent unnecessary re-renders
  const dateValue = useMemo(() => {
    return convertDateToDateObject(value || null);
  }, [value]);

  // Get the appropriate format based on mode
  const getFormat = useCallback(() => {
    if (format) {
      return format;
    }

    switch (mode) {
      case 'month':
        return 'MMMM YYYY';
      case 'year':
        return 'YYYY';
      default:
        return 'DD/MM/YYYY';
    }
  }, [mode, format]);

  // Handle date change
  const handleDateChange = useCallback(
    (selectedDate: DateObject | DateObject[] | null) => {
      const _date = Array.isArray(selectedDate) ? selectedDate[0] : selectedDate;
      const convertedDate = convertDateObjectToDate(_date);

      fieldOnChange(convertedDate);
      onChange?.(convertedDate);
    },
    [fieldOnChange, onChange],
  );

  // Get picker configuration based on mode
  const pickerConfig = useMemo(() => {
    const config: any = {
      onlyMonthPicker: mode === 'month',
      onlyYearPicker: mode === 'year',
    };

    if (minDate) {
      config.minDate = convertDateToDateObject(minDate);
    }

    if (maxDate) {
      config.maxDate = convertDateToDateObject(maxDate);
    }

    return config;
  }, [mode, minDate, maxDate]);

  // Toggle calendar visibility
  const toggleCalendar = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  }, [disabled, isOpen]);

  // Close calendar
  const closeCalendar = useCallback(() => {
    setIsOpen(false);
  }, []);

  const displayError = error || fieldError?.message;

  return (
    <div className={clsx('relative', className)}>
      {label && (
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}

      <div className='relative'>
        <div
          onClick={toggleCalendar}
          className={clsx(
            'flex items-center justify-between w-full px-3 py-2 border rounded-lg cursor-pointer transition-colors',
            'bg-white dark:bg-gray-800',
            'border-gray-300 dark:border-gray-600',
            'hover:border-gray-400 dark:hover:border-gray-500',
            'focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500',
            {
              'opacity-50 cursor-not-allowed': disabled,
              'border-red-500 dark:border-red-400': displayError,
            },
          )}
        >
          <span
            className={clsx(
              'text-sm',
              value
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-500 dark:text-gray-400',
            )}
          >
            {value ? dateValue?.format(getFormat()) : placeholder}
          </span>
          <Calendar className='w-4 h-4 text-gray-400' />
        </div>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className='fixed inset-0 z-40'
              onClick={closeCalendar}
            />

            {/* Calendar */}
            <div className='absolute top-full left-0 z-50 mt-1'>
              <RMDPCalendar
                ref={calendarRef}
                value={dateValue}
                onChange={handleDateChange}
                format={getFormat()}
                className={clsx(
                  'rmdp-calendar',
                  settings.theme === 'dark' ? 'rmdp-dark' : '',
                )}
                calendarPosition='bottom-left'
                {...pickerConfig}
              />
            </div>
          </>
        )}
      </div>

      {displayError && (
        <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
          {displayError}
        </p>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const DatePicker = memo(DatePickerComponent) as typeof DatePickerComponent;

export default DatePicker;
