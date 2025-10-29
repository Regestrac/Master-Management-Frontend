import dayjs from 'dayjs';
import { CheckSquare, Edit3, History, MessageSquare, Plus, User } from 'lucide-react';
import clsx from 'clsx';

import { useSettingsStore } from 'stores/settingsStore';

const getActionIcon = (type: any) => {
  switch (type) {
    case 'created': return <Plus className='w-3 h-3' />;
    case 'updated': return <Edit3 className='w-3 h-3' />;
    case 'progress': return <CheckSquare className='w-3 h-3' />;
    case 'assignment': return <User className='w-3 h-3' />;
    case 'note': return <MessageSquare className='w-3 h-3' />;
    default: return <History className='w-3 h-3' />;
  }
};

const history = [
  {
    id: 1,
    action: 'Task created',
    user: 'Alex Johnson',
    timestamp: '2025-06-01T09:00:00Z',
    details: 'Initial task creation with basic requirements',
    type: 'created',
  },
  {
    id: 2,
    action: 'Description updated',
    user: 'Alex Johnson',
    timestamp: '2025-06-01T10:30:00Z',
    details: 'Added detailed specification and requirements',
    type: 'updated',
  },
  {
    id: 3,
    action: 'Assignee added',
    user: 'Alex Johnson',
    timestamp: '2025-06-02T14:20:00Z',
    details: 'Added Sarah Chen as collaborator',
    type: 'assignment',
  },
  {
    id: 4,
    action: 'Subtask completed',
    user: 'Sarah Chen',
    timestamp: '2025-06-08T16:45:00Z',
    details: "Completed 'Define color palette and tokens'",
    type: 'progress',
  },
  {
    id: 5,
    action: 'Priority changed',
    user: 'Alex Johnson',
    timestamp: '2025-06-10T09:15:00Z',
    details: 'Changed priority from Medium to High',
    type: 'updated',
  },
  {
    id: 6,
    action: 'Note added',
    user: 'Sarah Chen',
    timestamp: '2025-06-20T11:30:00Z',
    details: 'Added progress notes and next steps',
    type: 'note',
  },
];

const TaskActivity = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  return (
    <div
      className={clsx(
        'rounded-xl border transition-colors',
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
      )}
    >
      <div className={clsx('p-6 border-b', darkMode ? 'border-gray-700' : 'border-gray-200')}>
        <h3 className='text-lg font-semibold flex items-center'>
          <History className='w-5 h-5 mr-2' />
          Activity Log
        </h3>
      </div>
      <div className='p-6'>
        <div className='space-y-4'>
          {history.map((entry) => (
            <div
              key={entry.id}
              className={clsx(
                'flex space-x-4 p-4 rounded-lg border transition-colors',
                darkMode ? 'border-gray-700' : 'border-gray-200',
              )}
            >
              <div
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  entry.type === 'created' && [
                    darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600',
                  ],
                  entry.type === 'updated' && [
                    darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600',
                  ],
                  entry.type === 'progress' && [
                    darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600',
                  ],
                  entry.type === 'assignment' && [
                    darkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-600',
                  ],
                  !['created', 'updated', 'progress', 'assignment'].includes(entry.type) && [
                    darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600',
                  ],
                )}
              >
                {getActionIcon(entry.type)}
              </div>
              <div className='flex-1'>
                <div className='flex items-center space-x-2 mb-1'>
                  <p className='font-medium'>{entry.action}</p>
                  <span className={clsx('text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')}>
                    by
                    {' '}
                    {entry.user}
                  </span>
                </div>
                <p className={clsx('text-sm mb-2', darkMode ? 'text-gray-300' : 'text-gray-700')}>
                  {entry.details}
                </p>
                <p className='text-xs text-gray-500'>
                  {dayjs(entry.timestamp).format('MMM DD, hh:mm A')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskActivity;