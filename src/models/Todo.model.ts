import { Comment } from './Comment.model';

export type Todo = {
  boardId: string;
  comments: Comment[];
  description: string;
  stage: string;
  id?: string;
  title: string;
};
