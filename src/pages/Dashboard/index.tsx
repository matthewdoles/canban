import React, { useState, useEffect } from 'react';
import { BounceLoader } from 'react-spinners';
import { MdAdd } from 'react-icons/md';

import {
  createBoard,
  deleteBoard,
  fetchBoards,
  updateBoardSettings
} from '../../store/reducers/boards';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { BoardSettings } from '../../models/BoardSettings.model';
import { Todo } from '../../models/Todo.model';
import BoardCard from '../../components/BoardCard';
import BoardForm from '../../components/BoardForm';
import Modal from '../../components/Modals';
import DeleteBoard from '../../components/Modals/DeleteBoard';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import Profile from '../../components/Modals/Profile';
import SharingForm from '../../components/SharingForm';

const newBoard = {
  boardName: '',
  stages: [
    { title: 'Todo', color: 'bg-blue-500', stageOrder: 1 },
    { title: 'In Progress', color: 'bg-yellow-400', stageOrder: 2 },
    { title: 'Done', color: 'bg-green-500', stageOrder: 3 }
  ],
  uid: ''
};

const Dashboard = () => {
  const [selectedBoard, setSelectedBoard] = useState<BoardSettings>(newBoard);
  const boardData = useAppSelector((state) => state.boards);
  const user = useAppSelector((state) => state.user.firebaseUser);
  const dispatch = useAppDispatch();
  const navigation = useNavigate();

  useEffect(() => {
    getBoards();
  }, [user]);

  const getBoards = async () => {
    if (boardData.boards.length === 0) dispatch(fetchBoards());
  };

  const onBoardAdd = async (board: BoardSettings) => dispatch(createBoard(board));

  const onBoardUpdate = async (board: BoardSettings) => dispatch(updateBoardSettings(board));

  const onBoardDelete = async (board: BoardSettings) => dispatch(deleteBoard(board));

  const signOut = async () => {
    await auth.signOut();
    navigation('/');
  };

  return (
    <>
      <div className="p-8 flex flex-col items-center">
        <div className="dropdown dropdown-end mb-8">
          <label tabIndex={0} className="avatar placeholder justify-center">
            <div className="w-20 h-20 rounded-full bg-blue-500 border-4 border-white hover:border-black">
              {user !== null && (
                <>
                  {user.photoURL === null || user.photoURL.length === 0 ? (
                    <span className="text-3xl text-white font-bold">
                      {user.displayName ? user.displayName.charAt(0) : user.email.charAt(0)}
                    </span>
                  ) : (
                    <img src={user.photoURL} />
                  )}
                </>
              )}
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-1 mr-4 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <label htmlFor="profile-modal" className="text-xl active:bg-blue-500">
                Profile
              </label>
            </li>
            <li>
              <a onClick={signOut} className="text-xl active:bg-blue-500">
                Logout
              </a>
            </li>
          </ul>
        </div>
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
        <SharingForm selectedBoard={selectedBoard} />
        <Modal id="delete-board-modal">
          <DeleteBoard board={selectedBoard} confirm={() => onBoardDelete(selectedBoard)} />
        </Modal>
        {user !== null && (
          <Modal id="profile-modal">
            <Profile />
          </Modal>
        )}
      </div>
    </>
  );
};

export default Dashboard;
