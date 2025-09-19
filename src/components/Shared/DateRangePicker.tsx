import { useState, useRef, useEffect } from 'react';

import { useController } from 'react-hook-form';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

import { useProfileStore } from '../../stores/profileStore';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  onChange?: (_dateRange: DateRange) => void;
  onApply?: (_dateRange: DateRange) => void;
}

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
  const [dropdownPosition, setDropdownPosition] = useState<{ top?: number; bottom?: number; left: number; right?: number }>({ left: 0 });
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
      getValue: () => {
        const today = new Date();
        const allTimeStart = new Date(2020, 0, 1); // Assuming app started in 2020
        return {
          startDate: allTimeStart,
          endDate: today,
        };
      },
    },
  ];

  const calculatePosition = () => {
    if (!triggerRef.current) {
      return;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 400; // Approximate dropdown height
    const dropdownWidth = 600; // Original dropdown width
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top: number | undefined;
    let bottom: number | undefined;
    let left = triggerRect.left + scrollX;
    let right: number | undefined;

    // Check if dropdown fits below the trigger
    if (triggerRect.bottom + dropdownHeight <= viewportHeight) {
      top = triggerRect.bottom + scrollY + 8; // 8px gap
    } else {
      // Position above the trigger
      bottom = viewportHeight - triggerRect.top - scrollY + 8;
    }

    // Check if dropdown fits to the right
    if (triggerRect.left + dropdownWidth > viewportWidth) {
      // Position to the left
      right = viewportWidth - triggerRect.right - scrollX;
      left = undefined as any;
    }

    setDropdownPosition({ top, bottom, left, right });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      calculatePosition();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatDate = (date: Date | null) => {
    if (!date) {
      return '';
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateRange = (range: DateRange) => {
    if (!range.startDate && !range.endDate) {
      return '';
    }
    if (range.startDate && !range.endDate) {
      return formatDate(range.startDate);
    }
    if (!range.startDate && range.endDate) {
      return formatDate(range.endDate);
    }

    if (range.startDate && range.endDate) {
      if (range.startDate.toDateString() === range.endDate.toDateString()) {
        return formatDate(range.startDate);
      }
      return `${formatDate(range.startDate)} - ${formatDate(range.endDate)}`;
    }
    return '';
  };

  // Function to check if current date range matches a preset
  const getActivePreset = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return null;
    }

    for (const preset of presets) {
      const presetRange = preset.getValue();
      const isSameStart = dateRange.startDate.toDateString() === presetRange.startDate.toDateString();
      const isSameEnd = dateRange.endDate.toDateString() === presetRange.endDate.toDateString();

      if (isSameStart && isSameEnd) {
        return preset.label;
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

  const handleApply = () => {
    if (onApply) {
      onApply(dateRange);
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

    if (!newRange.startDate || (newRange.startDate && newRange.endDate)) {
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

    // Don't auto-close, let user click Apply button
  };

  const isDateInRange = (date: Date) => {
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
          className={`fixed z-50 rounded-lg shadow-lg border min-w-[600px] ${darkMode
            ? 'bg-gray-800 border-gray-600'
            : 'bg-white border-gray-300'}`}
          style={{
            top: dropdownPosition.top,
            bottom: dropdownPosition.bottom,
            left: dropdownPosition.left,
            right: dropdownPosition.right,
          }}
        >
          <div className='flex'>
            {/* Presets sidebar */}
            <div className={`w-48 p-4 border-r ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
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

            {/* Calendar */}
            <div className='flex-1 p-4'>
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
