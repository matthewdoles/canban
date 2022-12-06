import React, { useEffect, useState } from 'react';
import { BounceLoader } from 'react-spinners';
import { initBoard } from '../../../const/initData';

import { useAppDispatch, useAppSelector } from '../../../hooks';
import { BoardSettings } from '../../../models/BoardSettings.model';
import { deleteBoard, fetchBoards } from '../../../store/reducers/boards';
import DeleteBoard from '../../Modals/DeleteBoard';
import BoardCard from '../BoardCard';

const MyBoards = () => {
  const [selectedBoard, setSelectedBoard] = useState<BoardSettings>(initBoard);
  const [showDeleteBoard, setShowDeleteBoard] = useState<boolean>(false);
  const { boards, boardsError, boardsLoading } = useAppSelector((state) => state.boards);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (boards.length === 0) {
      dispatch(fetchBoards());
    }
  }, []);

  return (
    <div className="w-full w-full flex flex-col mx-auto items-center rounded-lg">
      <div className="w-full p-4">
        {boardsLoading && boards.length === 0 && (
          <div className="flex flex-row justify-center p-4">
            <BounceLoader size={75} color="#FFD369" />
          </div>
        )}
        {boardsError > 0 && <p className="text-red-500 text-center font-bold">{boardsError}</p>}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
          {boards?.map((board) => (
            <div key={board.id} className="m-2 shadow-lg">
              <BoardCard
                board={board}
                selectedBoardId={selectedBoard.id}
                todos={board.todos}
                handleDeleteBoard={(board: BoardSettings) => {
                  setSelectedBoard(board);
                  setShowDeleteBoard(true);
                }}
              />
            </div>
          ))}
          {!boardsLoading ? (
            <label
              htmlFor="board-form"
              className={`m-2 btn btn-ghost drop-shadow-lg rounded-lg border-accent border-4 hover:border-accent ${
                boards.length === 0 || boards.length % 3 === 0 ? 'h-44' : 'min-h-full'
              }`}>
              <div className="flex flex-row justify-center align-center text-center">
                <p className="text-3xl text-accent">New Board</p>
              </div>
            </label>
          ) : null}
        </div>
      </div>
      <DeleteBoard
        checked={showDeleteBoard}
        boardName={selectedBoard.boardName}
        confirm={() => {
          dispatch(deleteBoard(selectedBoard.id));
          setShowDeleteBoard(false);
          setSelectedBoard(initBoard);
        }}
        close={() => {
          setShowDeleteBoard(false);
          setSelectedBoard(initBoard);
        }}
      />
    </div>
  );
};

export default MyBoards;
