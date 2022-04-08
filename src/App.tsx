import React, { useState } from 'react';
import Column from './components/Column';
import TodoDetail from './components/TodoDetail.tsx';
import { todos } from './const/sampleData';
import { Todo } from './models/Todo.model';

function App() {
  const [activeTodo, setActiveTodo] = useState<Todo>({
    id: 0,
    stage: 'None',
    description: '',
    title: ''
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeHoverColumn, setActiveHoverColumn] = useState<number>(0);
  const [boardTodos, setBoardTodos] = useState<Todo[]>(todos);
  return (
    <div className="min-h-screen min-w-screen bg-zinc-300">
      <div className="drawer drawer-end">
        <input id="todo-detail-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <div className="flex flex-row w-full p-8">
            <Column
              activeTodo={activeTodo}
              activeHoverColumn={activeHoverColumn}
              color="bg-blue-500"
              isDragging={isDragging}
              stage="Todo"
              stageNumber={1}
              todos={boardTodos.filter((todo) => todo.stage === 'Todo')}
              updateActiveDrag={(todo: Todo) => setActiveTodo(todo)}
              updateActiveHoverColumn={(column: number) => setActiveHoverColumn(column)}
              updateIsDragging={(dragging: boolean) => setIsDragging(dragging)}
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
              activeTodo={activeTodo}
              activeHoverColumn={activeHoverColumn}
              color="bg-yellow-300"
              isDragging={isDragging}
              stage="In Progress"
              stageNumber={2}
              todos={boardTodos.filter((todo) => todo.stage === 'In Progress')}
              updateActiveDrag={(todo: Todo) => setActiveTodo(todo)}
              updateActiveHoverColumn={(column: number) => setActiveHoverColumn(column)}
              updateIsDragging={(dragging: boolean) => setIsDragging(dragging)}
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
              activeTodo={activeTodo}
              activeHoverColumn={activeHoverColumn}
              color="bg-purple-500"
              isDragging={isDragging}
              stage="In Review"
              stageNumber={3}
              todos={boardTodos.filter((todo) => todo.stage === 'In Review')}
              updateActiveDrag={(todo: Todo) => setActiveTodo(todo)}
              updateActiveHoverColumn={(column: number) => setActiveHoverColumn(column)}
              updateIsDragging={(dragging: boolean) => setIsDragging(dragging)}
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
              activeTodo={activeTodo}
              activeHoverColumn={activeHoverColumn}
              color="bg-green-500"
              isDragging={isDragging}
              stage="Done"
              stageNumber={4}
              todos={boardTodos.filter((todo) => todo.stage === 'Done')}
              updateActiveDrag={(todo: Todo) => setActiveTodo(todo)}
              updateActiveHoverColumn={(column: number) => setActiveHoverColumn(column)}
              updateIsDragging={(dragging: boolean) => setIsDragging(dragging)}
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
        <div className="drawer-side">
          <label htmlFor="todo-detail-drawer" className="drawer-overlay"></label>
          <TodoDetail color="bg-blue-500" todo={activeTodo} />
        </div>
      </div>
    </div>
  );
}

export default App;
