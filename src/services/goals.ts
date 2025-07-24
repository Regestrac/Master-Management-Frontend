import { getHandler } from 'helpers/api';

export const getAllGoals = (params: string) => getHandler({
  path: `tasks?type=goal${params ? `&${params}` : ''}`,
});