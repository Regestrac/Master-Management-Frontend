import { getHandler } from 'services/api';

export const getAllTasks = () => getHandler({
  path: 'tasks',
});