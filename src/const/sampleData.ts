import { BoardSettings } from '../models/BoardSettings';
import { Todo } from '../models/Todo.model';

export const sampleTodos: Todo[] = [
  {
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    id: 1,
    stage: 'Todo',
    title: 'Todo 1'
  },
  {
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    id: 2,
    stage: 'In Progress',
    title: 'Todo 2'
  },
  {
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    id: 3,
    stage: 'In Review',
    title: 'Todo 3'
  }
];

export const sampleBoardSettings: BoardSettings = {
  boardName: 'My Board',
  stages: [
    { title: 'Todo', color: 'bg-blue-500', stageOrder: 1 },
    { title: 'In Progress', color: 'bg-yellow-300', stageOrder: 2 },
    { title: 'In Review', color: 'bg-purple-500', stageOrder: 3 },
    { title: 'Done', color: 'bg-green-500', stageOrder: 4 }
  ]
};

export const sampleBoardSettings2: BoardSettings = {
  boardName: 'My Board',
  stages: [
    { title: 'Todo', color: 'bg-blue-500', stageOrder: 1 },
    { title: 'In Progress', color: 'bg-yellow-300', stageOrder: 2 },
    { title: 'Done', color: 'bg-green-500', stageOrder: 3 }
  ]
};
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
