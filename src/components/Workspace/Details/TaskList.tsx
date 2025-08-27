import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, UserPlus } from 'lucide-react';

import { Task } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';
import useWorkspaceStore from 'stores/workspaceStore';

import { getWorkspaceTasks } from 'services/workspace';
import { createTask, updateTask } from 'services/tasks';

import { StatusBadge } from 'components/Workspace/Details/StatusBadge';
import { MemberAvatar } from 'components/Workspace/Details/MemberAvatar';
import CreateForm from 'components/Workspace/Details/CreateForm';
import InlineEditableTitle from 'components/Shared/InlineEditableTitle';
import Dropdown from 'components/Shared/Dropdown';

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
  const navigate = useNavigate();

  const { id } = useParams();

  const shouldFetchTasksRef = useRef(true);

  // Status options for dropdown
  const statusOptions = [
    { label: 'To Do', value: 'todo', color: '#6B7280' },
    { label: 'In Progress', value: 'inprogress', color: '#F59E0B' },
    { label: 'Completed', value: 'completed', color: '#10B981' },
    { label: 'Pending', value: 'pending', color: '#EF4444' },
    { label: 'Paused', value: 'paused', color: '#8B5CF6' },
  ];

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
    navigate(`/tasks/${taskId}`);
  };

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
        {tasks.length < 1 ? (
          <p className='text-gray-400 dark:text-gray-600'>No tasks yet.</p>
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
                <div className='w-32 shrink-0' data-dropdown>
                  <Dropdown
                    options={statusOptions}
                    value={task.status}
                    onSelect={(newStatus) => newStatus && handleStatusUpdate(task.id, newStatus)}
                    isMulti={false}
                    hideClear
                  >
                    <StatusBadge status={task.status} variant='task' />
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
                    <div className='flex items-center -space-x-2'>
                      {task?.assignees?.length > 0 ? (
                        task.assignees.map((userId) => {
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
                        })
                      ) : (
                        <div className={`
                          w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center
                          ${darkMode ? 'border-gray-600 text-gray-500' : 'border-gray-300 text-gray-400'}
                        `}
                        >
                          <UserPlus size={14} />
                        </div>
                      )}
                    </div>
                  </div>
                </Dropdown>
              </div>

              <span className='text-xs whitespace-nowrap text-gray-600 dark:text-gray-300'>
                {formatDueDate(task.due_date)}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TaskList;
