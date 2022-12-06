import React from 'react';
import { BounceLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import { AiFillEye } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

import { Stage } from '../../../models/Stage.model';
import { useAppSelector } from '../../../hooks';
import { BoardSettings } from '../../../models/BoardSettings.model';
import { Todo } from '../../../models/Todo.model';

type Props = {
  board: BoardSettings;
  todos: Todo[] | null;
  selectedBoardId: number;
  handleDeleteBoard: (board: BoardSettings) => void;
};

const BoardCard = ({ board, todos, selectedBoardId, handleDeleteBoard }: Props) => {
  const { boardsLoading } = useAppSelector((state) => state.boards);
  const { profile } = useAppSelector((state) => state.profile);

  return (
    <div className="bg-white drop-shadow-lg rounded-lg h-full">
      <div className="bg-primary p-1 rounded-t-lg">
        <p className="text-lg font-bold text-white ml-2" style={{ fontFamily: 'Noto Sans' }}>
          {board.boardName}
        </p>
      </div>
      {selectedBoardId === board.id && boardsLoading && (
        <div className="flex flex-row justify-center p-4">
          <BounceLoader size={75} color="#FFD369 " />
        </div>
      )}
      {!boardsLoading || (selectedBoardId !== board.id && boardsLoading) ? (
        <div className="flex flex-row justify-between p-2 text-lg rounded">
          <div>
            {board.stages.map((stage: Stage) => (
              <div key={stage.stageOrder} className="flex flex-row m-2 items-center">
                <div className={`${stage.color} h-5 w-5 mr-2 rounded-full`}></div>
                <p className="text-xl">
                  {todos?.filter((todo) => todo.stage === stage.title).length} {stage.title}
                </p>
              </div>
            ))}
          </div>
          <div className="flex mt-2 mr-2">
            <div className="avatar placeholder justify-end">
              <div className="w-10 h-10 rounded-full bg-primary">
                {profile.photoURL.length === 0 ? (
                  <span className="text-xl text-white font-bold">{profile.username.charAt(0)}</span>
                ) : (
                  <img src={profile.photoURL} />
                )}
              </div>
            </div>
            <div className="absolute flex bottom-2 right-4">
              <div className="tooltip font-bold" data-tip="Delete">
                <label htmlFor="delete-board-modal">
                  <MdDelete
                    size={24}
                    className="mr-2 cursor-pointer text-red-500"
                    onClick={() => handleDeleteBoard(board)}
                  />
                </label>
              </div>
              <Link key={board.id} to={`/board/${board.id}`}>
                <div className="tooltip font-bold" data-tip="Open">
                  <AiFillEye size={24} className="ml-2 cursor-pointer text-blue-500" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BoardCard;
