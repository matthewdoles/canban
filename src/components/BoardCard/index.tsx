import React from 'react';
const BoardCard = () => {
  return (
    <div className="bg-white drop-shadow-lg rounded-lg">
      <div className="bg-blue-500 p-1 rounded-t-lg">
        <p className="text-md text-white font-bold ml-2">My Sample Board 1</p>
      </div>
      <div className=" flex flex-row p-2 text-lg">
        <div className="flex flex-row m-2 items-center">
          <div className="bg-blue-500 h-4 w-4 mr-2 rounded-full"></div>
          <p>2 Todo</p>
        </div>
        <div className="flex flex-row m-2 items-center">
          <div className="bg-yellow-400 h-4 w-4 mr-2 rounded-full"></div>
          <p>1 In Progress</p>
        </div>
        <div className="flex flex-row m-2 items-center">
          <div className="bg-green-500 h-4 w-4 mr-2 rounded-full"></div>
          <p>0 Done</p>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
