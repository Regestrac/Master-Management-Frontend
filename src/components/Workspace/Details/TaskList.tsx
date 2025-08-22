import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';

import { Task } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';
import useWorkspaceStore from 'stores/workspaceStore';

import { getWorkspaceTasks } from 'services/workspace';
import { createTask } from 'services/tasks';

import { StatusBadge } from 'components/Workspace/Details/StatusBadge';
import { MemberAvatar } from 'components/Workspace/Details/MemberAvatar';

import { CreateForm } from './CreateForm';

const formatDueDate = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const darkMode = useProfileStore((s) => s.data.theme) === 'dark';
  const members = useWorkspaceStore((state) => state.members);

  const { id } = useParams();

  const shouldFetchTasksRef = useRef(true);

  const memberMap = useMemo(() => {
    return new Map(members.map((member) => [member.user_id, member]));
  }, [members]);

  const fetchTasks = useCallback(() => {
    if (id) {
      getWorkspaceTasks(id).then((res) => {
        setTasks(res.tasks);
      }).catch((err) => {
        toast.error(err?.error);
      });
    }
  }, [id]);

  useEffect(() => {
    if (shouldFetchTasksRef.current) {
      fetchTasks();
      shouldFetchTasksRef.current = false;
    }
  }, [fetchTasks]);

  const handleSubmit = useCallback((title: string) => {
    const payload = {
      title,
      status: 'todo' as const,
      time_spend: 0,
      type: 'task',
      workspace_id: Number(id),
    };
    createTask(payload).then(() => {
      fetchTasks();
    }).catch((err) => {
      toast.error(err?.error || 'Failed to create task');
    });
    setIsVisible(false);
  }, [fetchTasks, id]);

  if (tasks.length === 0) {
    return (
      <p className='text-gray-400 dark:text-gray-600'>No tasks yet.</p>
    );
  }

  return (
    <div id='tab-panel-tasks' role='tabpanel' aria-labelledby='tab-tasks'>
      <div className='flex items-center gap-2 mb-3'>
        <h3 className='text-sm font-medium opacity-80'>All tasks</h3>
        <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
          {tasks.length}
        </span>
        <div className='flex items-center justify-end gap-2 flex-1'>
          <button
            type='button'
            onClick={() => setIsVisible(true)}
            className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded border transition border-gray-200 text-emerald-700 hover:bg-gray-100 dark:border-gray-700 dark:text-emerald-300 dark:hover:bg-gray-750'
            title='Create task'
          >
            <Plus className='w-3 h-3' />
            New
          </button>
        </div>
      </div>
      <ul className='space-y-3'>
        {isVisible && (
          <CreateForm
            onSubmit={handleSubmit}
            onCancle={() => setIsVisible(false)}
            placeholder='Task title'
          />
        )}
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
              {task?.assignees?.map((userId) => {
                const member = memberMap.get(userId);
                if (!member) {
                  return null;
                }
                return (
                  <MemberAvatar
                    color={member.profile_color}
                    key={`assignee-${task.id}-${userId}`}
                    member={member}
                    size='sm'
                    className='border-gray-700 dark:border-white'
                  />
                );
              })}
            </div>

            <span className='text-xs whitespace-nowrap text-gray-600 dark:text-gray-300'>
              {formatDueDate(task.due_date)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
