import { getHandler, postHandler } from 'src/helpers/api';

export const getProfile = () => getHandler({
  path: 'profile',
});

export const updateProfile = (data: object) => postHandler({
  path: 'profile',
  body: JSON.stringify(data),
  method: 'PUT',
});