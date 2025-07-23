import { Flame, Clock, Play, Pause, Settings, Calendar, BarChart3, Trophy } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { useTaskStore } from 'stores/taskStore';
import { useProfileStore } from 'stores/profileStore';
import { updateTask } from 'services/tasks';

import { STATUS_OPTIONS } from 'helpers/configs';
import { getStatusColor } from 'helpers/utils';
import { TaskType } from 'helpers/sharedTypes';

import DropDown from 'components/Shared/Dropdown';
import ProgressCircle from 'components/Goals/ProgressCircle';

type GoalCardPropsType = {
  goal: any;
  view: 'grid' | 'list';
  isActive: boolean;
};

const GoalCard = ({ goal, view, isActive }: GoalCardPropsType) => {
  const darkMode = useProfileStore((state) => state.data.theme) === 'dark';

  const bgColor = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textColor = darkMode ? 'text-gray-400' : 'text-gray-600';

  const updateTaskState = useTaskStore((state) => state.updateTask);

  const handleUpdateTask = (id: string, payload: object) => {
    updateTask(id, payload).then((res) => {
      toast.success(res?.message || 'Updated successfully');
    }).catch((err) => {
      toast.error(err?.error || 'Failed to update task');
    });
  };

  const onToggleTimer = () => {

  };

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

  const renderHeader = () => {
    const handleStatusSelect = (value: string | null) => {
      if (goal?.status !== value) {
        handleUpdateTask(goal?.id?.toString(), { status: value });
        updateTaskState({ id: goal?.id, status: value as TaskType['status'] });
      }
    };

    return (
      <DropDown options={STATUS_OPTIONS} onSelect={handleStatusSelect} value={goal.status} hideClear>
        <span className={`px-3 py-1 rounded-full text-sm font-medium cursor-grab ${getStatusColor(goal.status)}`}>
          {goal?.status?.toUpperCase()}
        </span>
      </DropDown>
    );
  };

  const renderTitle = () => {
    const handleStatusSelect = (value: string | null) => {
      if (goal?.status !== value) {
        handleUpdateTask(goal?.id?.toString(), { status: value });
        updateTaskState({ id: goal?.id, status: value as TaskType['status'] });
      }
    };

    return (
      <div className='flex items-center gap-3 mb-2 flex-wrap'>
        <h4 className='font-semibold text-lg'>{goal.title}</h4>
        <span className={clsx('px-2 py-1 rounded text-xs font-medium', darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')}>
          {goal.category}
        </span>
        <DropDown options={STATUS_OPTIONS} onSelect={handleStatusSelect} value={goal.status} hideClear>
          <span className={`px-3 py-1 rounded-full text-xs font-medium cursor-grab ${getStatusColor(goal.status)}`}>
            {goal?.status?.toUpperCase()}
          </span>
        </DropDown>
      </div>
    );
  };

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
        {/* <div className='flex items-start justify-between mb-4'>
          {renderHeader()}
          <button onClick={onToggleExpanded} className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <svg className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </button>
        </div> */}

        {renderTitle()}
        <p className={`text-sm mb-3 ${textColor}`}>{goal.description}</p>

        <ProgressCircle progress={goal.progress} />

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

        {/* Tags */}
        <div className='flex flex-wrap gap-1 mb-4'>
          {goal.tags.slice(0, 3).map((tag: string, index: number) => (
            <span key={index} className='px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs'>
              #
              {tag}
            </span>
          ))}
          {goal.tags.length > 3 && (
            <span className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
              +
              {goal.tags.length - 3}
            </span>
          )}
        </div>

        {/* Achievements */}
        {goal.achievements.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {goal.achievements.slice(0, 2).map((achievement: string, index: number) => (
              <span key={index} className='inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-600 rounded text-xs'>
                <Trophy className='w-3 h-3 mr-1' />
                {achievement}
              </span>
            ))}
            {goal.achievements.length > 2 && (
              <span className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                +
                {goal.achievements.length - 2}
              </span>
            )}
          </div>
        )}

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
    </div>
  );
};

export default GoalCard;
