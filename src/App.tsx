import React, { useState } from 'react';
import Column from './components/Column';
import { todos } from './const/sampleData';
import { Todo } from './models/Todo.model';

function App() {
  const [activeDrag, setActiveDrag] = useState<Todo>({
    id: 0,
    stage: 'None',
    description: '',
    title: ''
  });
  const [activeHoverColumn, setActiveHoverColumn] = useState<number>(0);
  const [boardTodos, setBoardTodos] = useState<Todo[]>(todos);
  return (
    <div className="min-h-screen min-w-screen bg-zinc-300">
      <div className="flex flex-row w-full p-8">
        <Column
          activeDrag={activeDrag}
          activeHoverColumn={activeHoverColumn}
          color="bg-blue-500"
          stage="Todo"
          stageNumber={1}
          todos={boardTodos.filter((todo) => todo.stage === 'Todo')}
          updateActiveDrag={(todo: Todo) => setActiveDrag(todo)}
          updateActiveHoverColumn={(column: number) => setActiveHoverColumn(column)}
          updateBoardTodos={(updatedTodo: Todo) => {
            setBoardTodos((prevTodos: Todo[]) => {
              const newTodos = [...prevTodos.filter((t) => t.id !== updatedTodo.id)];
              newTodos.push(updatedTodo);
              newTodos.sort((a, b) => a.id - b.id);
              return newTodos;
            });
          }}
        />
        <Column
          activeDrag={activeDrag}
          activeHoverColumn={activeHoverColumn}
          color="bg-yellow-300"
          stage="In Progress"
          stageNumber={2}
          todos={boardTodos.filter((todo) => todo.stage === 'In Progress')}
          updateActiveDrag={(todo: Todo) => setActiveDrag(todo)}
          updateActiveHoverColumn={(column: number) => setActiveHoverColumn(column)}
          updateBoardTodos={(updatedTodo: Todo) => {
            setBoardTodos((prevTodos: Todo[]) => {
              const newTodos = [...prevTodos.filter((t) => t.id !== updatedTodo.id)];
              newTodos.push(updatedTodo);
              newTodos.sort((a, b) => a.id - b.id);
              return newTodos;
            });
          }}
        />
        <Column
          activeDrag={activeDrag}
          activeHoverColumn={activeHoverColumn}
          color="bg-purple-500"
          stage="In Review"
          stageNumber={3}
          todos={boardTodos.filter((todo) => todo.stage === 'In Review')}
          updateActiveDrag={(todo: Todo) => setActiveDrag(todo)}
          updateActiveHoverColumn={(column: number) => setActiveHoverColumn(column)}
          updateBoardTodos={(updatedTodo: Todo) => {
            setBoardTodos((prevTodos: Todo[]) => {
              const newTodos = [...prevTodos.filter((t) => t.id !== updatedTodo.id)];
              newTodos.push(updatedTodo);
              newTodos.sort((a, b) => a.id - b.id);
              return newTodos;
            });
          }}
        />
        <Column
          activeDrag={activeDrag}
          activeHoverColumn={activeHoverColumn}
          color="bg-green-500"
          stage="Done"
          stageNumber={4}
          todos={boardTodos.filter((todo) => todo.stage === 'Done')}
          updateActiveDrag={(todo: Todo) => setActiveDrag(todo)}
          updateActiveHoverColumn={(column: number) => setActiveHoverColumn(column)}
          updateBoardTodos={(updatedTodo: Todo) => {
            setBoardTodos((prevTodos: Todo[]) => {
              const newTodos = [...prevTodos.filter((t) => t.id !== updatedTodo.id)];
              newTodos.push(updatedTodo);
              newTodos.sort((a, b) => a.id - b.id);
              return newTodos;
            });
          }}
        />
      </div>
    </div>
  );
}

export default App;
