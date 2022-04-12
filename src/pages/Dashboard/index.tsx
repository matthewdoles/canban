import React, { useState, useEffect } from 'react';
import { MdAdd } from 'react-icons/md';

import BoardCard from '../../components/BoardCard';
import BoardForm from '../../components/BoardForm';
import { BoardSettings } from '../../models/BoardSettings';
import { createBoard, getBoards, updateBoard } from '../../functions/db';

const newBoard = {
  boardName: '',
  stages: [
    { title: 'Todo', color: 'bg-blue-500', stageOrder: 1 },
    { title: 'In Progress', color: 'bg-yellow-400', stageOrder: 2 },
    { title: 'Done', color: 'bg-green-500', stageOrder: 3 }
  ]
};

const Dashboard = () => {
  const [boards, setBoards] = useState<BoardSettings[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<BoardSettings>(newBoard);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => setBoards(await getBoards());

  const addBoard = async (board: BoardSettings) => {
    try {
      const boardId = await createBoard(board);
      setBoards((currBoards) => [...currBoards, { ...board, id: boardId }]);
    } catch (err) {
      console.log(err);
    }
  };

  const onBoardUpdate = async (board: BoardSettings) => {
    try {
      if (board.id) {
        await updateBoard(board);
        setBoards((currBoards) => [...currBoards.filter((b) => b.id !== board.id), board]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="lg:w-1/2 md:3/4 sm:w-4/5 flex flex-col mx-auto bg-gray-100 shadow-lg items-center rounded-lg">
        <div className="w-full relative justify-center bg-blue-500 p-1 rounded-t-lg">
          <p className="text-lg text-white text-center font-bold uppercase">My Boards</p>
          <label
            className="absolute right-3 top-1 text-3xl text-white font-bold cursor-pointer"
            htmlFor="board-form"
            onClick={() => setSelectedBoard(newBoard)}>
            <MdAdd size={28} />
          </label>
        </div>
        <div className="w-full p-4">
          {boards.map((board) => (
            <div key={board.id} className="m-4">
              <BoardCard
                board={board}
                updateSelectedBoard={(board: BoardSettings) => setSelectedBoard(board)}
              />
            </div>
          ))}
        </div>
      </div>
      <BoardForm
        addNewBoard={addBoard}
        onBoardUpdate={onBoardUpdate}
        selectedBoard={selectedBoard}
      />
    </>
  );
};

export default Dashboard;
