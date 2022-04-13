import { Todo } from '../models/Todo.model';

export const sampleTodos: Todo[] = [
  {
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    id: 1,
    boardId: '',
    stage: 'Todo',
    title: 'Todo 1'
  },
  {
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    id: 2,
    boardId: '',
    stage: 'In Progress',
    title: 'Todo 2'
  },
  {
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    id: 3,
    boardId: '',
    stage: 'In Review',
    title: 'Todo 3'
  }
];

export const stageColors = [
  'bg-red-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-yellow-400',
  'bg-orange-400',
  'bg-blue-500',
  'bg-cyan-400',
  'bg-pink-400'
];
