import { getHandler } from 'services/api';

export const getProfile = () => getHandler({
  path: 'profile',
});