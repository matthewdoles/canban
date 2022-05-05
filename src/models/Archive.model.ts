import { Todo } from './Todo.model';

export type Archive = {
  id?: string;
  boardId?: string;
  todos?: Todo[];
};
