import React, { memo, useCallback } from 'react';

import { ListChecks, Target } from 'lucide-react';

import { TabType, Task, Goal, Member } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';

import { CreateForm } from 'components/Workspace/Details/CreateForm';
import { TaskList } from 'components/Workspace/Details/TaskList';
import { GoalList } from 'components/Workspace/Details/GoalList';

interface WorkspaceTabsProps {
  activeTab: TabType;
  onTabChange: (_tab: TabType) => void;
  tasks: Task[];
  goals: Goal[];
  members: Member[];
  onTaskAdd: (_title: string) => void;
  onGoalAdd: (_title: string) => void;
}

export const WorkspaceTabs = memo(({
  activeTab,
  onTabChange,
  tasks,
  goals,
  members,
  onTaskAdd,
  onGoalAdd,
}: WorkspaceTabsProps) => {
  const theme = useProfileStore((s) => s.data.theme);
  const isDark = theme === 'dark';

  const handleTabKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      onTabChange(activeTab === 'tasks' ? 'goals' : 'tasks');
    }
  }, [activeTab, onTabChange]);

  const getTabClassName = (tab: TabType) => {
    const isActive = activeTab === tab;
    return `px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 transition border-b-2 ${isActive
      ? isDark
        ? 'text-white bg-gray-800 border-emerald-400 font-semibold'
        : 'text-gray-900 bg-white border-emerald-600 font-semibold'
      : isDark
        ? 'text-gray-300 hover:text-white border-transparent'
        : 'text-gray-600 hover:text-gray-900 border-transparent'}`;
  };

  const getCountBadgeClassName = () => {
    return `ml-2 inline-flex items-center justify-center min-w-5 h-5 rounded px-1 text-[11px] ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`;
  };

  return (
    <section className={`rounded-xl border overflow-hidden ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      <div role='tablist' aria-label='Workspace content' className={`flex items-center relative ${isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
        <button
          role='tab'
          aria-selected={activeTab === 'tasks'}
          aria-controls='tab-panel-tasks'
          id='tab-tasks'
          type='button'
          onClick={() => onTabChange('tasks')}
          onKeyDown={handleTabKeyDown}
          className={getTabClassName('tasks')}
        >
          <span className='inline-flex items-center gap-2'>
            <ListChecks className='w-4 h-4' />
            Tasks
            <span className={getCountBadgeClassName()}>
              {tasks.length}
            </span>
          </span>
        </button>

        <button
          role='tab'
          aria-selected={activeTab === 'goals'}
          aria-controls='tab-panel-goals'
          id='tab-goals'
          type='button'
          onClick={() => onTabChange('goals')}
          onKeyDown={handleTabKeyDown}
          className={getTabClassName('goals')}
        >
          <span className='inline-flex items-center gap-2'>
            <Target className='w-4 h-4' />
            Goals
            <span className={getCountBadgeClassName()}>
              {goals.length}
            </span>
          </span>
        </button>
        <div className='flex-1' />
      </div>

      <div className='p-6'>
        {activeTab === 'tasks' ? (
          <div id='tab-panel-tasks' role='tabpanel' aria-labelledby='tab-tasks'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-sm font-medium opacity-80'>All tasks</h3>
              <div className='flex items-center gap-2'>
                <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  {tasks.length}
                </span>
                <CreateForm
                  type='task'
                  onSubmit={onTaskAdd}
                  placeholder='Task title'
                />
              </div>
            </div>
            <TaskList tasks={tasks} members={members} />
          </div>
        ) : (
          <div id='tab-panel-goals' role='tabpanel' aria-labelledby='tab-goals'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-sm font-medium opacity-80'>All goals</h3>
              <div className='flex items-center gap-2'>
                <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  {goals.length}
                </span>
                <CreateForm
                  type='goal'
                  onSubmit={onGoalAdd}
                  placeholder='Goal title'
                />
              </div>
            </div>
            <GoalList goals={goals} />
          </div>
        )}
      </div>
    </section>
  );
});

WorkspaceTabs.displayName = 'WorkspaceTabs';
