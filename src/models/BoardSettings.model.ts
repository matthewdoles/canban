import { Stage } from './Stage.model';
import { Todo } from './Todo.model';

export type BoardSettings = {
  boardName: string;
  id: number;
  stages: Stage[];
  todos: Todo[];
  uid: string;
};
