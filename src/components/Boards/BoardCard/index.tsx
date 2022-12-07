import React from 'react';
import { BounceLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import { AiFillEye } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

import { useAppSelector } from '../../../hooks';
import { BoardSettings } from '../../../models/BoardSettings.model';
import { Stage } from '../../../models/Stage.model';
import { Todo } from '../../../models/Todo.model';
import { colors, notoSans } from '../../../const';

type Props = {
  board: BoardSettings;
  handleDeleteBoard: (board: BoardSettings) => void;
  selectedBoardId: number;
  todos: Todo[] | null;
};

const BoardCard = ({ board, handleDeleteBoard, selectedBoardId, todos }: Props) => {
  const { boardsLoading } = useAppSelector((state) => state.boards);
  const { profile } = useAppSelector((state) => state.profile);

  return (
    <div className="bg-white drop-shadow-lg rounded-lg h-full">
      <div className="bg-primary p-1 rounded-t-lg">
        <p className="text-lg text-white font-bold ml-2" style={{ fontFamily: notoSans }}>
          {board.boardName}
        </p>
      </div>
      {boardsLoading && selectedBoardId === board.id ? (
        <div className="flex flex-row justify-center p-4">
          <BounceLoader size={75} color={colors.primary} />
        </div>
      ) : null}
      {!boardsLoading || (selectedBoardId !== board.id && boardsLoading) ? (
        <div className="flex flex-row justify-between text-lg rounded p-4">
          <div>
            {board.stages.map((stage: Stage) => (
              <div key={stage.stageOrder} className="flex flex-row items-center m-2">
                <div className={`${stage.color} h-5 w-5 rounded-full mr-2`}></div>
                <p className="text-xl">
                  {todos?.filter((todo) => todo.stage === stage.title).length} {stage.title}
                </p>
              </div>
            ))}
          </div>
          <div className="flex">
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
                <MdDelete
                  className="mr-2 cursor-pointer text-red-500"
                  onClick={() => handleDeleteBoard(board)}
                  size={24}
                />
              </div>
              <Link key={board.id} to={`/board/${board.id}`}>
                <div className="tooltip font-bold" data-tip="Open">
                  <AiFillEye className="cursor-pointer text-blue-500 ml-2" size={24} />
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
