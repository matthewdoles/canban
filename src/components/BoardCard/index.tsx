import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillEye } from 'react-icons/ai';
import { MdDelete, MdOutlineStar, MdShare, MdStarOutline } from 'react-icons/md';
import { BounceLoader } from 'react-spinners';

import { BoardSettings } from '../../models/BoardSettings.model';
import { Todo } from '../../models/Todo.model';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { SET_ACTIVE_BOARD } from '../../store/reducers/boards';
import { updateUser } from '../../store/reducers/user';

type Props = {
  board: BoardSettings;
  todos: Todo[] | null;
  selectedBoard: BoardSettings;
  updateSelectedBoard: (board: BoardSettings) => void;
};

const BoardCard = ({ board, todos, selectedBoard, updateSelectedBoard }: Props) => {
  const boards = useAppSelector((state) => state.boards);
  const user = useAppSelector((state) => state.user.firebaseUser);
  const dispatch = useAppDispatch();

  return (
    <div className="bg-white drop-shadow-lg rounded-lg">
      <div className="bg-primary p-1 rounded-t-lg">
        <p className="text-lg font-bold text-white ml-2" style={{ fontFamily: 'Noto Sans' }}>
          {board.boardName}
        </p>
      </div>
      {selectedBoard.id === board.id && boards.loading && (
        <div className="flex flex-row justify-center p-4">
          <BounceLoader size={75} color="#3B82F6 " />
        </div>
      )}
      {!boards.loading || (selectedBoard.id !== board.id && boards.loading) ? (
        <div className="flex flex-row justify-between p-2 text-lg rounded">
          <div>
            {board.stages.map((stage) => (
              <div key={stage.stageOrder} className="flex flex-row m-2 items-center">
                <div className={`${stage.color} h-5 w-5 mr-2 rounded-full`}></div>
                <p className="text-xl">
                  {todos?.filter((todo) => todo.stage === stage.title).length} {stage.title}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-between mt-2 mr-2">
            <div className="avatar placeholder justify-end">
              <div className="w-10 h-10 rounded-full bg-primary">
                {user !== null && (
                  <>
                    {user.photoURL === null || user.photoURL.length === 0 ? (
                      <span className="text-xl text-white font-bold">
                        {user.displayName ? user.displayName.charAt(0) : user.email.charAt(0)}
                      </span>
                    ) : (
                      <img src={user.photoURL} />
                    )}
                  </>
                )}
              </div>
            </div>
            <div>
              <div className="tooltip font-bold" data-tip="Delete">
                <label htmlFor="delete-board-modal">
                  <MdDelete
                    size={24}
                    className="mr-2 cursor-pointer text-red-500"
                    onClick={() => updateSelectedBoard(board)}
                  />
                </label>
              </div>
              <div className="tooltip font-bold" data-tip="Share">
                <label htmlFor="share-form">
                  <MdShare
                    size={24}
                    className="mx-2 cursor-pointer text-purple-500"
                    onClick={() => updateSelectedBoard(board)}
                  />
                </label>
              </div>
              <div className="tooltip font-bold" data-tip="Favorite">
                {user.favorites.includes(board.id) ? (
                  <label>
                    <MdOutlineStar
                      size={24}
                      className="mx-2 cursor-pointer text-yellow-500"
                      onClick={() =>
                        dispatch(
                          updateUser({
                            ...user,
                            favorites: user.favorites.filter((id: string) => id !== board.id)
                          })
                        )
                      }
                    />
                  </label>
                ) : (
                  <label>
                    <MdStarOutline
                      size={24}
                      className="mx-2 cursor-pointer text-yellow-500"
                      onClick={() =>
                        dispatch(
                          updateUser({
                            ...user,
                            favorites: [...user.favorites, board.id]
                          })
                        )
                      }
                    />
                  </label>
                )}
              </div>
              <Link
                key={board.id}
                to={`/board/${board.id}`}
                onClick={() => dispatch({ type: SET_ACTIVE_BOARD, board })}>
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
