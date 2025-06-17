import { useState } from 'react';

import TaskHistory from 'components/Tasks/TaskHistory';
import SubTasks from 'components/Tasks/SubTasks';
import TaskForm from 'components/Tasks/TaskForm';

type TabsType = 'history' | 'subtasks';

const TaskDetail = () => {
  const [activeTab, setActiveTab] = useState<TabsType>('subtasks');

  const getTabClassName = (tab: TabsType) => `px-3 py-2 font-medium text-sm ${activeTab === tab
    ? 'border-indigo-500 text-indigo-600'
    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`;

  return (
    <div className='p-8'>
      <div className='max-w-4xl mx-auto rounded-xl shadow-md p-6 space-y-6'>
        <TaskForm />
        <div>
          <div className='border-b border-gray-200'>
            <nav className='-mb-px flex space-x-4' aria-label='Tabs'>
              <button className={getTabClassName('subtasks')} onClick={() => setActiveTab('subtasks')}>
                SUBTASKS
              </button>
              <button className={getTabClassName('history')} onClick={() => setActiveTab('history')}>
                HISTORY
              </button>
            </nav>
          </div>
          <div className='mt-4'>
            {activeTab === 'subtasks' && <SubTasks />}
            {activeTab === 'history' && <TaskHistory />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;