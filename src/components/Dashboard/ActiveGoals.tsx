import { useEffect, useRef, useState } from 'react';

import { Clock, Flame } from 'lucide-react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormProvider, useForm } from 'react-hook-form';

import { formatDuration } from 'helpers/utils';
import { navigateWithHistory } from 'helpers/navigationUtils';

import { useSettingsStore } from 'stores/settingsStore';
import { useProfileStore } from 'stores/profileStore';
import useModalStore from 'stores/modalStore';

import { getActiveGoals } from 'services/dashboard';
import { updateTask } from 'services/tasks';
import { updateActiveTask } from 'services/profile';

import GoalSkeleton from 'components/Dashboard/GoalSkeleton';
import QuickActions from 'components/Dashboard/QuickActions';
import Input from 'components/Shared/Input';
import Outline from 'components/Shared/Outline';

type ActiveGoalType = {
  id: number;
  title: string;
  streak: number;
  time_spend: number;
  status: string;
  last_accessed_at: string;
  type: 'goal' | 'task';
  progress: number;
};

type GoalCardWrapperPropsType = {
  goal: ActiveGoalType;
  isActive: boolean;
  children: React.ReactNode;
};

type GoalTitleEditorPropsType = {
  goal: ActiveGoalType;
  isEditing: boolean;
  onStartEdit: (_e: React.MouseEvent) => void;
  onFinishEdit: (_title: string) => void;
};

const GoalCardWrapper = ({ isActive, children }: GoalCardWrapperPropsType) => {
  if (isActive) {
    return (
      <Outline colors={['bg-primary-500', 'bg-secondary-500']} width='3px' variant='rotate' disabled={false}>
        {children as React.ReactElement}
      </Outline>
    );
  }
  return children;
};

const GoalTitleEditor = ({ goal, isEditing, onStartEdit, onFinishEdit }: GoalTitleEditorPropsType) => {
  const methods = useForm({
    defaultValues: {
      title: goal.title,
    },
  });

  useEffect(() => {
    methods.reset({ title: goal.title });
  }, [goal.title, methods]);

  if (isEditing) {
    return (
      <FormProvider {...methods}>
        <Input
          name='title'
          label=''
          type='textarea'
          hideResizeIndicator
          className='font-semibold mb-1 cursor-text outline-none p-0! border-none focus:ring-0!'
          onClick={(e) => e.stopPropagation()}
          autoFocus
          onBlur={(value) => {
            onFinishEdit(value);
          }}
        />
      </FormProvider>
    );
  }

  return (
    <h4
      className='font-semibold mb-2 cursor-text hover:opacity-80 transition-opacity'
      onClick={onStartEdit}
    >
      {goal.title}
    </h4>
  );
};

const ActiveGoals = () => {
  const [goals, setGoals] = useState<ActiveGoalType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);

  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const activeTask = useProfileStore((state) => state.data.active_task);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const updateVisibility = useModalStore((state) => state.updateVisibility);

  const shouldFetchGoalsRef = useRef(true);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  const handleViewAllGoals = () => {
    navigate('/goals');
  };

  const handleUpdateGoalTitle = (id: number, title: string) => {
    updateTask(id.toString(), { title }).then((res) => {
      toast.success(res?.message || 'Updated successfully');
      setGoals((prev) => prev.map((g) => g.id === id ? { ...g, title } : g));
    }).catch((err) => {
      toast.error(err?.error || 'Failed to update goal');
    });
  };

  const handleToggleTimer = (e: React.MouseEvent, goalId: number) => {
    e.stopPropagation();
    const toggleTimer = () => {
      updateActiveTask({ active_task: activeTask === goalId ? null : goalId }).then((res) => {
        updateVisibility({ modalType: 'switchTaskModal', isVisible: false });
        toast.success(res?.message);
        updateProfile({ active_task: res?.active_task });
      }).catch((err) => {
        toast.error(err?.error);
      });
    };

    if (activeTask && activeTask !== goalId) {
      updateVisibility({ modalType: 'switchTaskModal', isVisible: true, extraProps: { onSuccess: toggleTimer } });
    } else {
      toggleTimer();
    }
  };

  const handleGoalClick = (goalId: number) => {
    navigateWithHistory(
      navigate,
      `/goals/${goalId}`,
      pathname,
      searchParams,
    );
  };

  useEffect(() => {
    if (shouldFetchGoalsRef.current) {
      setIsLoading(true);
      getActiveGoals().then((res) => {
        setGoals(res?.data);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch active goals');
      }).finally(() => {
        setIsLoading(false);
      });
      shouldFetchGoalsRef.current = false;
    }
  }, []);

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-xl font-bold'>Active Goals</h3>
        <button className='text-primary-300 hover:text-primary-400 text-sm font-medium' onClick={handleViewAllGoals}>View All</button>
      </div>

      <div className='space-y-4'>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <GoalSkeleton key={index} />
          ))
        ) : (
          goals?.map((goal) => {
            const isActive = activeTask === goal.id;
            const isEditing = editingGoalId === goal.id;

            return (
              <GoalCardWrapper key={goal.id} goal={goal} isActive={isActive}>
                <div
                  className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
                  onClick={() => handleGoalClick(goal.id)}
                >
                  <div className='mb-4'>
                    <GoalTitleEditor
                      goal={goal}
                      isEditing={isEditing}
                      onStartEdit={(e) => {
                        e.stopPropagation();
                        setEditingGoalId(goal.id);
                      }}
                      onFinishEdit={(title) => {
                        if (title !== goal.title) {
                          handleUpdateGoalTitle(goal.id, title);
                        }
                        setEditingGoalId(null);
                      }}
                    />
                    <div className='flex items-center justify-between text-sm mb-2'>
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {goal?.progress?.toFixed(1) || 0}
                        % complete
                      </span>
                      <span className='text-orange-500 flex items-center'>
                        <Flame className='w-4 h-4 mr-1' />
                        {goal.streak}
                        {' '}
                        days
                      </span>
                    </div>
                    <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                      <div
                        className='bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500'
                        style={{ width: `${goal?.progress || 0}%` }}
                      />
                    </div>
                  </div>
                  <div className={`flex items-center justify-between text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className='flex items-center'>
                      <Clock className='w-4 h-4 mr-1' />
                      {formatDuration(goal.time_spend)}
                    </span>
                    <button
                      className='text-primary-300 hover:text-primary-400 font-medium'
                      onClick={(e) => handleToggleTimer(e, goal.id)}
                    >
                      {isActive ? 'Stop' : 'Continue'}
                    </button>
                  </div>
                </div>
              </GoalCardWrapper>
            );
          })
        )}
      </div>

      <QuickActions />
    </div>
  );
};

export default ActiveGoals;