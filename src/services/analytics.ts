import { getHandler } from 'helpers/api';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type DateRangeParams = {
  startDate: string;
  endDate: string;
  prevStartDate?: string;
  prevEndDate?: string;
};

export type QuickMetrics = {
  totalTasks: number;
  completedTasks: number;
  totalGoals: number;
  completedGoals: number;
  totalFocusTime: number;
  currentStreak: number;
  productivityScore: number;
  previousPeriodComparison: {
    tasksChange: number;
    goalsChange: number;
    focusTimeChange: number;
    streakChange: number;
    productivityChange: number;
  };
};

export type ProductivityChartData = {
  daily: Array<{
    date: string;
    tasksCompleted: number;
    focusTime: number;
    productivityScore: number;
  }>;
  weekly: Array<{
    week: string;
    tasksCompleted: number;
    focusTime: number;
    productivityScore: number;
  }>;
  monthly: Array<{
    month: string;
    tasksCompleted: number;
    focusTime: number;
    productivityScore: number;
  }>;
};

export type TaskDistributionData = {
  byStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  byPriority: Array<{
    priority: string;
    count: number;
    percentage: number;
  }>;
  byCategory: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  byWorkspace: Array<{
    workspace: string;
    count: number;
    percentage: number;
  }>;
};

export type GoalProgress = {
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  overdue: number;
  completionRate: number;
  goals: Array<{
    id: string;
    title: string;
    progress: number;
    status: string;
    dueDate: string;
    category: string;
  }>;
};

export type TimeInsights = {
  peakProductivityHours: Array<{
    hour: number;
    productivityScore: number;
    tasksCompleted: number;
    focusTime: number;
  }>;
  weeklyPattern: Array<{
    dayOfWeek: string;
    averageProductivity: number;
    averageFocusTime: number;
    averageTasksCompleted: number;
  }>;
  totalFocusTime: number;
  averageDailyFocusTime: number;
  mostProductiveDay: string;
  leastProductiveDay: string;
};

export type StreakInfo = {
  currentStreak: number;
  longestStreak: number;
  streakType: 'daily' | 'weekly';
  lastActivityDate: string;
  streakHistory: Array<{
    date: string;
    maintained: boolean;
  }>;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
};

export type StreaksAndAchievements = {
  streaks: StreakInfo;
  achievements: Achievement[];
  recentAchievements: Achievement[];
  nextMilestones: Array<{
    title: string;
    description: string;
    progress: number;
    target: number;
  }>;
};

export type FocusSession = {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  taskId?: string;
  taskTitle?: string;
  productivity: number;
  interruptions: number;
};

export type FocusSessionInfo = {
  totalSessions: number;
  totalFocusTime: number;
  averageSessionLength: number;
  averageProductivity: number;
  sessions: FocusSession[];
  dailyStats: Array<{
    date: string;
    sessionsCount: number;
    totalTime: number;
    averageProductivity: number;
  }>;
};

export type AIInsight = {
  id: string;
  type: 'productivity' | 'time_management' | 'goal_setting' | 'focus' | 'general';
  title: string;
  description: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
  confidence: number;
  createdAt: string;
};

export type AIInsights = {
  insights: AIInsight[];
  summary: string;
  overallScore: number;
  recommendations: string[];
};

export type ExportReportData = {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: QuickMetrics;
  productivity: ProductivityChartData;
  tasks: TaskDistributionData;
  goals: GoalProgress;
  timeInsights: TimeInsights;
  streaksAndAchievements: StreaksAndAchievements;
  focusSessions: FocusSessionInfo;
  aiInsights: AIInsights;
  generatedAt: string;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const buildQueryParams = (params: DateRangeParams): string => {
  const queryParams = new URLSearchParams();

  queryParams.append('startDate', params.startDate);
  queryParams.append('endDate', params.endDate);

  if (params.prevStartDate) {
    queryParams.append('prevStartDate', params.prevStartDate);
  }
  if (params.prevEndDate) {
    queryParams.append('prevEndDate', params.prevEndDate);
  }

  return queryParams.toString();
};

// ============================================================================
// INDIVIDUAL API SERVICES
// ============================================================================

export const getQuickMetrics = async (params: DateRangeParams): Promise<QuickMetrics> => {
  const queryString = buildQueryParams(params);
  return getHandler({ path: `analytics/quick-metrics?${queryString}` });
};

export const getProductivityChartData = async (params: DateRangeParams): Promise<ProductivityChartData> => {
  const queryString = buildQueryParams(params);
  return getHandler({ path: `analytics/productivity-chart?${queryString}` });
};

export const getTaskDistributionData = async (params: DateRangeParams): Promise<TaskDistributionData> => {
  const queryString = buildQueryParams(params);
  return getHandler({ path: `analytics/task-distribution?${queryString}` });
};

export const getGoalProgress = async (params: DateRangeParams): Promise<GoalProgress> => {
  const queryString = buildQueryParams(params);
  return getHandler({ path: `analytics/goal-progress?${queryString}` });
};

export const getTimeInsights = async (params: DateRangeParams): Promise<TimeInsights> => {
  const queryString = buildQueryParams(params);
  return getHandler({ path: `analytics/time-insights?${queryString}` });
};

export const getStreaksAndAchievements = async (params: DateRangeParams): Promise<StreaksAndAchievements> => {
  const queryString = buildQueryParams(params);
  return getHandler({ path: `analytics/streaks-achievements?${queryString}` });
};

export const getFocusSessionInfo = async (params: DateRangeParams): Promise<FocusSessionInfo> => {
  const queryString = buildQueryParams(params);
  return getHandler({ path: `analytics/focus-sessions?${queryString}` });
};

export const getAIInsights = async (params: DateRangeParams): Promise<AIInsights> => {
  const queryString = buildQueryParams(params);
  return getHandler({ path: `analytics/ai-insights?${queryString}` });
};

export const getExportReportData = async (params: DateRangeParams): Promise<ExportReportData> => {
  const queryString = buildQueryParams(params);
  return getHandler({ path: `analytics/export-report?${queryString}` });
};
