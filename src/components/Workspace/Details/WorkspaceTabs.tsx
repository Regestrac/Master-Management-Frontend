import { ReactNode, useCallback, useState } from 'react';

import { ListChecks, Target } from 'lucide-react';

import { TabType } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';

type WorkspaceTabsProps = {
  taskList: ReactNode;
  goalList: ReactNode;
};

const WorkspaceTabs = ({ taskList, goalList }: WorkspaceTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('tasks');

  const isDark = useProfileStore((s) => s.data.theme) === 'dark';

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, [setActiveTab]);

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

  return (
    <section className={`rounded-xl border overflow-hidden ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      <div role='tablist' aria-label='Workspace content' className={`flex items-center relative ${isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
        <button
          role='tab'
          aria-selected={activeTab === 'tasks'}
          aria-controls='tab-panel-tasks'
          id='tab-tasks'
          type='button'
          onClick={() => handleTabChange('tasks')}
          className={getTabClassName('tasks')}
        >
          <span className='inline-flex items-center gap-2'>
            <ListChecks className='w-4 h-4' />
            Tasks
            {/* <span className={`ml-2 inline-flex items-center justify-center min-w-5 h-5 rounded px-1 text-[11px] ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              {taskCount}
            </span> */}
          </span>
        </button>

        <button
          role='tab'
          aria-selected={activeTab === 'goals'}
          aria-controls='tab-panel-goals'
          id='tab-goals'
          type='button'
          onClick={() => handleTabChange('goals')}
          className={getTabClassName('goals')}
        >
          <span className='inline-flex items-center gap-2'>
            <Target className='w-4 h-4' />
            Goals
            {/* <span className={`ml-2 inline-flex items-center justify-center min-w-5 h-5 rounded px-1 text-[11px] ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              {goalCount}
            </span> */}
          </span>
        </button>
        <div className='flex-1' />
      </div>

      <div className='p-6'>
        {activeTab === 'tasks' ? taskList : goalList}
      </div>
    </section>
  );
};

export default WorkspaceTabs;
