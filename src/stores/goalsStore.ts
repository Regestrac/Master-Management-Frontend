import { create } from 'zustand';

import { StatusType } from 'src/helpers/sharedTypes';

// Goal-specific types
type GoalType = {
  id: number;
  title: string;
  status: StatusType;
  time_spend: number;
  due_date: string;
  type: 'goal' | 'task';

  startedAt?: string;
  description: string;
  tags: string[];

  category: string;
  streak: number;
  achievements: string[];
  priority?: 'low' | 'normal' | 'high';

  progress: number;
  currentWeekHours: number;
  weeklyTarget: number;
};

type GoalMilestoneType = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  targetDate: string;
  completedAt?: string;
  progress: number;
};

type GoalNotesType = {
  id: number;
  created_at: string;
  text: string;
  bg_color: string;
  text_color: string;
};

type GoalCommentsType = {
  id: number;
  user: string;
  content: string;
  timestamp: string;
  edited?: boolean;
  color?: string;
  avatar?: string;
};

type GoalDetailsType = GoalType & {
  startedAt: string;
  milestones: GoalMilestoneType[];
  notes: GoalNotesType[];
  comments: GoalCommentsType[];
  timeEntries: {
    id: number;
    startTime: string;
    endTime?: string;
    duration: number;
    description?: string;
  }[];
};

type GoalsStateType = {
  goals: GoalType[];
  activeGoals: GoalType[];
  currentGoalDetails: GoalDetailsType;
  shouldStartTimer: boolean;

  // Goal management methods
  addGoal: (_newGoal: GoalType | GoalType[], _type?: 'merge' | 'replace') => void;
  updateGoal: (_goal: Partial<GoalType> & { id: number }) => void;
  deleteGoal: (_id: number) => void;

  // Active goals management
  updateActiveGoals: (_goal: GoalType | GoalType[]) => void;
  addToActiveGoals: (_goalId: number) => void;
  removeFromActiveGoals: (_goalId: number) => void;

  // Goal details management
  updateCurrentGoalDetails: (_goal: GoalDetailsType) => void;
  addGoalMilestone: (_goalId: number, _milestone: Omit<GoalMilestoneType, 'id'>) => void;
  updateGoalMilestone: (_goalId: number, _milestoneId: number, _updates: Partial<GoalMilestoneType>) => void;
  deleteGoalMilestone: (_goalId: number, _milestoneId: number) => void;

  // Timer management
  updateStartTimer: (_value: boolean) => void;
  updateStartedAt: (_time: string) => void;

  // Progress tracking
  updateGoalProgress: (_goalId: number, _progress: number) => void;
  incrementGoalStreak: (_goalId: number) => void;
  resetGoalStreak: (_goalId: number) => void;
  updateWeeklyHours: (_goalId: number, _hours: number) => void;

  // Achievement management
  addAchievement: (_goalId: number, _achievement: string) => void;
  removeAchievement: (_goalId: number, _achievement: string) => void;
};

export const useGoalStore = create<GoalsStateType>()((set, get) => ({
  goals: [],
  activeGoals: [],
  currentGoalDetails: {} as GoalDetailsType,
  shouldStartTimer: false,

  // Goal management methods
  addGoal: (newGoal, type) => set((state) => {
    if (type === 'replace') {
      return { goals: Array.isArray(newGoal) ? newGoal : [newGoal] };
    } else {
      const incoming = Array.isArray(newGoal) ? newGoal : [newGoal];
      const mergedMap = new Map<number, GoalType>();
      // Add existing goals to the map
      state.goals.forEach((goal) => mergedMap.set(goal.id, goal));
      // Overwrite or add new goals from incoming
      incoming.forEach((goal) => mergedMap.set(goal.id, goal));
      return { goals: Array.from(mergedMap.values()) };
    }
  }),

  updateGoal: (updatedGoal) => set((state) => ({
    goals: state.goals.map((goal) =>
      goal.id === updatedGoal.id ? { ...goal, ...updatedGoal } : goal,
    ),
    // Also update in activeGoals if present
    activeGoals: state.activeGoals.map((goal) =>
      goal.id === updatedGoal.id ? { ...goal, ...updatedGoal } : goal,
    ),
  })),

  deleteGoal: (id) => set((state) => ({
    goals: state.goals.filter((goal) => goal.id !== id),
    activeGoals: state.activeGoals.filter((goal) => goal.id !== id),
  })),

  // Active goals management
  updateActiveGoals: (updatedGoal) => set((state) => {
    const filtered = !Array.isArray(updatedGoal)
      ? state.activeGoals.filter((goal: GoalType) => goal.id !== updatedGoal.id)
      : [];
    const updatedActiveGoals = !Array.isArray(updatedGoal)
      ? [updatedGoal, ...filtered].slice(0, 10) // Keep top 10 active goals
      : [];
    return {
      activeGoals: Array.isArray(updatedGoal) ? updatedGoal : updatedActiveGoals,
    };
  }),

  addToActiveGoals: (goalId) => set((state) => {
    const goal = state.goals.find((g) => g.id === goalId);
    if (goal && !state.activeGoals.find((ag) => ag.id === goalId)) {
      return {
        activeGoals: [goal, ...state.activeGoals].slice(0, 10),
      };
    }
    return state;
  }),

  removeFromActiveGoals: (goalId) => set((state) => ({
    activeGoals: state.activeGoals.filter((goal) => goal.id !== goalId),
  })),

  // Goal details management
  updateCurrentGoalDetails: (goal) => set({ currentGoalDetails: goal }),

  addGoalMilestone: (goalId, milestone) => set((state) => {
    if (state.currentGoalDetails.id === goalId) {
      const newMilestone = {
        ...milestone,
        id: Date.now(), // Simple ID generation
      };
      return {
        currentGoalDetails: {
          ...state.currentGoalDetails,
          milestones: [...state.currentGoalDetails.milestones, newMilestone],
        },
      };
    }
    return state;
  }),

  updateGoalMilestone: (goalId, milestoneId, updates) => set((state) => {
    if (state.currentGoalDetails.id === goalId) {
      return {
        currentGoalDetails: {
          ...state.currentGoalDetails,
          milestones: state.currentGoalDetails.milestones.map((milestone) =>
            milestone.id === milestoneId ? { ...milestone, ...updates } : milestone,
          ),
        },
      };
    }
    return state;
  }),

  deleteGoalMilestone: (goalId, milestoneId) => set((state) => {
    if (state.currentGoalDetails.id === goalId) {
      return {
        currentGoalDetails: {
          ...state.currentGoalDetails,
          milestones: state.currentGoalDetails.milestones.filter(
            (milestone) => milestone.id !== milestoneId,
          ),
        },
      };
    }
    return state;
  }),

  // Timer management
  updateStartTimer: (value) => set({ shouldStartTimer: value }),

  updateStartedAt: (value) => set((state) => ({
    currentGoalDetails: {
      ...state.currentGoalDetails,
      startedAt: value,
    },
  })),

  // Progress tracking
  updateGoalProgress: (goalId, progress) => {
    const { updateGoal } = get();
    updateGoal({ id: goalId, progress });
  },

  incrementGoalStreak: (goalId) => set((state) => {
    const goal = state.goals.find((g) => g.id === goalId);
    if (goal) {
      const { updateGoal } = get();
      updateGoal({ id: goalId, streak: goal.streak + 1 });
    }
    return state;
  }),

  resetGoalStreak: (goalId) => {
    const { updateGoal } = get();
    updateGoal({ id: goalId, streak: 0 });
  },

  updateWeeklyHours: (goalId, hours) => {
    const { updateGoal } = get();
    updateGoal({ id: goalId, currentWeekHours: hours });
  },

  // Achievement management
  addAchievement: (goalId, achievement) => set((state) => {
    const goal = state.goals.find((g) => g.id === goalId);
    if (goal && !goal.achievements.includes(achievement)) {
      const { updateGoal } = get();
      updateGoal({
        id: goalId,
        achievements: [...goal.achievements, achievement],
      });
    }
    return state;
  }),

  removeAchievement: (goalId, achievement) => set((state) => {
    const goal = state.goals.find((g) => g.id === goalId);
    if (goal) {
      const { updateGoal } = get();
      updateGoal({
        id: goalId,
        achievements: goal.achievements.filter((a) => a !== achievement),
      });
    }
    return state;
  }),
}));
