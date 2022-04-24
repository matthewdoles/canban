import { BoardSharing } from './BoardSharing.model';
import { Stage } from './Stage.model';
import { Todo } from './Todo.model';

export type BoardSettings = {
  boardName: string;
  id?: string;
  sharing?: BoardSharing[];
  stages: Stage[];
  todos?: Todo[];
  uid: string;
};
