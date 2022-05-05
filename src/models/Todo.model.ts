import { Comment } from './Comment.model';

export type Todo = {
  assignee: string;
  boardId: string;
  comments: Comment[];
  created: number;
  description: string;
  stage: string;
  id: string;
  title: string;
};
