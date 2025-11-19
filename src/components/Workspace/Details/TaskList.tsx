import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, UserPlus, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

import type { StatusType } from 'helpers/sharedTypes';
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

export type Task = {
  id: number;
  title: string;
  status: string;
  assignees: number[];
  due_date: string;
  subtasks?: Array<{
    id: number;
    title: string;
    status: string;
    completed_at?: string;
  }>;
};

type TaskWithSubtasks = Task & {
  showSubtasks?: boolean;
  sub_task_count?: number;
  isLoadingSubtasks?: boolean;
};

const TaskList = () => {
  const [tasks, setTasks] = useState<TaskWithSubtasks[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const members = useWorkspaceStore((state) => state.members);

  // const _formatDueDate = useCallback((dateString: string) => {
  //   const date = new Date(dateString);
  //   if (Number.isNaN(date.getTime())) {
  //     return dateString;
  //   }
  //   return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  // }, []);

  // Fetch subtasks for a specific task
  const fetchSubtasks = useCallback(async (taskId: number) => {
    // In a real implementation, you would fetch subtasks from your API here
    // For example: const subtasks = await getTaskSubtasks(taskId);
    // For now, we'll simulate an API call with a timeout
    return new Promise<Array<{ id: number; title: string; status: string; completed_at?: string }>>((resolve) => {
      setTimeout(() => {
        // Simulated subtasks - replace with actual API call
        const mockSubtasks = [
          { id: taskId * 100 + 1, title: 'Subtask 1', status: 'todo' },
          { id: taskId * 100 + 2, title: 'Subtask 2', status: 'in_progress' },
          { id: taskId * 100 + 3, title: 'Subtask 3', status: 'completed', completed_at: new Date().toISOString() },
        ];
        resolve(mockSubtasks);
      }, 500); // Simulate network delay
    });
  }, []);

  // Toggle subtask visibility and fetch subtasks if needed
  const toggleSubtasks = useCallback(async (task: TaskWithSubtasks) => {
    const taskId = task.id;

    // If we're hiding subtasks, just toggle the visibility
    if (task.showSubtasks) {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId
            ? { ...t, showSubtasks: false, isLoadingSubtasks: false }
            : t,
        ),
      );
      return;
    }

    // If we're showing subtasks and they're not loaded yet, fetch them
    if (!task.subtasks || task.subtasks.length === 0) {
      try {
        // Set loading state for this task
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === taskId
              ? { ...t, isLoadingSubtasks: true, showSubtasks: true }
              : t,
          ),
        );

        // Fetch subtasks
        const subtasks = await fetchSubtasks(taskId);

        // Update task with fetched subtasks
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === taskId
              ? {
                ...t,
                subtasks,
                isLoadingSubtasks: false,
                showSubtasks: true,
              }
              : t,
          ),
        );
      } catch {
        toast.error('Failed to load subtasks.');
        // Reset loading state on error
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === taskId
              ? { ...t, isLoadingSubtasks: false, showSubtasks: false }
              : t,
          ),
        );
      }
    } else {
      // If subtasks are already loaded, just toggle visibility
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId
            ? { ...t, showSubtasks: !t.showSubtasks }
            : t,
        ),
      );
    }
  }, [fetchSubtasks]);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const shouldFetchTasksRef = useRef(true);
  const previousSearchKey = useRef('');

  // Member options for assignees dropdown
  const memberOptions = useMemo(() => members.map((member) => ({
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
  })), [members]);

  // Member map for quick lookup
  const _memberMap = useMemo(
    () => new Map(members.map((member) => [member.user_id, member])),
    [members],
  );

  const fetchTasks = useMemo(() => debounce((searchKey: string) => {
    if (id) {
      setIsLoading(true);
      getWorkspaceTasks(id, searchKey)
        .then((res) => {
          setTasks(res.tasks);
        })
        .catch((err) => {
          toast.error(err?.error || 'Failed to fetch tasks');
        })
        .finally(() => {
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
    if (!id) { return; }

    const payload = {
      title,
      status: 'todo',
      time_spend: 0,
      type: 'task',
      workspace_id: Number(id),
    };

    createTask(payload)
      .then(() => {
        fetchTasks('');
        setIsVisible(false);
      })
      .catch((err) => {
        toast.error(err?.error || 'Failed to create task');
      });
  }, [fetchTasks, id]);

  const handleTitleUpdate = useCallback(async (taskId: number, newTitle: string) => {
    try {
      await updateTask(taskId.toString(), { title: newTitle });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, title: newTitle } : task,
        ),
      );
      toast.success('Task title updated');
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
      toast.success('Status updated');
    } catch (err: any) {
      toast.error(err?.error || 'Failed to update status');
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
    } catch (err: any) {
      toast.error(err?.error || 'Failed to update assignees');
    }
  }, []);

  const handleTaskClick = useCallback((taskId: number) => {
    if (id) {
      navigateWithHistory(
        navigate,
        `/tasks/${taskId}`,
        pathname,
        searchParams,
      );
    }
  }, [navigate, pathname, searchParams, id]);

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
                  darkMode
                    ? 'border-gray-700 text-primary-300 hover:bg-gray-900'
                    : 'border-gray-200 text-primary-700 hover:bg-gray-100',
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
                <div key={task.id} className='space-y-1'>
                  <div
                    onClick={() => handleTaskClick(task.id)}
                    className={clsx(
                      'group flex items-center gap-3 rounded-lg border px-4 py-3 shadow-sm hover:shadow transition cursor-pointer',
                      darkMode ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-gray-50 hover:bg-gray-100',
                    )}
                  >
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation();
                        if (task.sub_task_count) {
                          toggleSubtasks(task);
                        }
                      }}
                      className={clsx(
                        '-ml-1 rounded flex items-center justify-center w-6 h-6',
                        darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500',
                        { invisible: !task.sub_task_count },
                      )}
                      aria-label={task.showSubtasks ? 'Collapse subtasks' : 'Expand subtasks'}
                      disabled={task.isLoadingSubtasks}
                    >
                      {task.isLoadingSubtasks ? (
                        <Loader2 className='w-4 h-4 animate-spin' />
                      ) : task.showSubtasks ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                    <div className='w-24 shrink-0 flex items-center h-full' data-dropdown>
                      <Dropdown
                        options={STATUS_OPTIONS}
                        value={task.status}
                        onSelect={(newStatus) => newStatus && handleStatusUpdate(task.id, newStatus as string)}
                        isMulti={false}
                        hideClear
                      >
                        <span
                          className={clsx(
                            'inline-block max-w-full truncate text-xs px-3 py-1 rounded-xl transition',
                            getStatusColor(task.status as StatusType, darkMode),
                          )}
                        >
                          {task.status?.toUpperCase()}
                        </span>
                      </Dropdown>
                    </div>
                    <div className='min-w-0 flex-1'>
                      <InlineEditableTitle
                        title={task.title}
                        onSave={(newTitle) => handleTitleUpdate(task.id, newTitle)}
                        className='font-medium text-sm'
                      />
                    </div>
                    <div className='flex-shrink-0'>
                      <Dropdown
                        options={memberOptions}
                        value={task.assignees}
                        onSelect={(newAssignees) =>
                          handleAssigneesUpdate(task.id, newAssignees as number[] || [])
                        }
                        isMulti
                        hideClear
                      >
                        {task.assignees?.length > 0 ? (
                          <div className='flex items-center -space-x-2'>
                            {task.assignees.slice(0, 2).map((userId) => {
                              const member = _memberMap.get(userId);
                              if (!member) { return null; }
                              return (
                                <MemberAvatar
                                  key={userId}
                                  member={member}
                                  color={member.profile_color}
                                  size='sm'
                                  className={clsx(
                                    'border-2',
                                    darkMode ? 'border-gray-800' : 'border-white',
                                  )}
                                />
                              );
                            })}
                            {task.assignees.length > 2 && (
                              <div className={clsx(
                                'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                                'border-2',
                                darkMode
                                  ? 'bg-gray-700 border-gray-800 text-gray-300'
                                  : 'bg-gray-200 border-white text-gray-600',
                              )}
                              >
                                +
                                {task.assignees.length - 1}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className={clsx(
                            'w-6 h-6 rounded-full flex items-center justify-center',
                            'border-2 border-dashed',
                            darkMode
                              ? 'border-gray-600 text-gray-500'
                              : 'border-gray-300 text-gray-400',
                          )}
                          >
                            <UserPlus size={14} />
                          </div>
                        )}
                      </Dropdown>
                    </div>
                  </div>
                  {task.showSubtasks && (
                    <div className={clsx('mt-1 ml-12 space-y-1', darkMode ? 'text-gray-400' : 'text-gray-600')}>
                      {task.isLoadingSubtasks ? (
                        <div className='flex items-center justify-center py-2'>
                          <Loader2 className='w-4 h-4 animate-spin mr-2' />
                          <span className='text-sm'>Loading subtasks...</span>
                        </div>
                      ) : task.subtasks && task.subtasks.length > 0 ? (
                        task.subtasks.map((subtask) => (
                          <div
                            key={subtask.id}
                            className={clsx(
                              'flex items-center gap-2 text-sm p-2 rounded',
                              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
                              subtask.completed_at && (darkMode ? 'text-gray-500' : 'text-gray-400'),
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Navigate to subtask instead of toggling
                              handleTaskClick(subtask.id);
                            }}
                          >
                            <div
                              className={clsx(
                                'w-2 h-2 rounded-full',
                                subtask.completed_at
                                  ? 'bg-green-500'
                                  : subtask.status === 'in_progress'
                                    ? 'bg-yellow-500'
                                    : 'bg-gray-400',
                              )}
                            />
                            <span className={clsx('truncate', subtask.completed_at && 'line-through')}>
                              {subtask.title}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className='text-sm py-2 text-center text-gray-500'>
                          No subtasks found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default TaskList;
