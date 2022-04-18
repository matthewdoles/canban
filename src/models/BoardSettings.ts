import { Stage } from './Stage';
import { Todo } from './Todo.model';

export type BoardSettings = {
  boardName: string;
  id?: string;
  stages: Stage[];
  todos?: Todo[];
};
