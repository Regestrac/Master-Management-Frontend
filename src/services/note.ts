import { postHandler } from 'src/helpers/api';

export const createNote = (data: object) => postHandler({
  path: 'note',
  body: JSON.stringify(data),
});