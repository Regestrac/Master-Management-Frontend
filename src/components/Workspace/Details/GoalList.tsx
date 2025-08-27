import { useCallback, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, Target } from 'lucide-react';

import { Goal } from 'helpers/sharedTypes';

import { useProfileStore } from 'stores/profileStore';

import { getWorkspaceGoals } from 'services/workspace';
import { createTask, updateTask } from 'services/tasks';

import { StatusBadge } from 'components/Workspace/Details/StatusBadge';
import CreateForm from 'components/Workspace/Details/CreateForm';
import InlineEditableTitle from 'components/Shared/InlineEditableTitle';
import Dropdown from 'components/Shared/Dropdown';

const GoalList = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const darkMode = useProfileStore((s) => s.data.theme) === 'dark';
  const navigate = useNavigate();

  const { id } = useParams();

  const shouldFetchGoalsRef = useRef(true);

  // Status options for goals dropdown
  const goalStatusOptions = [
    { label: 'Not Started', value: 'Not Started', color: '#6B7280' },
    { label: 'In Progress', value: 'In Progress', color: '#F59E0B' },
    { label: 'Achieved', value: 'Achieved', color: '#10B981' },
  ];

  const fetchGoals = useCallback(() => {
    if (id) {
      getWorkspaceGoals(id).then((res) => {
        setGoals(res?.goals || []);
      }).catch((err) => {
        toast.error(err?.error);
      });
    }
  }, [id]);

  useEffect(() => {
    if (shouldFetchGoalsRef.current) {
      fetchGoals();
      shouldFetchGoalsRef.current = false;
    }
  }, [fetchGoals]);

  const handleSubmit = useCallback((title: string) => {
    const payload = {
      title,
      status: 'todo' as const,
      time_spend: 0,
      type: 'goal',
      workspace_id: Number(id),
    };
    createTask(payload).then(() => {
      fetchGoals();
    }).catch((err) => {
      toast.error(err?.error || 'Failed to create goal');
    });
    setIsVisible(false);
  }, [fetchGoals, id]);

  const handleTitleUpdate = useCallback(async (goalId: number, newTitle: string) => {
    try {
      const response = await updateTask(goalId.toString(), { title: newTitle });
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
      const response = await updateTask(goalId.toString(), { status: newStatus });
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
    navigate(`/goals/${goalId}`);
  };

  return (
    <div id='tab-panel-goals' role='tabpanel' aria-labelledby='tab-goals'>
      <div className='flex items-center gap-2 mb-3'>
        <h3 className='text-sm font-medium opacity-80'>All goals</h3>
        <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
          {goals.length}
        </span>
        <div className='flex items-center justify-end gap-2 flex-1'>
          <button
            type='button'
            onClick={() => setIsVisible(true)}
            className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded border transition border-gray-200 text-emerald-700 hover:bg-gray-100 dark:border-gray-700 dark:text-emerald-300 dark:hover:bg-gray-750'
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
                <div className='w-32 shrink-0' data-dropdown>
                  <Dropdown
                    options={goalStatusOptions}
                    value={goal.status}
                    onSelect={(newStatus) => newStatus && handleStatusUpdate(goal.id, newStatus)}
                    isMulti={false}
                    hideClear
                  >
                    <StatusBadge status={goal.status} variant='goal' />
                  </Dropdown>
                </div>
                <div className='flex items-center gap-3 min-w-0 flex-1'>
                  <div className='bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full w-7 h-7 flex items-center justify-center shrink-0'>
                    <Target className='w-4 h-4' />
                  </div>
                  <InlineEditableTitle
                    title={goal.title}
                    onSave={(newTitle) => handleTitleUpdate(goal.id, newTitle)}
                    placeholder='Enter goal title...'
                  />
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default GoalList;
