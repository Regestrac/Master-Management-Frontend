import { getHandler, postHandler } from 'src/helpers/api';

export const getProfile = () => getHandler({
  path: 'profile',
});

export const updateProfile = (data: object) => postHandler({
  path: 'profile',
  body: JSON.stringify(data),
  method: 'PUT',
});

export const updateActiveTask = (data: object) => postHandler({
  path: 'update-active-task',
  body: JSON.stringify(data),
  method: 'PATCH',
});