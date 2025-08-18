import { memo, useMemo } from 'react';

import clsx from 'clsx';

import { Task, Member } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';

import { StatusBadge } from 'components/Workspace/Details/StatusBadge';
import { MemberAvatar } from 'components/Workspace/Details/MemberAvatar';

type TaskListProps = {
  tasks: Task[];
  members: Member[];
};

const formatDueDate = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export const TaskList = memo(({ tasks, members }: TaskListProps) => {
  const darkMode = useProfileStore((s) => s.data.theme) === 'dark';
  const memberMap = useMemo(() => {
    return new Map(members.map((member) => [member.id, member]));
  }, [members]);

  if (tasks.length === 0) {
    return (
      <p className='text-gray-400 dark:text-gray-600'>No tasks yet.</p>
    );
  }

  return (
    <ul className='space-y-3'>
      {tasks.map((task) => (
        <li
          key={task.id}
          className={clsx(
            'group flex items-center gap-4 rounded-lg border px-4 py-3 shadow-sm hover:shadow transition',
            darkMode ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-gray-50 hover:bg-gray-100',
          )}
        >
          <div className='flex items-center gap-3 min-w-0 flex-1'>
            <div className='w-32 shrink-0'>
              <StatusBadge status={task.status} variant='task' />
            </div>
            <span className='font-medium truncate'>{task.title}</span>
          </div>

          <div className='flex items-center -space-x-2'>
            {task.assignees.map((userId, idx) => {
              const member = memberMap.get(userId);
              if (!member) {
                return null;
              }
              return (
                <MemberAvatar
                  key={`assignee-${task.id}-${userId}-${idx}`}
                  member={member}
                  size='sm'
                  className='border-gray-700 dark:border-white'
                />
              );
            })}
          </div>

          <span className='text-xs whitespace-nowrap text-gray-600 dark:text-gray-300'>
            {formatDueDate(task.dueDate)}
          </span>
        </li>
      ))}
    </ul>
  );
});

TaskList.displayName = 'TaskList';
