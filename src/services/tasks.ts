import { getHandler, postHandler } from 'src/helpers/api';

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

export const getTask = (taskId: string) => getHandler({
  path: `tasks/${taskId}`,
});

export const updateTask = (taskId: string, data: object) => postHandler({
  path: `tasks/${taskId}`,
  method: 'PATCH',
  body: JSON.stringify(data),
});