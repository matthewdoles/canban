import React, { useEffect, useState } from 'react';
import { BounceLoader } from 'react-spinners';

import BoardCard from '../BoardCard';
import DeleteBoard from '../../Modals/DeleteBoard';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { BoardSettings } from '../../../models/BoardSettings.model';
import { deleteBoard, fetchBoards } from '../../../store/reducers/boards';
import { initBoard } from '../../../const/initData';
import { colors } from '../../../const';

type Props = {
  showBoardForm: () => void;
};

const MyBoards = ({ showBoardForm }: Props) => {
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
        {boardsLoading && boards.length === 0 ? (
          <div className="flex flex-row justify-center p-4">
            <BounceLoader color={colors.primary} size={75} />
          </div>
        ) : null}
        {boardsError > 0 ? (
          <p className="text-red-500 text-center font-bold">{boardsError}</p>
        ) : null}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
          {boards?.map((board) => (
            <div key={board.id} className="m-2 shadow-lg">
              <BoardCard
                board={board}
                handleDeleteBoard={(board: BoardSettings) => {
                  setSelectedBoard(board);
                  setShowDeleteBoard(true);
                }}
                selectedBoardId={selectedBoard.id}
                todos={board.todos}
              />
            </div>
          ))}
          {!boardsLoading ? (
            <label
              className={`m-2 btn btn-ghost bg-primary text-white drop-shadow-lg rounded-lg border-4 hover:border-accent h-44`}
              onClick={showBoardForm}>
              <div className="flex flex-row justify-center align-center text-center">
                <p className="text-3xl">New Board</p>
              </div>
            </label>
          ) : null}
        </div>
      </div>
      <DeleteBoard
        boardName={selectedBoard.boardName}
        checked={showDeleteBoard}
        close={() => {
          setShowDeleteBoard(false);
          setSelectedBoard(initBoard);
        }}
        confirm={() => {
          dispatch(deleteBoard(selectedBoard.id));
          setShowDeleteBoard(false);
          setSelectedBoard(initBoard);
        }}
      />
    </div>
  );
};

export default MyBoards;
