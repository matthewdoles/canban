import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillEye } from 'react-icons/ai';
import { MdDelete, MdOutlineModeEditOutline } from 'react-icons/md';

import { BoardSettings } from '../../models/BoardSettings';

type Props = {
  board: BoardSettings;
  updateSelectedBoard: (board: BoardSettings) => void;
};

const BoardCard = ({ board, updateSelectedBoard }: Props) => {
  return (
    <div className="bg-white drop-shadow-lg rounded-lg">
      <div className="bg-blue-500 p-1 rounded-t-lg">
        <p className="text-md text-white font-bold ml-2">{board.boardName}</p>
      </div>
      <div className=" flex flex-row justify-between p-2 text-lg">
        <div>
          {board.stages.map((stage) => (
            <div key={stage.stageOrder} className="flex flex-row m-2 items-center">
              <div className={`${stage.color} h-4 w-4 mr-2 rounded-full`}></div>
              <p>2 {stage.title}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-between mt-2 mr-2">
          <div className="avatar justify-end">
            <div className="w-10 h-10 rounded-full">
              <img src="https://avatars.githubusercontent.com/u/38084552?s=48&v=4" />
            </div>
          </div>
          <div>
            <div className="tooltip" data-tip="Delete">
              <label htmlFor="modal">
                <MdDelete
                  size={24}
                  className="mr-2 cursor-pointer text-red-500"
                  onClick={() => updateSelectedBoard(board)}
                />
              </label>
            </div>
            <div className="tooltip" data-tip="Edit">
              <label htmlFor="board-form">
                <MdOutlineModeEditOutline
                  size={24}
                  className="mx-2 cursor-pointer text-green-500"
                  onClick={() => updateSelectedBoard(board)}
                />
              </label>
            </div>
            <Link key={board.id} to={`/board/${board.id}`}>
              <div className="tooltip" data-tip="Open">
                <AiFillEye size={24} className="ml-2 cursor-pointer text-blue-500" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
