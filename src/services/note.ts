import { getHandler, postHandler } from 'src/helpers/api';

export const createNote = (data: object) => postHandler({
  path: 'note',
  body: JSON.stringify(data),
});

export const updateNote = (noteId: number, data: object) => postHandler({
  path: `notes/${noteId}`,
  body: JSON.stringify(data),
  method: 'PATCH',
});

export const deleteNote = (noteId: number) => postHandler({
  path: `notes/${noteId}`,
  method: 'DELETE',
});

export const getAllNotes = (taskId: number | string) => getHandler({
  path: `notes?task_id=${taskId}`,
});