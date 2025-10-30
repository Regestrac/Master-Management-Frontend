import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, UserPlus } from 'lucide-react';

import { StatusType, Task } from 'helpers/sharedTypes';
import { STATUS_OPTIONS } from 'helpers/configs';
import { getStatusColor, debounce } from 'helpers/utils';
import { navigateWithHistory } from 'helpers/navigationUtils';

import useWorkspaceStore from 'stores/workspaceStore';
import { useSettingsStore } from 'stores/settingsStore';

import { getWorkspaceTasks } from 'services/workspace';
import { createTask, updateTask } from 'services/tasks';

import MemberAvatar from 'components/Workspace/Details/MemberAvatar';
import CreateForm from 'components/Workspace/Details/CreateForm';
import InlineEditableTitle from 'components/Shared/InlineEditableTitle';
import Dropdown from 'components/Shared/Dropdown';
import TaskListSkeleton from 'components/Workspace/Details/TaskListSkeleton';

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
  const [isLoading, setIsLoading] = useState(true);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const members = useWorkspaceStore((state) => state.members);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const shouldFetchTasksRef = useRef(true);
  const previousSearchKey = useRef('');

  // Member options for assignees dropdown
  const memberOptions = members.map((member) => ({
    label: member.name,
    value: member.user_id,
    icon: (
      <MemberAvatar
        member={member}
        color={member.profile_color}
        size='sm'
        className='w-4 h-4'
      />
    ),
  }));

  const memberMap = useMemo(() => {
    return new Map(members.map((member) => [member.user_id, member]));
  }, [members]);

  const fetchTasks = useMemo(() => debounce((searchKey: string) => {
    if (id) {
      setIsLoading(true);
      getWorkspaceTasks(id, searchKey).then((res) => {
        setTasks(res.tasks);
      }).catch((err) => {
        toast.error(err?.error);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, 200), [id]);

  useEffect(() => {
    const searchKey = searchParams.get('searchKey') || '';
    if (shouldFetchTasksRef.current) {
      fetchTasks('');
      shouldFetchTasksRef.current = false;
    }
    if (searchKey !== previousSearchKey.current) {
      fetchTasks(searchKey);
      previousSearchKey.current = searchKey;
    }
  }, [searchParams, fetchTasks]);

  const handleSubmit = useCallback((title: string) => {
    const payload = {
      title,
      status: 'todo' as const,
      time_spend: 0,
      type: 'task',
      workspace_id: Number(id),
    };
    createTask(payload).then(() => {
      fetchTasks('');
    }).catch((err) => {
      toast.error(err?.error || 'Failed to create task');
    });
    setIsVisible(false);
  }, [fetchTasks, id]);

  const handleTitleUpdate = useCallback(async (taskId: number, newTitle: string) => {
    try {
      await updateTask(taskId.toString(), { title: newTitle });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, title: newTitle } : task,
        ),
      );
      toast.success('Task title updated successfully');
    } catch (err: any) {
      toast.error(err?.error || 'Failed to update task title');
      throw err;
    }
  }, []);

  const handleStatusUpdate = useCallback(async (taskId: number, newStatus: string) => {
    try {
      await updateTask(taskId.toString(), { status: newStatus });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task,
        ),
      );
      toast.success('Task status updated successfully');
    } catch (err: any) {
      toast.error(err?.error || 'Failed to update task status');
    }
  }, []);

  const handleAssigneesUpdate = useCallback(async (taskId: number, newAssignees: number[]) => {
    try {
      await updateTask(taskId.toString(), { assignees: newAssignees });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, assignees: newAssignees } : task,
        ),
      );
      toast.success('Task assignees updated successfully');
    } catch (err: any) {
      toast.error(err?.error || 'Failed to update task assignees');
    }
  }, []);

  const handleTaskClick = (taskId: number) => {
    navigateWithHistory(
      navigate,
      `/tasks/${taskId}`,
      pathname,
      searchParams,
    );
  };

  return (
    <div id='tab-panel-tasks' role='tabpanel' aria-labelledby='tab-tasks'>
      {isLoading ? (
        <TaskListSkeleton count={8} />
      ) : (
        <>
          <div className='flex items-center gap-2 mb-3'>
            <h3 className='text-sm font-medium opacity-80'>All tasks</h3>
            <span
              className={clsx(
                'text-xs px-2 py-1 rounded',
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700',
              )}
            >
              {tasks.length}
            </span>
            <div className='flex items-center justify-end gap-2 flex-1'>
              <button
                type='button'
                onClick={() => setIsVisible(true)}
                className={clsx(
                  'inline-flex items-center gap-1 text-xs px-2 py-1 rounded border transition cursor-pointer',
                  darkMode ? 'border-gray-700 text-primary-300 hover:bg-gray-900' : 'border-gray-200 text-primary-700 hover:bg-gray-100',
                )}
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
            {tasks.length < 1 ? (
              <p className={darkMode ? 'text-gray-600' : 'text-gray-400'}>
                No tasks yet.
              </p>
            ) : (
              tasks.map((task) => (
                <li
                  key={task.id}
                  onClick={() => handleTaskClick(task.id)}
                  className={clsx(
                    'group flex items-center gap-4 rounded-lg border px-4 py-3 shadow-sm hover:shadow transition cursor-pointer',
                    darkMode ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-gray-50 hover:bg-gray-100',
                  )}
                >
                  <div className='flex items-center gap-3 min-w-0 flex-1'>
                    <div className='w-24 shrink-0 flex items-center h-full' data-dropdown>
                      <Dropdown
                        options={STATUS_OPTIONS}
                        value={task.status}
                        onSelect={(newStatus) => newStatus && handleStatusUpdate(task.id, newStatus)}
                        isMulti={false}
                        hideClear
                      >
                        <span
                          className={clsx(
                            'inline-block max-w-full truncate text-xs px-3 py-1 rounded-xl transition',
                            getStatusColor(task.status as StatusType),
                          )}
                        >
                          {task.status?.toUpperCase()}
                        </span>
                      </Dropdown>
                    </div>
                    <InlineEditableTitle
                      title={task.title}
                      onSave={(newTitle) => handleTitleUpdate(task.id, newTitle)}
                      placeholder='Enter task title...'
                    />
                  </div>

                  <div className='flex items-center gap-2' data-dropdown>
                    <Dropdown
                      options={memberOptions}
                      value={task?.assignees || []}
                      onSelect={(newAssignees) => handleAssigneesUpdate(task.id, newAssignees || [])}
                      isMulti={true}
                      hideClear
                    >
                      <div className='flex items-center gap-1'>
                        {task?.assignees?.length > 0 ? (
                          <div className='flex items-center -space-x-2'>
                            {task.assignees.map((userId) => {
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
                                  className={clsx('border-2', darkMode ? 'border-white' : 'border-gray-700')}
                                />
                              );
                            })}
                          </div>
                        ) : (
                          <div
                            className={clsx(
                              'w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center',
                              darkMode ? 'border-gray-600 text-gray-500' : 'border-gray-300 text-gray-400',
                            )}
                          >
                            <UserPlus size={14} />
                          </div>
                        )}
                      </div>
                    </Dropdown>
                  </div>

                  <span className={clsx('text-xs whitespace-nowrap', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                    {formatDueDate(task.due_date)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default TaskList;
