import { useState, useRef, useEffect } from 'react';

import { useController } from 'react-hook-form';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

import { useProfileStore } from '../../stores/profileStore';

export type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

type DateRangePickerProps = {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  onChange?: (_dateRange: DateRange) => void;
  onApply?: (_dateRange: DateRange) => void;
};

const DateRangePicker = ({
  name,
  label,
  placeholder = 'Select date range',
  className = '',
  onChange,
  onApply,
}: DateRangePickerProps) => {
  const darkMode = useProfileStore((state) => state.data?.theme) === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top?: number; left: number; right?: number; width: number; maxHeight: number }>({ left: 0, top: 0, width: 600, maxHeight: 480 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { field, fieldState } = useController({
    name,
    defaultValue: {
      startDate: null,
      endDate: null,
    },
  });

  const dateRange: DateRange = field.value || {
    startDate: null,
    endDate: null,
  };

  const presets = [
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
        sevenDaysAgo.setDate(today.getDate() - 7);
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

  const calculatePosition = () => {
    if (!triggerRef.current) {
      return;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    // Responsive sizing based on viewport
    const viewportPadding = 8; // keep some margin from viewport edges
    const maxPossibleWidth = Math.min(600, window.innerWidth - viewportPadding * 2);
    const dropdownWidth = Math.max(280, maxPossibleWidth); // keep a sensible minimum width
    const dropdownHeight = Math.min(520, window.innerHeight - viewportPadding * 2); // max visible height
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    // NOTE: For position: fixed, use viewport coordinates directly from getBoundingClientRect.
    // Do NOT add page scroll offsets, otherwise the panel will drift while scrolling.

    let top: number | undefined;
    let left = triggerRect.left;
    let right: number | undefined;

    // Check if dropdown fits below the trigger
    if (triggerRect.bottom + dropdownHeight <= viewportHeight) {
      top = Math.min(triggerRect.bottom + 8, viewportHeight - dropdownHeight - 8);
    } else {
      // Position above the trigger when there's not enough space below
      top = Math.max(8, triggerRect.top - dropdownHeight - 8);
    }

    // Check if dropdown fits to the right
    if (triggerRect.left + dropdownWidth > viewportWidth) {
      // Position to the left
      right = viewportWidth - triggerRect.right;
      // Also clamp left within viewport
      left = Math.max(8, viewportWidth - dropdownWidth - 8);
    }

    // Clamp within viewport horizontally if still overflowing
    if ((left as number) + dropdownWidth > viewportWidth - 8) {
      left = Math.max(8, viewportWidth - dropdownWidth - 8);
    }
    if ((left as number) < 8) {
      left = 8;
    }

    setDropdownPosition({ top: top ?? 8, left: left as number, right, width: dropdownWidth, maxHeight: dropdownHeight });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        calculatePosition();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        calculatePosition();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      calculatePosition();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const formatDateRange = (range: DateRange): React.ReactNode => {
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
          <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20'>
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
            <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20'>
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
            <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20'>
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
  };

  // Function to check if current date range matches a preset
  const getActivePreset = () => {
    // Handle 'All Time' case first
    if (dateRange.startDate === null && dateRange.endDate === null) {
      return 'All Time';
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      return 'Custom';
    }

    for (const preset of presets) {
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
  };

  const handlePresetClick = (preset: typeof presets[0]) => {
    const newRange = preset.getValue();
    field.onChange(newRange);
    if (onChange) {
      onChange(newRange);
    }
  };

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

  const handleApply = () => {
    let finalRange = { ...dateRange };

    // If only one date is selected, use it for both start and end
    if (finalRange.startDate && !finalRange.endDate) {
      finalRange = {
        startDate: finalRange.startDate,
        endDate: finalRange.startDate,
      };
    } else if (!finalRange.startDate && finalRange.endDate) {
      finalRange = {
        startDate: finalRange.endDate,
        endDate: finalRange.endDate,
      };
    }

    // Update the field value
    field.onChange(finalRange);

    if (onApply) {
      onApply(finalRange);
    }

    setIsOpen(false);
  };

  const handleDateClick = (date: Date) => {
    // Disable future dates
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    if (date > today) {
      return;
    }

    const newRange = { ...dateRange };

    // If we're in 'All Time' mode, clear the selection and start new
    if (newRange.startDate === null && newRange.endDate === null) {
      newRange.startDate = date;
      newRange.endDate = null;
    } else if (!newRange.startDate || (newRange.startDate && newRange.endDate)) {
      // Start new selection
      newRange.startDate = date;
      newRange.endDate = null;
    } else if (newRange.startDate && !newRange.endDate) {
      // Complete selection
      if (date < newRange.startDate) {
        newRange.endDate = newRange.startDate;
        newRange.startDate = date;
      } else {
        newRange.endDate = date;
      }
    }

    field.onChange(newRange);
    if (onChange) {
      onChange(newRange);
    }
  };

  const isDateInRange = (date: Date) => {
    // If in 'All Time' mode, no dates should appear as selected
    if (dateRange.startDate === null && dateRange.endDate === null) {
      return false;
    }

    if (!dateRange.startDate) {
      return false;
    }

    const endDate = hoveredDate && !dateRange.endDate ? hoveredDate : dateRange.endDate;
    if (!endDate) {
      return date.toDateString() === dateRange.startDate.toDateString();
    }

    const start = dateRange.startDate < endDate ? dateRange.startDate : endDate;
    const end = dateRange.startDate < endDate ? endDate : dateRange.startDate;

    return date >= start && date <= end;
  };

  const isDateSelected = (date: Date) => {
    // In 'All Time' mode, no dates should appear as selected
    if (dateRange.startDate === null && dateRange.endDate === null) {
      return false;
    }

    return (dateRange.startDate && date.toDateString() === dateRange.startDate.toDateString()) ||
      (dateRange.endDate && date.toDateString() === dateRange.endDate.toDateString());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date > today;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </label>
      )}

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
        <span className='text-xs text-red-500 mt-1'>
          {fieldState.error.message}
        </span>
      )}

      {isOpen && (
        <div
          className={`fixed z-50 rounded-lg shadow-lg border ${darkMode
            ? 'bg-gray-800 border-gray-600'
            : 'bg-white border-gray-300'}`}
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            right: dropdownPosition.right,
            width: dropdownPosition.width,
            maxHeight: dropdownPosition.maxHeight,
          }}
        >
          <div className='flex' style={{ maxHeight: dropdownPosition.maxHeight }}>
            {/* Presets sidebar */}
            {dropdownPosition.width >= 520 && (
              <div className={`w-48 p-4 border-r overflow-auto ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Quick Select
                </h4>
                <div className='space-y-1'>
                  {presets.map((preset) => {
                    const activePreset = getActivePreset();
                    const isActive = activePreset === preset.label;

                    return (
                      <button
                        key={preset.label}
                        type='button'
                        onClick={() => handlePresetClick(preset)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${isActive
                          ? darkMode
                            ? 'bg-primary-500 text-white'
                            : 'bg-primary-500 text-white'
                          : darkMode
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                  {/* Custom option */}
                  {getActivePreset() === 'Custom' && (
                    <div
                      className={`px-3 py-2 text-sm rounded-md ${darkMode
                        ? 'bg-primary-500 text-white'
                        : 'bg-primary-500 text-white'}`}
                    >
                      Custom
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Calendar */}
            <div className='flex-1 p-4 overflow-auto' style={{ maxHeight: dropdownPosition.maxHeight }}>
              <div className='flex items-center justify-between mb-4'>
                <button
                  type='button'
                  onClick={() => navigateMonth('prev')}
                  className={`p-2 rounded-md transition-colors ${darkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  <ChevronLeft className='w-5 h-5' />
                </button>

                <button
                  type='button'
                  onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}
                  className={`text-lg font-semibold hover:bg-opacity-10 hover:bg-gray-500 px-2 py-1 rounded transition-colors ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                >
                  {monthNames[currentMonth.getMonth()]}
                  {' '}
                  {currentMonth.getFullYear()}
                </button>

                <button
                  type='button'
                  onClick={() => navigateMonth('next')}
                  className={`p-2 rounded-md transition-colors ${darkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  <ChevronRight className='w-5 h-5' />
                </button>
              </div>

              {/* Day headers */}
              <div className='grid grid-cols-7 gap-1 mb-2'>
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className={`text-center text-sm font-medium py-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className='grid grid-cols-7 gap-1'>
                {getDaysInMonth(currentMonth).map((date, index) => (
                  <div key={index} className='aspect-square'>
                    {date && (
                      <button
                        type='button'
                        onClick={() => handleDateClick(date)}
                        onMouseEnter={() => setHoveredDate(date)}
                        onMouseLeave={() => setHoveredDate(null)}
                        disabled={isFutureDate(date)}
                        className={`w-full h-full rounded-md text-sm transition-colors ${isFutureDate(date)
                          ? 'text-gray-400 cursor-not-allowed opacity-50'
                          : isDateSelected(date)
                            ? 'bg-primary-500 text-white'
                            : isDateInRange(date)
                              ? darkMode
                                ? 'bg-primary-500/30 text-gray-200'
                                : 'bg-primary-500/20 text-gray-800'
                              : isToday(date)
                                ? darkMode
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                                  : 'bg-blue-500/10 text-blue-600 border border-blue-500/30'
                                : darkMode
                                  ? 'text-gray-300 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {date.getDate()}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Month/Year Picker */}
              {showMonthYearPicker && (
                <div className={`absolute inset-0 bg-opacity-95 rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className='flex justify-between items-center mb-4'>
                    <h4 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Select Month & Year
                    </h4>
                    <button
                      type='button'
                      onClick={() => setShowMonthYearPicker(false)}
                      className={`p-1 rounded-md transition-colors ${darkMode
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                      ✕
                    </button>
                  </div>

                  <div className='grid grid-cols-3 gap-2 mb-4'>
                    {monthNames.map((month, index) => (
                      <button
                        key={month}
                        type='button'
                        onClick={() => {
                          setCurrentMonth(new Date(currentMonth.getFullYear(), index, 1));
                          setShowMonthYearPicker(false);
                        }}
                        className={`px-3 py-2 text-sm rounded-md transition-colors ${currentMonth.getMonth() === index
                          ? 'bg-primary-500 text-white'
                          : darkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {month.slice(0, 3)}
                      </button>
                    ))}
                  </div>

                  <div className='grid grid-cols-4 gap-2'>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() - 5 + i;
                      return (
                        <button
                          key={year}
                          type='button'
                          onClick={() => {
                            setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
                            setShowMonthYearPicker(false);
                          }}
                          className={`px-3 py-2 text-sm rounded-md transition-colors ${currentMonth.getFullYear() === year
                            ? 'bg-primary-500 text-white'
                            : darkMode
                              ? 'text-gray-300 hover:bg-gray-700'
                              : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          {year}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Apply Button */}
              <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <button
                  type='button'
                  onClick={handleApply}
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
};

export default DateRangePicker;
