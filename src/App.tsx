import React, { useState } from 'react';
import Todo from './components/Todo';
import { todos } from './const/sampleData';

function App() {
  const [activeDrag, setActiveDrag] = useState<boolean>(false);
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
              activeDragColumn !== 'Todo' && activeDrag
                ? 'bg-green-50 border-green-300 border-4'
                : 'bg-gray-100 border-transparent border-4'
            }`}>
            {todos
              .filter((todo) => todo.stage === 'Todo')
              .map((todo) => (
                <Todo
                  key={todo.title}
                  title={todo.title}
                  description={todo.description}
                  dragStart={() => {
                    setActiveDrag(true);
                    setActiveDragColumn('Todo');
                  }}
                  dragStop={() => {
                    setActiveDrag(false);
                    setActiveDragColumn('');
                  }}
                  color="bg-blue-700"
                  disabled={false}
                />
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
              activeDragColumn !== 'In Progress' && activeDrag
                ? 'bg-green-50 border-green-300 border-4'
                : 'bg-gray-100 border-transparent border-4'
            }`}>
            {todos
              .filter((todo) => todo.stage === 'In Progress')
              .map((todo) => (
                <Todo
                  key={todo.title}
                  title={todo.title}
                  description={todo.description}
                  dragStart={() => {
                    setActiveDrag(true);
                    setActiveDragColumn('In Progress');
                  }}
                  dragStop={() => {
                    setActiveDrag(false);
                    setActiveDragColumn('');
                  }}
                  color="bg-yellow-400"
                  disabled={false}
                />
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
              activeDragColumn !== 'In Review' && activeDrag
                ? 'bg-green-50 border-green-300 border-4'
                : 'bg-gray-100 border-transparent border-4'
            }`}>
            {todos
              .filter((todo) => todo.stage === 'In Review')
              .map((todo) => (
                <Todo
                  key={todo.title}
                  title={todo.title}
                  description={todo.description}
                  dragStart={() => {
                    setActiveDrag(true);
                    setActiveDragColumn('In Review');
                  }}
                  dragStop={() => {
                    setActiveDrag(false);
                    setActiveDragColumn('');
                  }}
                  color="bg-purple-700"
                  disabled={false}
                />
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
              activeDragColumn !== 'Done' && activeDrag
                ? 'bg-green-50 border-green-300 border-4'
                : 'bg-gray-100 border-transparent border-4'
            }`}>
            {todos
              .filter((todo) => todo.stage === 'Done')
              .map((todo) => (
                <Todo
                  key={todo.title}
                  title={todo.title}
                  description={todo.description}
                  dragStart={() => {
                    console.log('start');
                  }}
                  dragStop={() => {
                    console.log('start');
                  }}
                  color="bg-green-700"
                  disabled={true}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
