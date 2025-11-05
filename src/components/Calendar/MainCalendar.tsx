import { CheckSquare, Clock, Play, Plus, Target, User } from 'lucide-react';
import clsx from 'clsx';

import { useSettingsStore } from 'stores/settingsStore';

const MainCalendar = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div className='lg:col-span-3'>
      <div className={clsx(
        'rounded-xl border shadow-sm overflow-hidden',
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
      )}
      >
        {/* Calendar Header */}
        <div className={clsx(
          'px-6 py-4 border-b flex items-center justify-between',
          darkMode ? 'border-gray-700' : 'border-gray-200',
        )}
        >
          <div className='flex items-center space-x-4'>
            <button className={clsx(
              'p-2 rounded-lg transition-colors',
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
            )}
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>
            <h3 className='text-xl font-bold'>June 2025</h3>
            <button className={clsx(
              'p-2 rounded-lg transition-colors',
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
            )}
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </button>
          </div>
          <button className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm'>
            Today
          </button>
        </div>

        {/* Calendar Grid */}
        <div className='p-6'>
          {/* Days of Week Header */}
          <div className='grid grid-cols-7 gap-4 mb-4'>
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
              <div
                key={day}
                className={clsx(
                  'py-3 text-center font-medium',
                  darkMode ? 'text-gray-400' : 'text-gray-600',
                )}
              >
                {day.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className='grid grid-cols-7 gap-4'>
            {Array.from({ length: 35 }, (_, i) => {
              const dayNumber = i - 5; // Start from May 26
              const isCurrentMonth = dayNumber > 0 && dayNumber <= 30;
              const isToday = dayNumber === 27;
              const isWeekend = i % 7 === 0 || i % 7 === 6;

              // Sample events for different days
              const dayEvents = {
                15: [
                  { title: 'Team Meeting', time: '10:00', color: '#10B981', type: 'meeting' },
                ],
                18: [
                  { title: 'Code Review', time: '14:00', color: '#8B5CF6', type: 'task' },
                  { title: 'Client Call', time: '16:00', color: '#10B981', type: 'meeting' },
                ],
                22: [
                  { title: 'Project Deadline', time: '23:59', color: '#F59E0B', type: 'deadline' },
                ],
                27: [
                  { title: 'Design Review', time: '14:00', color: '#10B981', type: 'meeting' },
                  { title: 'Learning Session', time: '16:00', color: '#06B6D4', type: 'goal' },
                  { title: 'Workout', time: '18:00', color: '#EF4444', type: 'personal' },
                ],
                29: [
                  { title: 'Sprint Planning', time: '09:00', color: '#10B981', type: 'meeting' },
                  { title: 'Portfolio Work', time: '15:00', color: '#06B6D4', type: 'goal' },
                ],
              };

              const events = dayEvents[dayNumber as keyof typeof dayEvents] || [];

              return (
                <div
                  key={i}
                  className={clsx(
                    'min-h-32 p-2 border rounded-lg transition-all hover:shadow-md cursor-pointer',
                    isToday && [darkMode ? 'bg-primary-900/20' : 'bg-primary-50', 'border-primary-500'],
                    !isToday && isCurrentMonth && [
                      darkMode ? 'border-gray-700 bg-gray-750 hover:bg-gray-700' : 'border-gray-200 bg-white hover:bg-gray-50',
                    ],
                    !isToday && !isCurrentMonth && [
                      darkMode ? 'border-gray-800 bg-gray-800' : 'border-gray-100 bg-gray-50',
                    ],
                    isWeekend && 'opacity-75',
                  )}
                >
                  <div className='flex items-center justify-between mb-2'>
                    <span className={clsx(
                      'text-sm font-medium',
                      isToday && 'text-primary-600',
                      !isToday && !isCurrentMonth && [
                        darkMode ? 'text-gray-600' : 'text-gray-400',
                      ],
                    )}
                    >
                      {dayNumber > 0 ? (dayNumber <= 30 ? dayNumber : dayNumber - 30) : 26 + dayNumber}
                    </span>
                    {events.length > 0 && (
                      <span className={clsx(
                        'text-xs px-1 py-0.5 rounded',
                        darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600',
                      )}
                      >
                        {events.length}
                      </span>
                    )}
                  </div>

                  <div className='space-y-1'>
                    {events.slice(0, 3).map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className='text-xs p-1 rounded truncate'
                        style={{
                          backgroundColor: `${event.color}20`,
                          borderLeft: `3px solid ${event.color}`,
                        }}
                      >
                        <div className='flex items-center space-x-1'>
                          <span className='font-medium' style={{ color: event.color }}>
                            {event.time}
                          </span>
                          <span className='truncate'>{event.title}</span>
                        </div>
                      </div>
                    ))}
                    {events.length > 3 && (
                      <div className={clsx(
                        'text-xs p-1 rounded',
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600',
                      )}
                      >
                        +
                        {events.length - 3}
                        {' '}
                        more
                      </div>
                    )}
                  </div>

                  {/* Add Event Button */}
                  <button className='w-full mt-2 py-1 text-xs opacity-0 hover:opacity-100 transition-opacity border-2 border-dashed border-gray-300 rounded hover:border-primary-500'>
                    <Plus className='w-3 h-3 mx-auto' />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className={clsx(
        'rounded-xl p-6 border shadow-sm mt-6',
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
      )}
      >
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h4 className='text-xl font-bold mb-1'>Today's Schedule</h4>
            <p className={clsx(
              'text-sm',
              darkMode ? 'text-gray-400' : 'text-gray-600',
            )}
            >
              Thursday, June 27, 2025 • 3 events
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='flex items-center space-x-1 text-sm'>
              <div className='w-2 h-2 bg-green-500 rounded-full' />
              <span className={clsx(darkMode ? 'text-gray-300' : 'text-gray-700')}>Available</span>
            </div>
            <button className='p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors'>
              <Clock className='w-4 h-4' />
            </button>
          </div>
        </div>

        {/* Time Blocks */}
        <div className='space-y-4'>
          {/* Morning Block */}
          <div className='relative'>
            <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full' />
            <div className='ml-6'>
              <div className='flex items-center justify-between mb-3'>
                <h5 className='font-semibold text-blue-600'>Morning Focus Block</h5>
                <span className='text-sm text-gray-500'>9:00 AM - 12:00 PM</span>
              </div>
              <div className='space-y-2'>
                <div className={clsx(
                  'flex items-center justify-between p-3 rounded-lg border',
                  darkMode
                    ? 'bg-blue-900/20 border-blue-800'
                    : 'bg-blue-50 border-blue-200',
                )}
                >
                  <div className='flex items-center space-x-3'>
                    <div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center'>
                      <CheckSquare className='w-4 h-4 text-white' />
                    </div>
                    <div>
                      <h6 className='font-medium'>Design System Update</h6>
                      <p className={clsx('text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')}>
                        High priority task
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded'>2.5h</span>
                    <button
                      className={clsx(
                        'p-1 rounded',
                        darkMode ? 'hover:bg-blue-800' : 'hover:bg-blue-100',
                      )}
                    >
                      <Play className='w-4 h-4 text-blue-600' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Afternoon Block */}
          <div className='relative'>
            <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-green-600 rounded-full' />
            <div className='ml-6'>
              <div className='flex items-center justify-between mb-3'>
                <h5 className='font-semibold text-green-600'>Collaboration Block</h5>
                <span className='text-sm text-gray-500'>2:00 PM - 4:00 PM</span>
              </div>
              <div className='space-y-2'>
                <div className={clsx(
                  'flex items-center justify-between p-3 rounded-lg border',
                  darkMode
                    ? 'bg-green-900/20 border-green-800'
                    : 'bg-green-50 border-green-200',
                )}
                >
                  <div className='flex items-center space-x-3'>
                    <div className='w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center'>
                      <User className='w-4 h-4 text-white' />
                    </div>
                    <div>
                      <h6 className='font-medium'>Design Review Meeting</h6>
                      <p className={clsx('text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')}>
                        With Sarah, Mike, and Alex
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm bg-green-100 text-green-600 px-2 py-1 rounded'>1h</span>
                    <button className={clsx(
                      'p-1 rounded',
                      darkMode ? 'hover:bg-green-800' : 'hover:bg-green-100',
                    )}
                    >
                      <svg className='w-4 h-4 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evening Block */}
          <div className='relative'>
            <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full' />
            <div className='ml-6'>
              <div className='flex items-center justify-between mb-3'>
                <h5 className='font-semibold text-purple-600'>Learning Block</h5>
                <span className='text-sm text-gray-500'>4:00 PM - 6:00 PM</span>
              </div>
              <div className='space-y-2'>
                <div className={clsx(
                  'flex items-center justify-between p-3 rounded-lg border',
                  darkMode
                    ? 'bg-purple-900/20 border-purple-800'
                    : 'bg-purple-50 border-purple-200',
                )}
                >
                  <div className='flex items-center space-x-3'>
                    <div className='w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center'>
                      <Target className='w-4 h-4 text-white' />
                    </div>
                    <div>
                      <h6 className='font-medium'>React Advanced Patterns</h6>
                      <p className={clsx('text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')}>
                        Goal progress session
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm bg-purple-100 text-purple-600 px-2 py-1 rounded'>2h</span>
                    <button className={clsx(
                      'p-1 rounded',
                      darkMode ? 'hover:bg-purple-800' : 'hover:bg-purple-100',
                    )}
                    >
                      <Play className='w-4 h-4 text-purple-600' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Free Time */}
          <div className='relative'>
            <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full' />
            <div className='ml-6'>
              <div className='flex items-center justify-between mb-3'>
                <h5 className='font-semibold text-gray-600'>Free Time</h5>
                <span className='text-sm text-gray-500'>6:00 PM - 9:00 PM</span>
              </div>
              <div className={clsx(
                'p-3 rounded-lg border-2 border-dashed',
                darkMode ? 'border-gray-600' : 'border-gray-300',
              )}
              >
                <div className='text-center'>
                  <p className='text-sm text-gray-500 mb-2'>Available for scheduling</p>
                  <button className='text-primary-500 hover:text-primary-600 text-sm font-medium'>
                    + Schedule Something
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Actions */}
        <div className={clsx(
          'flex items-center justify-between mt-6 pt-6 border-t flex-wrap gap-6',
          darkMode ? 'border-gray-700' : 'border-gray-200',
        )}
        >
          <div className='flex items-center space-x-4 text-sm'>
            <div className='flex items-center space-x-2'>
              <Clock className='w-4 h-4 text-blue-500' />
              <span>6.5h scheduled</span>
            </div>
            <div className='flex items-center space-x-2'>
              <Target className='w-4 h-4 text-green-500' />
              <span>3h on goals</span>
            </div>
            <div className='flex items-center space-x-2'>
              <User className='w-4 h-4 text-purple-500' />
              <span>1 meeting</span>
            </div>
          </div>
          <div className='flex space-x-2'>
            <button
              className={clsx(
                'px-4 py-2 border rounded-lg transition-colors text-sm',
                darkMode
                  ? 'border-gray-600 hover:bg-gray-700'
                  : 'border-gray-300 hover:bg-gray-50',
              )}
            >
              Reschedule
            </button>
            <button className='px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm'>
              Optimize Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCalendar;