import { useState } from 'react';

import TaskTimer from 'components/Tasks/TaskTimer';

import TaskHistory from './TaskHistory';
import SubTasks from './SubTasks';

const TaskDetail = () => {
  const [taskName, setTaskName] = useState('Task 1 - Do Something');
  const [description, setDescription] = useState('This task is about doing this, that and the other thing also');
  const [activeTab, setActiveTab] = useState<'history' | 'subtasks'>('history');

  const getTabClassName = (tab: 'history' | 'subtasks') => `px-3 py-2 font-medium text-sm ${activeTab === tab
    ? 'border-indigo-500 text-indigo-600'
    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`;

  return (
    <div className='p-8'>
      <div className='max-w-4xl mx-auto rounded-xl shadow-md p-6 space-y-6'>
        <div className='flex gap-3'>
          <div className='w-full'>
            <label className='block text-sm font-medium'>Task Name</label>
            <input
              type='text'
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className='mt-1 block w-full rounded-md border-amber-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
          </div>
          <TaskTimer />
        </div>
        <div>
          <label className='block text-sm font-medium'>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className='mt-1 block w-full rounded-md border-amber-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
          />
        </div>
        <div>
          <div className='border-b border-gray-200'>
            <nav className='-mb-px flex space-x-4' aria-label='Tabs'>
              <button className={getTabClassName('history')} onClick={() => setActiveTab('history')}>
                HISTORY
              </button>
              <button className={getTabClassName('subtasks')} onClick={() => setActiveTab('subtasks')}>
                SUBTASKS
              </button>
            </nav>
          </div>
          <div className='mt-4'>
            {activeTab === 'history' && <TaskHistory />}
            {activeTab === 'subtasks' && <SubTasks />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;