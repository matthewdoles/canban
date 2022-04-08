import React, { useState } from 'react';
import Column from './components/Column';
import TodoDetail from './components/TodoDetail.tsx';
import { sampleBoardSettings, sampleTodos } from './const/sampleData';
import { BoardSettings } from './models/BoardSettings';
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
  const [todos, setTodos] = useState<Todo[]>(sampleTodos);
  const [boardSettings] = useState<BoardSettings>(sampleBoardSettings);
  return (
    <div className="min-h-screen min-w-screen bg-zinc-300" style={{ fontFamily: 'Roboto' }}>
      <div className="drawer drawer-end">
        <input id="todo-detail-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <div className="flex flex-row w-full p-8">
            {boardSettings.stages.map((stage) => (
              <Column
                key={stage.title}
                activeTodo={activeTodo}
                activeHoverColumn={activeHoverColumn}
                color={stage.color}
                isDragging={isDragging}
                stage={stage.title}
                stageNumber={stage.stageOrder}
                todos={todos.filter((todo) => todo.stage === stage.title)}
                updateActiveDrag={(todo: Todo) => setActiveTodo(todo)}
                updateActiveHoverColumn={(column: number) => setActiveHoverColumn(column)}
                updateIsDragging={(dragging: boolean) => setIsDragging(dragging)}
                updateBoardTodos={(updatedTodo: Todo) => {
                  setTodos((prevTodos: Todo[]) => {
                    const newTodos = [...prevTodos.filter((t) => t.id !== updatedTodo.id)];
                    newTodos.push(updatedTodo);
                    newTodos.sort((a, b) => a.id - b.id);
                    return newTodos;
                  });
                }}
              />
            ))}
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="todo-detail-drawer" className="drawer-overlay"></label>
          <TodoDetail todo={activeTodo} />
        </div>
      </div>
    </div>
  );
}

export default App;
