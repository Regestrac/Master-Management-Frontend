import { useRef, useCallback, useMemo, memo, useState, useEffect } from 'react';

import { useController } from 'react-hook-form';
import { Calendar } from 'lucide-react';
import { DateObject, Calendar as RMDPCalendar } from 'react-multi-date-picker';
import clsx from 'clsx';

import { useSettingsStore } from 'stores/settingsStore';

export type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

export type DatePickerMode = 'calendar' | 'month' | 'year';

type DateRangePickerProps = {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  mode?: DatePickerMode;
  onChange?: (_dateRange: DateRange) => void;
  onApply?: (_dateRange: DateRange) => void;
};

// Convert DateObject to Date for compatibility
const convertDateObjectToDate = (dateObj: DateObject | null): Date | null => {
  if (!dateObj) {
    return null;
  }
  return dateObj.toDate();
};

// Convert Date to DateObject for react-multi-date-picker
const convertDateToDateObject = (date: Date | null): DateObject | null => {
  if (!date) {
    return null;
  }
  return new DateObject(date);
};

// Helper function to categorize dates
const getDateCategory = (date: Date): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateToCheck = new Date(date);
  dateToCheck.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - dateToCheck.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  if (diffDays > 1 && diffDays <= 7) {
    return 'This Week';
  }
  if (diffDays > 7 && diffDays <= 14) {
    return 'Last Week';
  }
  if (dateToCheck.getMonth() === today.getMonth() && dateToCheck.getFullYear() === today.getFullYear()) {
    return 'This Month';
  }

  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  if (dateToCheck.getMonth() === lastMonth.getMonth() && dateToCheck.getFullYear() === lastMonth.getFullYear()) {
    return 'Last Month';
  }

  return dateToCheck.getFullYear().toString();
};

const presets = () => [
  {
    label: 'Today',
    getValue: () => {
      const today = new Date();
      return {
        startDate: today,
        endDate: today,
      };
    },
  },
  {
    label: 'Yesterday',
    getValue: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        startDate: yesterday,
        endDate: yesterday,
      };
    },
  },
  {
    label: 'This Week',
    getValue: () => {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      return {
        startDate: startOfWeek,
        endDate: today,
      };
    },
  },
  {
    label: 'Last Week',
    getValue: () => {
      const today = new Date();
      const startOfLastWeek = new Date(today);
      startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
      const endOfLastWeek = new Date(startOfLastWeek);
      endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
      return {
        startDate: startOfLastWeek,
        endDate: endOfLastWeek,
      };
    },
  },
  {
    label: 'Last 7 Days',
    getValue: () => {
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 6);
      return {
        startDate: sevenDaysAgo,
        endDate: today,
      };
    },
  },
  {
    label: 'This Month',
    getValue: () => {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return {
        startDate: startOfMonth,
        endDate: today,
      };
    },
  },
  {
    label: 'Last Month',
    getValue: () => {
      const today = new Date();
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      return {
        startDate: startOfLastMonth,
        endDate: endOfLastMonth,
      };
    },
  },
  {
    label: 'Last 30 Days',
    getValue: () => {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      return {
        startDate: thirtyDaysAgo,
        endDate: today,
      };
    },
  },
  {
    label: 'This Year',
    getValue: () => {
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      return {
        startDate: startOfYear,
        endDate: today,
      };
    },
  },
  {
    label: 'Last 1 Year',
    getValue: () => {
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      return {
        startDate: oneYearAgo,
        endDate: today,
      };
    },
  },
  {
    label: 'All Time',
    getValue: () => ({
      startDate: null,
      endDate: null,
    }),
  },
];

/*************************
 *************************
 * Component Starts Here
 *************************
 *************************/

const DateRangePicker = memo(({
  name,
  label,
  placeholder = 'Select date range',
  className = '',
  mode = 'calendar',
  onChange,
  onApply,
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { field, fieldState } = useController({
    name,
    defaultValue: {
      startDate: null,
      endDate: null,
    },
  });

  // Memoize dateRange to prevent unnecessary re-renders
  const dateRange: DateRange = useMemo(() => field.value || {
    startDate: null,
    endDate: null,
  }, [field.value]);

  // Handle date change from react-multi-date-picker
  const handleDateChange = useCallback((dates: DateObject | DateObject[] | null) => {
    let newRange: DateRange;

    if (!dates) {
      newRange = { startDate: null, endDate: null };
    } else if (Array.isArray(dates)) {
      // Range selection
      const [start, end] = dates;
      newRange = {
        startDate: convertDateObjectToDate(start || null),
        endDate: convertDateObjectToDate(end || null),
      };
    } else {
      // Single date selection
      const date = convertDateObjectToDate(dates);
      newRange = { startDate: date, endDate: date };
    }

    field.onChange(newRange);
    if (onChange) {
      onChange(newRange);
    }
  }, [field, onChange]);

  // Format date range for display
  const formatDateRange = useCallback((range: DateRange): React.ReactNode => {
    // Show 'All Time' when both dates are null
    if (range.startDate === null && range.endDate === null) {
      return <span>All Time</span>;
    }

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: '2-digit',
      });
    };

    // Handle case where only one date is selected
    if ((range.startDate && !range.endDate) || (!range.startDate && range.endDate)) {
      const date = range.startDate || range.endDate;
      if (!date) {
        return null;
      }

      const category = getDateCategory(date);
      return (
        <div className='flex items-center gap-2'>
          <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-500/10 text-primary-500 dark:bg-primary-500/20'>
            {category}
          </span>
          <span>{formatDate(date)}</span>
        </div>
      );
    }

    // Handle case where both dates are selected
    if (range.startDate && range.endDate) {
      const isSameDay = range.startDate.toDateString() === range.endDate.toDateString();

      if (isSameDay) {
        const category = getDateCategory(range.startDate);
        return (
          <div className='flex items-center gap-2'>
            <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-500/10 text-primary-500 dark:bg-primary-500/20'>
              {category}
            </span>
            <span>{formatDate(range.startDate)}</span>
          </div>
        );
      }

      // Get the most specific common category for the range
      const startCategory = getDateCategory(range.startDate);
      const endCategory = getDateCategory(range.endDate);
      const category = startCategory === endCategory ? startCategory : null;

      return (
        <div className='flex items-center gap-2'>
          {category && (
            <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-500/10 text-primary-500 dark:bg-primary-500/20'>
              {category}
            </span>
          )}
          <span>{formatDate(range.startDate)}</span>
          <span className='text-muted-foreground'>-</span>
          <span>{formatDate(range.endDate)}</span>
        </div>
      );
    }

    return null;
  }, []);

  // Function to check if current date range matches a preset
  const getActivePreset = useCallback(() => {
    // Handle 'All Time' case first
    if (dateRange.startDate === null && dateRange.endDate === null) {
      return 'All Time';
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      return 'Custom';
    }

    for (const preset of presets()) {
      const presetRange = preset.getValue();

      // Handle 'All Time' preset
      if (preset.label === 'All Time' && !presetRange.startDate && !presetRange.endDate) {
        continue; // Already handled at the start
      }

      // For other presets, check date equality
      if (presetRange.startDate && presetRange.endDate) {
        const isSameStart = dateRange.startDate.toDateString() === presetRange.startDate.toDateString();
        const isSameEnd = dateRange.endDate.toDateString() === presetRange.endDate.toDateString();

        if (isSameStart && isSameEnd) {
          return preset.label;
        }
      }
    }

    return 'Custom';
  }, [dateRange]);

  const handlePresetClick = useCallback((preset: ReturnType<typeof presets>[0]) => {
    const newRange = preset.getValue();
    field.onChange(newRange);
    if (onChange) {
      onChange(newRange);
    }
  }, [field, onChange]);

  const handleApply = useCallback(() => {
    if (onApply) {
      onApply(dateRange);
    }
  }, [dateRange, onApply]);

  // Get current date values for react-multi-date-picker
  const currentValues = useMemo(() => {
    if (dateRange.startDate && dateRange.endDate) {
      return [
        convertDateToDateObject(dateRange.startDate),
        convertDateToDateObject(dateRange.endDate),
      ].filter(Boolean);
    } else if (dateRange.startDate) {
      return [convertDateToDateObject(dateRange.startDate)];
    }
    return [];
  }, [dateRange]);

  // Get picker configuration based on mode
  const pickerConfig = useMemo(() => {
    const baseConfig = {
      range: true,
      multiple: false,
      format: 'MM/DD/YYYY',
      maxDate: new Date(), // Disable future dates
    };

    switch (mode) {
      case 'month':
        return { ...baseConfig, onlyMonthPicker: true };
      case 'year':
        return { ...baseConfig, onlyYearPicker: true };
      default:
        return baseConfig;
    }
  }, [mode]);

  // Calculate dropdown position to prevent overflow
  // Handle click outside to close dropdown and window resize
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (isOpen) {
        // Recalculate position on resize
        setIsOpen(false);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      // Prevent background scrolling on mobile when dropdown is open
      if (isOpen && isSmallScreen && dropdownRef.current) {
        const target = event.target as Node;
        if (!dropdownRef.current.contains(target)) {
          event.preventDefault();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', handleResize);

      if (isSmallScreen) {
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('touchmove', handleTouchMove);
      document.body.style.overflow = '';
    };
  }, [isOpen, isSmallScreen]);

  // Calculate position when dropdown opens
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const sidebarWidth = 208; // w-52 = 208px
      const calendarWidth = 320; // approximate calendar width
      const padding = 32; // total padding (16px each side)
      const optimalWidth = sidebarWidth + calendarWidth + padding;
      const margin = 16; // margin from viewport edge
      const smallScreen = viewportWidth < 768; // mobile breakpoint

      setIsSmallScreen(smallScreen);

      let left: string | number = 0;
      let right: string | number = 'auto';

      if (smallScreen) {
        // On small screens, center the dropdown with margins and make it scrollable
        left = margin;
        right = margin;
        const maxHeight = window.innerHeight - triggerRect.bottom - margin * 2;
        setDropdownStyle({
          left,
          right,
          width: 'auto',
          maxWidth: `${viewportWidth - 2 * margin}px`,
          maxHeight: `${Math.max(400, maxHeight)}px`,
          overflowY: 'auto',
        });
      } else {
        // Check if dropdown would overflow on the right
        if (triggerRect.left + optimalWidth > viewportWidth - margin) {
          // Position from the right edge
          right = margin;
          left = 'auto';
        } else {
          // Position from the left, but ensure it doesn't go beyond left edge
          left = Math.max(margin - triggerRect.left, 0);
        }

        setDropdownStyle({
          left,
          right,
          width: 'fit-content',
          maxWidth: `${viewportWidth - 2 * margin}px`,
        });
      }
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </label>
      )}

      {/* Input Field */}
      <button
        ref={triggerRef}
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${fieldState.error
          ? 'border-red-500 focus:ring-red-500'
          : darkMode
            ? 'border-gray-600 focus:ring-primary-500 bg-gray-800 text-gray-300'
            : 'border-gray-300 focus:ring-primary-500 bg-white text-gray-800'}`}
      >
        <span className={formatDateRange(dateRange) ? '' : darkMode ? 'text-gray-500' : 'text-gray-600'}>
          {formatDateRange(dateRange) || placeholder}
        </span>
        <Calendar className='w-5 h-5' />
      </button>

      {fieldState.error && (
        <span className='text-xs text-red-500 mt-1 block'>
          {fieldState.error.message}
        </span>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div
          className={clsx(
            'scrollbar-sm absolute top-full mt-2 z-50 rounded-lg shadow-lg border',
            darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300',
          )}
          style={dropdownStyle}
        >
          <div className={isSmallScreen ? 'flex flex-col' : 'flex w-fit'}>
            {/* Presets Sidebar */}
            <div className={clsx(
              'p-4',
              darkMode ? 'border-gray-600' : 'border-gray-200',
              isSmallScreen ? 'w-full border-b' : 'w-52 border-r flex-shrink-0',
            )}
            >
              <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Quick Select
              </h4>
              <div className='space-y-1'>
                {presets().map((preset) => {
                  const activePreset = getActivePreset();
                  const isActive = activePreset === preset.label;

                  return (
                    <button
                      key={preset.label}
                      type='button'
                      onClick={() => {
                        handlePresetClick(preset);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${isActive
                        ? 'bg-primary-500 text-white'
                        : darkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
                {getActivePreset() === 'Custom' && (
                  <div className='px-3 py-2 text-sm rounded bg-primary-500 text-white'>
                    Custom
                  </div>
                )}
              </div>
            </div>

            {/* Date Picker */}
            <div className={`${isSmallScreen ? 'w-full' : 'w-fit flex-shrink-0'} p-4`}>
              <div className={darkMode ? 'rmdp-dark' : ''}>
                <RMDPCalendar
                  {...pickerConfig}
                  value={currentValues}
                  onChange={handleDateChange}
                  className='block'
                  mapDays={({ date }) => ({
                    disabled: date.toDate() > new Date(),
                  })}
                />
              </div>

              {/* Apply Button */}
              <div className={clsx(
                'mt-4 pt-4 border-t',
                isSmallScreen ? 'pb-4' : '',
                darkMode ? 'border-gray-600' : 'border-gray-200',
              )}
              >
                <button
                  type='button'
                  onClick={() => {
                    handleApply();
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${darkMode
                    ? 'bg-primary-500 hover:bg-primary-600 text-white'
                    : 'bg-primary-500 hover:bg-primary-600 text-white'}`}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default DateRangePicker;
