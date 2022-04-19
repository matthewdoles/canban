import React, { useState, useEffect } from 'react';
import { BounceLoader } from 'react-spinners';
import { MdAdd } from 'react-icons/md';

import { createBoard, deleteBoard, fetchBoards, updateBoard } from '../../store/reducers/boards';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { BoardSettings } from '../../models/BoardSettings.model';
import { Todo } from '../../models/Todo.model';
import BoardCard from '../../components/BoardCard';
import BoardForm from '../../components/BoardForm';
import Modal from '../../components/Modals';
import DeleteBoard from '../../components/Modals/DeleteBoard';

const newBoard = {
  boardName: '',
  stages: [
    { title: 'Todo', color: 'bg-blue-500', stageOrder: 1 },
    { title: 'In Progress', color: 'bg-yellow-400', stageOrder: 2 },
    { title: 'Done', color: 'bg-green-500', stageOrder: 3 }
  ]
};

const Dashboard = () => {
  const [selectedBoard, setSelectedBoard] = useState<BoardSettings>(newBoard);
  const boardData = useAppSelector((state) => state.boards);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getBoards();
  }, []);

  const getBoards = async () => {
    if (boardData.boards.length === 0) dispatch(fetchBoards());
  };

  const onBoardAdd = async (board: BoardSettings) => dispatch(createBoard(board));

  const onBoardUpdate = async (board: BoardSettings) => dispatch(updateBoard(board));

  const onBoardDelete = async (board: BoardSettings) => dispatch(deleteBoard(board));

  return (
    <div className="p-8 ">
      <div className="lg:w-1/2 md:3/4 sm:w-4/5 flex flex-col mx-auto bg-gray-100 shadow-lg items-center rounded-lg">
        <div className="w-full relative justify-center bg-blue-500 p-1 rounded-t-lg">
          <p
            className="text-lg text-white text-center font-bold"
            style={{ fontFamily: 'Noto Sans' }}>
            My Boards
          </p>
          <label
            className="absolute right-3 top-1 text-3xl text-white font-bold cursor-pointer"
            htmlFor="board-form"
            onClick={() => setSelectedBoard(newBoard)}>
            <MdAdd size={28} />
          </label>
        </div>
        <div className="w-full p-4">
          {boardData.loading && boardData.boards.length === 0 && (
            <div className="flex flex-row justify-center p-4">
              <BounceLoader size={75} color="#3B82F6 " />
            </div>
          )}
          {boardData.error.length > 0 && <p>{boardData.error}</p>}
          {boardData.boards.map((board) => (
            <div key={board.id} className="m-4">
              <BoardCard
                board={board}
                selectedBoard={selectedBoard}
                todos={board.todos.filter((todo: Todo) => todo.boardId === board.id)}
                updateSelectedBoard={(board: BoardSettings) => setSelectedBoard(board)}
              />
            </div>
          ))}
        </div>
      </div>
      <BoardForm
        addNewBoard={onBoardAdd}
        onBoardUpdate={onBoardUpdate}
        selectedBoard={selectedBoard}
      />
      <Modal>
        <DeleteBoard board={selectedBoard} confirm={() => onBoardDelete(selectedBoard)} />
      </Modal>
    </div>
  );
};

export default Dashboard;
