import { getHandler, postHandler } from 'src/helpers/api';

export const getAllTasks = (params: string) => getHandler({
  path: `tasks?type=task${params ? `&${params}` : ''}`,
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

export const generateDescription = (taskId: string, data: object) => postHandler({
  path: `task/${taskId}/generate-description`,
  body: JSON.stringify(data),
});

export const getSubTasks = (taskId: string) => getHandler({
  path: `tasks/${taskId}/subtasks`,
});

export const generateSubTasks = (taskId: string, data: object) => postHandler({
  path: `tasks/${taskId}/generate-subtasks`,
  body: JSON.stringify(data),
});

export const saveSubTasks = (taskId: string, data: object) => postHandler({
  path: `tasks/${taskId}/subtasks`,
  body: JSON.stringify(data),
});

export const getRecentTasks = () => getHandler({
  path: 'recent-tasks',
});

export const getTasksStats = () => getHandler({
  path: 'tasks/stats',
});