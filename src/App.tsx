import React from 'react';

function App() {
  return (
    <div className="min-h-screen min-w-screen bg-zinc-300">
      <div className="flex flex-row w-full p-8">
        <div className="w-1/4 min-h-[600px] bg-gray-100 m-2 drop-shadow-lg">
          <div className="bg-blue-700 p-2">
            <p className="text-lg text-white font-bold ml-2">
              <span className="badge mr-2">0</span>Todo
            </p>
          </div>
          <div className="min-h-[100px] bg-white m-3 drop-shadow-lg rounded-lg">
            <div className="bg-blue-700 p-1 rounded-t-lg">
              <p className="text-md text-white font-bold ml-2">Title</p>
            </div>
          </div>
          <div className="min-h-[100px] bg-white m-3 drop-shadow-lg rounded-lg">
            <div className="bg-blue-700 p-1 rounded-t-lg">
              <p className="text-md text-white font-bold ml-2">Title</p>
            </div>
          </div>
        </div>
        <div className="w-1/4 min-h-[600px] bg-gray-100 m-2 drop-shadow-lg">
          <div className="bg-yellow-400 p-2">
            <p className="text-lg text-white font-bold ml-2">
              <span className="badge mr-2">0</span>Todo
            </p>
          </div>
          <div className="min-h-[100px] bg-white m-3 drop-shadow-lg rounded-lg">
            <div className="bg-yellow-400 p-1 rounded-t-lg">
              <p className="text-md text-white font-bold ml-2">Title</p>
            </div>
          </div>
        </div>
        <div className="w-1/4 min-h-[600px] bg-gray-100 m-2 drop-shadow-lg">
          <div className="bg-purple-700 p-2">
            <p className="text-lg text-white font-bold ml-2">
              <span className="badge mr-2">0</span>Todo
            </p>
          </div>
          <div className="min-h-[100px] bg-white m-3 drop-shadow-lg rounded-lg">
            <div className="bg-purple-700 p-1 rounded-t-lg">
              <p className="text-md text-white font-bold ml-2">Title</p>
            </div>
          </div>
        </div>
        <div className="w-1/4 min-h-[600px] bg-gray-100 m-2 drop-shadow-lg">
          <div className="bg-green-600 p-2">
            <p className="text-lg text-white font-bold ml-2">
              <span className="badge mr-2">0</span>Todo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
