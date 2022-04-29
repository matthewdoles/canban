import { Comment } from './Comment.model';

export type Todo = {
  assignee: string;
  boardId: string;
  comments: Comment[];
  due: number;
  description: string;
  stage: string;
  id: string;
  title: string;
};
