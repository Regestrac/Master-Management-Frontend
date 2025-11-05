import { getHandler, postHandler } from 'src/helpers/api';

// Fetch the current user's settings
export const getUserSettings = () => getHandler({
  path: 'settings',
});

// Update the current user's settings
export const updateUserSettings = (data: object) => postHandler({
  path: 'settings',
  method: 'PATCH',
  body: JSON.stringify(data),
});

// Reset the current user's settings to defaults
export const resetUserSettings = () => postHandler({
  path: 'settings/reset',
  method: 'PUT',
});

// Delete all data for the current user (irreversible)
export const deleteAllUserData = () => postHandler({
  path: 'settings/delete-all-data',
  method: 'DELETE',
});

export const updateTheme = (data: object) => postHandler({
  path: 'update-theme',
  body: JSON.stringify(data),
  method: 'PATCH',
});

export const getStorageUsage = () => getHandler({
  path: 'settings/storage',
});
