import { getHandler, postHandler } from 'helpers/api';

// Get all goals with optional query parameters
export const getAllGoals = (params: string) => getHandler({
  path: `tasks?type=goal${params ? `&${params}` : ''}`,
});

// Get a specific goal by ID
export const getGoal = (goalId: string | number) => getHandler({
  path: `tasks/${goalId}`,
});

// Create a new goal
export const createGoal = (data: object) => postHandler({
  path: 'task',
  body: JSON.stringify(data),
});

// Update an existing goal
export const updateGoal = (goalId: string | number, data: object) => postHandler({
  path: `tasks/${goalId}`,
  method: 'PATCH',
  body: JSON.stringify(data),
});

// Delete a goal
export const deleteGoal = (goalId: string | number) => postHandler({
  path: `tasks/${goalId}`,
  method: 'DELETE',
});

// Get goal statistics (progress, completion rates, etc.)
export const getGoalStats = () => getHandler({
  path: 'goals/stats',
});

// Get active goals (currently being worked on)
export const getActiveGoals = () => getHandler({
  path: 'goals/active',
});