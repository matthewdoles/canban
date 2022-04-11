import React from 'react';
import { BoardSettings } from '../../models/BoardSettings';

type Props = {
  board: BoardSettings;
};

const BoardCard = ({ board }: Props) => {
  return (
    <div className="bg-white drop-shadow-lg rounded-lg">
      <div className="bg-blue-500 p-1 rounded-t-lg">
        <p className="text-md text-white font-bold ml-2">{board.boardName}</p>
      </div>
      <div className=" flex flex-row p-2 text-lg">
        {board.stages.map((stage) => (
          <div key={stage.stageOrder} className="flex flex-row m-2 items-center">
            <div className={`${stage.color} h-4 w-4 mr-2 rounded-full`}></div>
            <p>2 {stage.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardCard;
