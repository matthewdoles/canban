import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillEye } from 'react-icons/ai';
import { MdDelete, MdOutlineModeEditOutline } from 'react-icons/md';
import { BounceLoader } from 'react-spinners';

import { BoardSettings } from '../../models/BoardSettings.model';
import { Todo } from '../../models/Todo.model';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { SET_ACTIVE_BOARD } from '../../store/reducers/boards';

type Props = {
  board: BoardSettings;
  todos: Todo[];
  selectedBoard: BoardSettings;
  updateSelectedBoard: (board: BoardSettings) => void;
};

const BoardCard = ({ board, todos, selectedBoard, updateSelectedBoard }: Props) => {
  const boards = useAppSelector((state) => state.boards);
  const user = useAppSelector((state) => state.user.firebaseUser);
  const dispatch = useAppDispatch();

  return (
    <div className="bg-white drop-shadow-lg rounded-lg">
      <div className="bg-blue-500 p-1 rounded-t-lg">
        <p className="text-lg text-white ml-2" style={{ fontFamily: 'Noto Sans' }}>
          {board.boardName}
        </p>
      </div>
      {selectedBoard.id === board.id && boards.loading && (
        <div className="flex flex-row justify-center p-4">
          <BounceLoader size={75} color="#3B82F6 " />
        </div>
      )}
      {!boards.loading || (selectedBoard.id !== board.id && boards.loading) ? (
        <div className="flex flex-row justify-between p-2 text-lg">
          <div>
            {board.stages.map((stage) => (
              <div key={stage.stageOrder} className="flex flex-row m-2 items-center">
                <div className={`${stage.color} h-4 w-4 mr-2 rounded-full`}></div>
                <p>
                  {todos.filter((todo) => todo.stage === stage.title).length} {stage.title}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-between mt-2 mr-2">
            <div className="avatar placeholder justify-end">
              <div className="w-10 h-10 rounded-full bg-blue-500">
                {user !== null && (
                  <>
                    {user.photoURL === null || user.photoURL.length === 0 ? (
                      <span className="text-xl text-white font-bold">
                        {user.displayName.charAt(0)}
                      </span>
                    ) : (
                      <img src={user.photoURL} />
                    )}
                  </>
                )}
              </div>
            </div>
            <div>
              <div className="tooltip" data-tip="Delete">
                <label htmlFor="delete-board-modal">
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
              <Link
                key={board.id}
                to={`/board/${board.id}`}
                onClick={() => dispatch({ type: SET_ACTIVE_BOARD, board })}>
                <div className="tooltip" data-tip="Open">
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
