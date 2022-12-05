import React, { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { BounceLoader } from 'react-spinners';
import { initBoard } from '../../../const/initData';

import { useAppDispatch, useAppSelector } from '../../../hooks';
import { BoardSettings } from '../../../models/BoardSettings.model';
import { deleteBoard, fetchBoards } from '../../../store/reducers/boards';
import Modal from '../../Modals';
import DeleteBoard from '../../Modals/DeleteBoard';
import BoardCard from '../BoardCard';

const MyBoards = () => {
  const [selectedBoard, setSelectedBoard] = useState<BoardSettings>(initBoard);
  const { boards, boardsError, boardsLoading } = useAppSelector((state) => state.boards);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (boards.length === 0) {
      dispatch(fetchBoards());
    }
  });

  return (
    <div className="lg:w-1/2 md:3/4 w-full flex flex-col mx-auto bg-accent shadow-lg items-center rounded-lg">
      <div className="w-full relative justify-center bg-primary p-1 rounded-t-lg">
        <p className="text-xl text-white text-center font-bold" style={{ fontFamily: 'Noto Sans' }}>
          My Boards
        </p>
        <label
          className="absolute right-3 top-1 text-3xl text-white font-bold cursor-pointer"
          htmlFor="board-form">
          <MdAdd size={28} />
        </label>
      </div>
      <div className="w-full p-4">
        {boardsLoading && boards.length === 0 && (
          <div className="flex flex-row justify-center p-4">
            <BounceLoader size={75} color="#FFD369" />
          </div>
        )}
        {boardsError > 0 && <p className="text-red-500 text-center font-bold">{boardsError}</p>}
        {boards?.map((board) => (
          <div key={board.id} className="m-4">
            <BoardCard
              board={board}
              selectedBoardId={0}
              todos={board.todos}
              updateSelectedBoard={(board: BoardSettings) => setSelectedBoard(board)}
            />
          </div>
        ))}
      </div>
      <Modal id="delete-board-modal">
        <DeleteBoard
          board={selectedBoard}
          confirm={() => dispatch(deleteBoard(selectedBoard.id))}
        />
      </Modal>
    </div>
  );
};

export default MyBoards;
