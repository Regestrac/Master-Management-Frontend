import { Flame, Clock, Play, Pause, Settings, Calendar, BarChart3 } from 'lucide-react';
import clsx from 'clsx';

export default function GoalCard({
  goal,
  view,
  darkMode,
  isSelected,
  isExpanded,
  isActive,
  onToggleSelection,
  onToggleExpanded,
  onToggleTimer,
}: {
  goal: any
  view: 'grid' | 'list'
  darkMode: boolean
  isSelected: boolean
  isExpanded: boolean
  isActive: boolean
  onToggleSelection: () => void
  onToggleExpanded?: () => void
  onToggleTimer: () => void
}) {
  const bgColor = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textColor = darkMode ? 'text-gray-400' : 'text-gray-600';

  const getWeeklyProgress = () => ((goal.currentWeekHours / goal.weeklyTarget) * 100) > 100 ? 100 : ((goal.currentWeekHours / goal.weeklyTarget) * 100);

  const renderProgressBar = () => (
    <div className={clsx('w-full rounded-full h-2', darkMode ? 'bg-gray-700' : 'bg-gray-200')}>
      <div
        className='bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500'
        style={{ width: `${getWeeklyProgress()}%` }}
      />
    </div>
  );

  const renderStats = () => (
    <div className='flex items-center gap-6 text-sm flex-wrap'>
      <div className='flex items-center'>
        <BarChart3 className='w-4 h-4 mr-1' />
        <span>
          {goal.progress}
          % complete
        </span>
      </div>
      <div className='flex items-center text-orange-500'>
        <Flame className='w-4 h-4 mr-1' />
        <span>
          {goal.streak}
          {' '}
          day streak
        </span>
      </div>
      <div className='flex items-center'>
        <Clock className='w-4 h-4 mr-1' />
        <span>
          {goal.totalTime}
          {' '}
          total
        </span>
      </div>
      <div className='flex items-center'>
        <Calendar className='w-4 h-4 mr-1' />
        <span>
          Due
          {new Date(goal.targetDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className='flex items-center space-x-3'>
      <input
        type='checkbox'
        checked={isSelected}
        onChange={onToggleSelection}
        className='w-4 h-4 text-purple-600 rounded focus:ring-purple-500'
      />
      <div className={`w-3 h-3 rounded-full ${goal.categoryColor}`} />
    </div>
  );

  const renderTitle = () => (
    <div className='flex items-center gap-3 mb-2 flex-wrap'>
      <h4 className='font-semibold text-lg'>{goal.title}</h4>
      <span className={clsx('px-2 py-1 rounded text-xs font-medium', darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')}>
        {goal.category}
      </span>
      <span className={`px-2 py-1 rounded text-xs font-medium ${goal.statusColor}`}>
        {goal.status}
      </span>
    </div>
  );

  const renderTimerControls = () => (
    <button
      onClick={onToggleTimer}
      className={clsx(
        'p-2 rounded-lg transition-colors',
        isActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white',
      )}
    >
      {isActive ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4' />}
    </button>
  );

  // ----------------------------
  // List View Layout
  if (view === 'list') {
    return (
      <div className={clsx('rounded-xl border shadow-sm hover:shadow-md transition-all duration-200', bgColor)}>
        <div className='p-6 flex justify-between items-start'>
          <div className='flex items-center space-x-4 flex-1'>
            {renderHeader()}
            <div className='flex-1'>
              {renderTitle()}
              <p className={`text-sm mb-3 ${textColor}`}>{goal.description}</p>
              {renderStats()}
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='w-20 h-2 bg-gray-200 rounded-full overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500'
                style={{ width: `${goal.progress > 100 ? 100 : goal.progress}%` }}
              />
            </div>
            <span className='text-sm font-medium w-12 text-right'>
              {goal.progress}
              %
            </span>
            {renderTimerControls()}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------
  // Grid View Layout
  return (
    <div className={clsx('rounded-xl border shadow-sm hover:shadow-md transition-all duration-200', bgColor)}>
      <div className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          {renderHeader()}
          <button onClick={onToggleExpanded} className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <svg className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </button>
        </div>

        {renderTitle()}
        <p className={`text-sm mb-3 ${textColor}`}>{goal.description}</p>

        {/* Progress Circle */}
        <div className='flex justify-center my-4'>
          {/* SVG progress */}
          {/* Replace with component if needed */}
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 gap-4 mb-4 text-center'>
          <div>
            <div className='flex justify-center items-center text-orange-500 mb-1'>
              <Flame className='w-4 h-4 mr-1' />
              <span className='font-semibold'>{goal.streak}</span>
            </div>
            <p className={`text-xs ${textColor}`}>Day Streak</p>
          </div>
          <div>
            <div className='flex justify-center items-center mb-1'>
              <Clock className='w-4 h-4 mr-1' />
              <span className='font-semibold'>{goal.totalTime}</span>
            </div>
            <p className={`text-xs ${textColor}`}>Total Time</p>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className='mb-4'>
          <div className='flex justify-between text-sm mb-1'>
            <span>This Week</span>
            <span>
              {goal.currentWeekHours}
              h /
              {' '}
              {goal.weeklyTarget}
              h
            </span>
          </div>
          {renderProgressBar()}
        </div>

        {/* Action Buttons */}
        <div className='flex gap-2 mt-4'>
          <button
            onClick={onToggleTimer}
            className={clsx('flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors', isActive
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white')}
          >
            {isActive ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4' />}
            {isActive ? 'Stop' : 'Start'}
          </button>
          <button className={clsx('px-3 py-2 rounded-lg border transition-colors', darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50')}>
            <Settings className='w-4 h-4' />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className={`border-t px-6 py-4 ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
          {/* Milestones, Timeline, Notes, Achievements */}
        </div>
      )}
    </div>
  );
}
