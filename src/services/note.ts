import { postHandler } from 'src/helpers/api';

export const createNote = (data: object) => postHandler({
  path: 'note',
  body: JSON.stringify(data),
});

export const updateNote = (noteId: number, data: object) => postHandler({
  path: `note/${noteId}`,
  body: JSON.stringify(data),
  method: 'PATCH',
});

export const deleteNote = (noteId: number) => postHandler({
  path: `note/${noteId}`,
  method: 'DELETE',
});