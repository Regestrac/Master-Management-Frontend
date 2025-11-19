import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

import { Goal, StatusType } from 'helpers/sharedTypes';
import { getStatusColor, debounce } from 'helpers/utils';
import { STATUS_OPTIONS } from 'helpers/configs';
import { navigateWithHistory } from 'helpers/navigationUtils';

import useWorkspaceStore from 'stores/workspaceStore';
import { useSettingsStore } from 'stores/settingsStore';

import { getWorkspaceGoals } from 'services/workspace';
import { updateGoal, createGoal } from 'services/goals';

import MemberAvatar from 'components/Workspace/Details/MemberAvatar';
import Dropdown from 'components/Shared/Dropdown';
import CreateForm from 'components/Workspace/Details/CreateForm';
import InlineEditableTitle from 'components/Shared/InlineEditableTitle';
import GoalListSkeleton from 'components/Workspace/Details/GoalListSkeleton';

type GoalWithSubtasks = Goal & {
  subtasks?: Array<{
    id: number;
    title: string;
    status: string;
    completed_at?: string;
  }>;
  showSubtasks?: boolean;
  isLoadingSubtasks?: boolean;
  sub_task_count?: number;
};

const GoalList = () => {
  const [goals, setGoals] = useState<GoalWithSubtasks[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const members = useWorkspaceStore((state) => state.members);
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const shouldFetchGoalsRef = useRef(true);
  const previousSearchKey = useRef('');

  const memberMap = useMemo(() => {
    return new Map(members.map((member) => [member.user_id, member]));
  }, [members]);

  const memberOptions = useMemo(() => {
    return members.map((member) => ({
      value: member.user_id,
      label: member.name,
    }));
  }, [members]);

  const fetchGoals = useMemo(() => debounce((searchKey: string) => {
    if (id) {
      setIsLoading(true);
      getWorkspaceGoals(id, searchKey).then((res) => {
        setGoals(res?.goals || []);
      }).catch((err) => {
        toast.error(err?.error);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, 200), [id]);

  useEffect(() => {
    const searchKey = searchParams.get('searchKey') || '';
    if (shouldFetchGoalsRef.current) {
      fetchGoals('');
      shouldFetchGoalsRef.current = false;
    }
    if (searchKey !== previousSearchKey.current) {
      fetchGoals(searchKey);
      previousSearchKey.current = searchKey;
    }
  }, [searchParams, fetchGoals]);

  const handleSubmit = useCallback((title: string) => {
    const payload = {
      title,
      status: 'todo' as const,
      time_spend: 0,
      type: 'goal',
      workspace_id: Number(id),
    };
    createGoal(payload).then(() => {
      fetchGoals('');
    }).catch((err) => {
      toast.error(err?.error || 'Failed to create goal');
    });
    setIsVisible(false);
  }, [fetchGoals, id]);

  const handleAssigneesUpdate = useCallback(async (goalId: number, newAssignees: number[]) => {
    try {
      await updateGoal(goalId.toString(), { assignees: newAssignees });
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId ? { ...goal, assignees: newAssignees } : goal,
        ),
      );
      toast.success('Goal assignees updated successfully');
    } catch (err: any) {
      toast.error(err?.error || 'Failed to update goal assignees');
    }
  }, []);

  const handleTitleUpdate = useCallback(async (goalId: number, newTitle: string) => {
    try {
      const response = await updateGoal(goalId.toString(), { title: newTitle });
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId ? { ...goal, title: newTitle } : goal,
        ),
      );
      toast.success(response.message || 'Goal title updated successfully');
    } catch (err: any) {
      toast.error(err?.error || 'Failed to update goal title');
      throw err;
    }
  }, []);

  // Fetch subtasks for a specific goal
  const fetchSubtasks = useCallback(async (goalId: number) => {
    // In a real implementation, you would fetch subtasks from your API here
    // For example: const response = await getGoalSubtasks(goalId);
    // For now, we'll simulate an API call with a timeout
    return new Promise<Array<{ id: number; title: string; status: string; completed_at?: string }>>((resolve) => {
      setTimeout(() => {
        // Simulated subtasks - replace with actual API call
        const mockSubtasks = [
          { id: goalId * 100 + 1, title: 'Subtask 1', status: 'todo' },
          { id: goalId * 100 + 2, title: 'Subtask 2', status: 'in_progress' },
          { id: goalId * 100 + 3, title: 'Subtask 3', status: 'completed', completed_at: new Date().toISOString() },
        ];
        resolve(mockSubtasks);
      }, 500); // Simulate network delay
    });
  }, []);

  // Toggle subtask visibility and fetch subtasks if needed
  const toggleSubtasks = useCallback(async (goal: GoalWithSubtasks) => {
    const goalId = goal.id;

    // If we're hiding subtasks, just toggle the visibility
    if (goal.showSubtasks) {
      setGoals((prevGoals) =>
        prevGoals.map((g) =>
          g.id === goalId
            ? { ...g, showSubtasks: false, isLoadingSubtasks: false }
            : g,
        ),
      );
      return;
    }

    // If we're showing subtasks and they're not loaded yet, fetch them
    if (!goal.subtasks || goal.subtasks.length === 0) {
      try {
        // Set loading state for this goal
        setGoals((prevGoals) =>
          prevGoals.map((g) =>
            g.id === goalId
              ? { ...g, isLoadingSubtasks: true, showSubtasks: true }
              : g,
          ),
        );

        // Fetch subtasks
        const subtasks = await fetchSubtasks(goalId);

        // Update goal with fetched subtasks
        setGoals((prevGoals) =>
          prevGoals.map((g) =>
            g.id === goalId
              ? {
                ...g,
                subtasks,
                isLoadingSubtasks: false,
                showSubtasks: true,
              }
              : g,
          ),
        );
      } catch {
        toast.error('Failed to load subtasks');
        // Reset loading state on error
        setGoals((prevGoals) =>
          prevGoals.map((g) =>
            g.id === goalId
              ? { ...g, isLoadingSubtasks: false, showSubtasks: false }
              : g,
          ),
        );
      }
    } else {
      // If subtasks are already loaded, just toggle visibility
      setGoals((prevGoals) =>
        prevGoals.map((g) =>
          g.id === goalId
            ? { ...g, showSubtasks: !g.showSubtasks }
            : g,
        ),
      );
    }
  }, [fetchSubtasks]);

  const handleStatusUpdate = useCallback(async (goalId: number, newStatus: string) => {
    try {
      const response = await updateGoal(goalId.toString(), { status: newStatus });
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId ? { ...goal, status: newStatus as Goal['status'] } : goal,
        ),
      );
      toast.success(response.message || 'Goal status updated successfully');
    } catch (err: any) {
      toast.error(err?.error || 'Failed to update goal status');
    }
  }, []);

  const handleGoalClick = (goalId: number) => {
    navigateWithHistory(
      navigate,
      `/goals/${goalId}`,
      pathname,
      searchParams,
    );
  };

  return (
    <div id='tab-panel-goals' role='tabpanel' aria-labelledby='tab-goals'>
      {isLoading ? (
        <GoalListSkeleton count={8} />
      ) : (
        <>
          <div className='flex items-center gap-2 mb-3'>
            <h3 className='text-sm font-medium opacity-80'>All goals</h3>
            <span
              className={clsx(
                'text-xs px-2 py-1 rounded',
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700',
              )}
            >
              {goals.length}
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
                title='Create goal'
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
                placeholder='Goal title'
              />
            )}
            {goals.length < 1 && !isVisible ? (
              <p className={clsx(darkMode ? 'text-gray-600' : 'text-gray-400')}>No goals yet.</p>
            ) : (
              goals.map((goal) => (
                <div key={goal.id}>
                  <div
                    onClick={() => handleGoalClick(goal.id)}
                    className={clsx(
                      'group flex items-center gap-4 rounded-lg border px-4 py-3 shadow-sm hover:shadow transition cursor-pointer',
                      darkMode
                        ? 'border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700',
                    )}
                  >
                    <div className='flex items-center gap-3 min-w-0 flex-1'>
                      <div className='w-24 shrink-0' data-dropdown>
                        <Dropdown
                          options={STATUS_OPTIONS}
                          value={goal.status}
                          onSelect={(newStatus) => newStatus && handleStatusUpdate(goal.id, newStatus)}
                          isMulti={false}
                          hideClear
                        >
                          <span
                            className={clsx(
                              'inline-block max-w-full truncate text-xs px-3 py-1 rounded-xl transition',
                              getStatusColor(goal.status as StatusType, darkMode),
                            )}
                          >
                            {goal.status?.toUpperCase()}
                          </span>
                        </Dropdown>
                      </div>
                      <InlineEditableTitle
                        title={goal.title}
                        onSave={(newTitle) => handleTitleUpdate(goal.id, newTitle)}
                        placeholder='Enter goal title...'
                      />
                    </div>
                    <div className='flex items-center gap-2'>
                      {goal.sub_task_count && goal.sub_task_count > 0 && (
                        <button
                          type='button'
                          className={clsx('flex items-center gap-1 text-xs text-gray-500 transition-colors', darkMode ? 'hover:text-gray-300' : 'hover:text-gray-700')}
                          onClick={async (e) => {
                            e.stopPropagation();
                            await toggleSubtasks(goal);
                          }}
                          disabled={goal.isLoadingSubtasks}
                        >
                          <span>
                            {goal.subtasks?.length || 0}
                            {' '}
                            subtasks
                          </span>
                          {goal.isLoadingSubtasks ? (
                            <Loader2 className='w-3 h-3 animate-spin' />
                          ) : goal.showSubtasks ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      )}
                    </div>

                    <div className='flex items-center gap-2' data-dropdown>
                      <Dropdown
                        options={memberOptions}
                        value={goal?.assignees || []}
                        onSelect={(newAssignees) => handleAssigneesUpdate(goal.id, newAssignees || [])}
                        isMulti={true}
                        hideClear
                      >
                        <div className='flex items-center gap-1'>
                          {goal?.assignees?.length > 0 ? (
                            <div className='flex items-center -space-x-2'>
                              {goal.assignees.map((userId) => {
                                const member = memberMap.get(userId);
                                if (!member) {
                                  return null;
                                }
                                return (
                                  <MemberAvatar
                                    color={member.profile_color}
                                    key={`assignee-${goal.id}-${userId}`}
                                    member={member}
                                    size='sm'
                                    className={darkMode ? 'border-white' : 'border-gray-700'}
                                  />
                                );
                              })}
                            </div>
                          ) : (
                            <div
                              className={clsx(
                                'text-xs px-2 py-1 rounded border border-dashed',
                                darkMode ? 'text-gray-400 border-gray-600' : 'text-gray-500 border-gray-300',
                              )}
                            >
                              Assign
                            </div>
                          )}
                        </div>
                      </Dropdown>
                    </div>
                  </div>

                  {goal.showSubtasks && (
                    <div className='mt-2 ml-16 space-y-1'>
                      {goal.isLoadingSubtasks ? (
                        <div className='flex items-center justify-center py-2'>
                          <Loader2 className='w-4 h-4 animate-spin mr-2' />
                          <span className='text-sm'>Loading subtasks...</span>
                        </div>
                      ) : goal.subtasks && goal.subtasks.length > 0 ? (
                        goal.subtasks.map((subtask) => (
                          <div
                            key={subtask.id}
                            className={clsx(
                              'flex items-center gap-2 text-sm p-2 rounded',
                              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-700',
                              subtask.completed_at && (darkMode ? 'text-gray-500' : 'text-gray-400'),
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGoalClick(subtask.id);
                            }}
                          >
                            <div
                              className={clsx(
                                'w-2 h-2 rounded-full',
                                subtask.completed_at ? 'bg-green-500' : subtask.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-400',
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

export default GoalList;
