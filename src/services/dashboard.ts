import { getHandler } from 'helpers/api';

export const getQuickStats = () => getHandler({
  path: 'dashboard/quick-stats',
});

export const getActiveGoals = () => getHandler({
  path: 'goals/active',
});

export const getRecentTasks = () => getHandler({
  path: 'recent-tasks',
});