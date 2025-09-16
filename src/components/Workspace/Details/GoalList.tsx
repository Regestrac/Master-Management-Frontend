import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';

import { Goal, StatusType } from 'helpers/sharedTypes';
import { getStatusColor, debounce } from 'helpers/utils';
import { STATUS_OPTIONS } from 'helpers/configs';

import { useProfileStore } from 'stores/profileStore';
import useWorkspaceStore from 'stores/workspaceStore';
import { useNavbarStore } from 'stores/navbarStore';

import { getWorkspaceGoals } from 'services/workspace';
import { updateGoal, createGoal } from 'services/goals';

import { MemberAvatar } from 'components/Workspace/Details/MemberAvatar';
import Dropdown from 'components/Shared/Dropdown';
import CreateForm from 'components/Workspace/Details/CreateForm';
import InlineEditableTitle from 'components/Shared/InlineEditableTitle';

import GoalListSkeleton from './GoalListSkeleton';

const GoalList = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const members = useWorkspaceStore((state) => state.members);
  const darkMode = useProfileStore((s) => s.data.theme) === 'dark';
  const updatePrevPath = useNavbarStore((state) => state.updatePrevPath);

  const navigate = useNavigate();

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
    updatePrevPath(`/workspace/${id}`);
    navigate(`/goals/${goalId}`);
  };

  return (
    <div id='tab-panel-goals' role='tabpanel' aria-labelledby='tab-goals'>
      {isLoading ? (
        <GoalListSkeleton count={8} />
      ) : (
        <>
          <div className='flex items-center gap-2 mb-3'>
            <h3 className='text-sm font-medium opacity-80'>All goals</h3>
            <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              {goals.length}
            </span>
            <div className='flex items-center justify-end gap-2 flex-1'>
              <button
                type='button'
                onClick={() => setIsVisible(true)}
                className={clsx(
                  'inline-flex items-center gap-1 text-xs px-2 py-1 rounded border transition cursor-pointer',
                  darkMode ? 'border-gray-700 text-primary-300 hover:bg-gray-900' : 'border-gray-200 text-primary-700 hover:bg-gray-100',
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
              <p className='text-gray-400 dark:text-gray-600'>No goals yet.</p>
            ) : (
              goals.map((goal) => (
                <li
                  key={goal.id}
                  onClick={() => handleGoalClick(goal.id)}
                  className={clsx(
                    'group flex items-center gap-4 rounded-lg border px-4 py-3 shadow-sm hover:shadow transition cursor-pointer',
                    darkMode ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-gray-50 hover:bg-gray-100',
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
                            getStatusColor(goal.status as StatusType),
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
                                  className='border-gray-700 dark:border-white'
                                />
                              );
                            })}
                          </div>
                        ) : (
                          <div className='text-xs text-gray-500 dark:text-gray-400 px-2 py-1 rounded border border-dashed border-gray-300 dark:border-gray-600'>
                            Assign
                          </div>
                        )}
                      </div>
                    </Dropdown>
                  </div>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default GoalList;
