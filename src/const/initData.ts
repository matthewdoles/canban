export const initStages = [
  { title: 'Todo', color: 'bg-blue-500', stageOrder: 1 },
  { title: 'In Progress', color: 'bg-primary', stageOrder: 2 },
  { title: 'Done', color: 'bg-green-500', stageOrder: 3 }
];

export const initTodo = {
  boardId: '',
  comments: [],
  id: '0',
  stage: 'None',
  description: '',
  title: '',
  created: Date.now(),
  assignee: ''
};
