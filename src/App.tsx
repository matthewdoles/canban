import React, { useState } from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';
import TodoDetail from './components/TodoDetail';
import { todos } from './const/sampleData';
import { Todo } from './models/Todo.model';

function App() {
  const [boardTodos, setBoardTodos] = useState<Todo[]>(todos);
  const [activeDrag, setActiveDrag] = useState<number>(0);
  const [activeHoverColumn, setActiveHoverColumn] = useState<number>(0);
  const [activeDragColumn, setActiveDragColumn] = useState<string>('');

  return (
    <div className="min-h-screen min-w-screen bg-zinc-300">
      <div className="flex flex-row w-full p-8">
        <div className="static w-1/4 m-2 shadow-lg">
          <div className="bg-blue-700 p-2">
            <p className="text-lg text-white font-bold ml-2">
              <span className="badge mr-2">0</span>Todo
            </p>
          </div>
          <div
            className={`min-h-[600px] ${
              activeDragColumn !== 'Todo' && activeDrag !== 0
                ? `bg-green-50 ${
                    activeHoverColumn === 1 ? 'border-green-300' : 'border-transparent'
                  } border-4`
                : 'bg-gray-100 border-transparent border-4'
            }`}>
            {boardTodos
              .filter((todo) => todo.stage === 'Todo')
              .map((todo) => (
                <>
                  {(activeDrag === 0 || activeDrag === todo.id) && (
                    <TodoDetail
                      key={todo.title}
                      title={todo.title}
                      description={todo.description}
                      dragging={(_e: DraggableEvent, position: DraggableData) => {
                        const { x } = position;
                        const columnWidth = window.innerWidth / 4 - 30;
                        const column =
                          columnWidth > x
                            ? 1
                            : columnWidth * 2 > x && columnWidth < x
                            ? 2
                            : columnWidth * 3 > x && columnWidth * 2 < x
                            ? 3
                            : 4;
                        console.log(column);
                        setActiveHoverColumn(Math.floor(column));
                      }}
                      dragStart={() => {
                        setActiveDrag(todo.id);
                        setActiveDragColumn('Todo');
                      }}
                      dragStop={() => {
                        setBoardTodos((prevTodos: Todo[]) => {
                          const newTodos = [...prevTodos.filter((t) => t.id !== todo.id)];
                          newTodos.push({
                            ...todo,
                            stage:
                              activeHoverColumn === 1
                                ? 'Todo'
                                : activeHoverColumn === 2
                                ? 'In Progress'
                                : activeHoverColumn === 3
                                ? 'In Review'
                                : 'Done'
                          });
                          newTodos.sort((a, b) => a.id - b.id);
                          return newTodos;
                        });
                        setActiveDrag(0);
                        setActiveDragColumn('');
                      }}
                      color="bg-blue-700"
                      disabled={false}
                    />
                  )}
                </>
              ))}
          </div>
        </div>
        <div className="static w-1/4 m-2 shadow-lg">
          <div className="bg-yellow-400 p-2">
            <p className="text-lg text-white font-bold ml-2">
              <span className="badge mr-2">0</span>In Progress
            </p>
          </div>
          <div
            className={`min-h-[600px] ${
              activeDragColumn !== 'In Progress' && activeDrag !== 0
                ? `bg-green-50 ${
                    activeHoverColumn === 2 ? 'border-green-300' : 'border-transparent'
                  } border-4`
                : 'bg-gray-100 border-transparent border-4'
            }`}>
            {boardTodos
              .filter((todo) => todo.stage === 'In Progress')
              .map((todo) => (
                <>
                  {(activeDrag === 0 || activeDrag === todo.id) && (
                    <TodoDetail
                      key={todo.title}
                      title={todo.title}
                      description={todo.description}
                      dragging={() => {
                        console.log('drag');
                      }}
                      dragStart={() => {
                        setActiveDrag(todo.id);
                        setActiveDragColumn('In Progress');
                      }}
                      dragStop={() => {
                        setActiveDrag(0);
                        setActiveDragColumn('');
                      }}
                      color="bg-yellow-400"
                      disabled={false}
                    />
                  )}
                </>
              ))}
          </div>
        </div>
        <div className="static w-1/4 m-2 shadow-lg">
          <div className="bg-purple-700 p-2">
            <p className="text-lg text-white font-bold ml-2">
              <span className="badge mr-2">0</span>In Review
            </p>
          </div>
          <div
            className={`min-h-[600px] ${
              activeDragColumn !== 'In Review' && activeDrag !== 0
                ? `bg-green-50 ${
                    activeHoverColumn === 3 ? 'border-green-300' : 'border-transparent'
                  } border-4`
                : 'bg-gray-100 border-transparent border-4'
            }`}>
            {boardTodos
              .filter((todo) => todo.stage === 'In Review')
              .map((todo) => (
                <>
                  {(activeDrag === 0 || activeDrag === todo.id) && (
                    <TodoDetail
                      key={todo.title}
                      title={todo.title}
                      description={todo.description}
                      dragging={() => {
                        console.log('drag');
                      }}
                      dragStart={() => {
                        setActiveDrag(todo.id);
                        setActiveDragColumn('In Review');
                      }}
                      dragStop={() => {
                        setActiveDrag(0);
                        setActiveDragColumn('');
                      }}
                      color="bg-purple-700"
                      disabled={false}
                    />
                  )}
                </>
              ))}
          </div>
        </div>
        <div className="static w-1/4 m-2 shadow-lg">
          <div className="bg-green-600 p-2">
            <p className="text-lg text-white font-bold ml-2">
              <span className="badge mr-2">0</span>Done
            </p>
          </div>
          <div
            className={`min-h-[600px] ${
              activeDragColumn !== 'Done' && activeDrag !== 0
                ? `bg-green-50 ${
                    activeHoverColumn === 4 ? 'border-green-300' : 'border-transparent'
                  } border-4`
                : 'bg-gray-100 border-transparent border-4'
            }`}>
            {boardTodos
              .filter((todo) => todo.stage === 'Done')
              .map((todo) => (
                <>
                  {(activeDrag === 0 || activeDrag === todo.id) && (
                    <TodoDetail
                      key={todo.title}
                      title={todo.title}
                      description={todo.description}
                      dragging={() => {
                        console.log('drag');
                      }}
                      dragStart={() => {
                        console.log('start');
                      }}
                      dragStop={() => {
                        console.log('start');
                      }}
                      color="bg-green-700"
                      disabled={true}
                    />
                  )}
                </>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
