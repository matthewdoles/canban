import React from 'react';
import { BoardSettings } from '../../../models/BoardSettings.model';

type Props = {
  board: BoardSettings;
  confirm: (board: BoardSettings) => void;
};

const DeleteBoard = ({ board, confirm }: Props) => {
  return (
    <>
      <div
        className={`flex flex-row justify-center bg-red-500 p-1 rounded-t-lg cursor-grab header`}>
        <h3 className="text-2xl text-white font-bold">Delete Board</h3>
      </div>
      <div className="mt-4 text-center">
        <p className="text-lg">Are you sure you want to delete this board?</p>
        <p className="text-2xl font-bold my-2">
          <b>{board.boardName}</b>
        </p>
      </div>
      <div className="modal-action p-4">
        <label htmlFor="delete-board-modal" className="btn border-none bg-red-500">
          Cancel
        </label>
        <label
          htmlFor="delete-board-modal"
          className="btn border-none bg-green-500"
          onClick={() => confirm(board)}>
          Confirm
        </label>
      </div>
    </>
  );
};

export default DeleteBoard;
