import { getHandler, postHandler } from 'services/api';

export const getAllTasks = () => getHandler({
  path: 'tasks',
});

export const createTask = (data: object) => postHandler({
  path: 'task',
  body: JSON.stringify(data),
});

export const deleteTask = (taskId: number) => postHandler({
  path: `tasks/${taskId}`,
  method: 'DELETE',
});