import { Stage } from './Stage.model';
import { Todo } from './Todo.model';

export type BoardSettings = {
  boardName: string;
  id?: string;
  stages: Stage[];
  todos?: Todo[];
  uid: string;
};