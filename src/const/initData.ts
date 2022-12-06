import { v4 as uuidv4 } from 'uuid';

import { BoardSettings } from '../models/BoardSettings.model';
import { Stage } from '../models/Stage.model';
import { Todo } from '../models/Todo.model';

export const initStages: Stage[] = [
  { title: 'Todo', color: 'bg-blue-500', stageOrder: 1 },
  { title: 'In Progress', color: 'bg-primary', stageOrder: 2 },
  { title: 'Done', color: 'bg-green-500', stageOrder: 3 }
];

export const initTodo: Todo = {
  comments: [],
  id: '0',
  stage: 'None',
  description: '',
  title: '',
  created: Date.now(),
  assignee: '',
  isArchived: false
};

export const initBoard: BoardSettings = {
  boardName: '',
  id: 0,
  stages: [],
  todos: [],
  uid: ''
};

export const newUserBoard = {
  boardName: 'My First Board',
  stages: initStages,
  todos: [
    {
      comments: [
        {
          author: '',
          date: Date.now(),
          description: 'Use the buttons in the top right to Edit, Archive, and Delete your tasks.'
        }
      ],
      id: uuidv4(),
      stage: 'Todo',
      description: 'Click here to open details.',
      title: 'Drag here to move to another stage.',
      created: Date.now(),
      assignee: '',
      isArchived: false
    }
  ],
  uid: ''
};
