import { getHandler } from 'src/helpers/api';

export const getHistory = (taskId: string) => getHandler({
  path: `tasks/${taskId}/history`,
});