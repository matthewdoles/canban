import { Comment } from './Comment.model';

export type Todo = {
  assignee: string;
  comments: Comment[];
  created: number;
  description: string;
  id: string;
  isArchived: boolean;
  stage: string;
  title: string;
};
