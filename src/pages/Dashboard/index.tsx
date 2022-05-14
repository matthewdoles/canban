import React, { useState, useEffect } from 'react';
import { BounceLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { initStages } from '../../const/initData';
import { auth } from '../../firebase';
import { BoardSettings } from '../../models/BoardSettings.model';
import { Todo } from '../../models/Todo.model';
import { RESET_BOARDS } from '../../store/reducers/boards';
import { SET_USER } from '../../store/reducers/user';
import BoardCard from '../../components/BoardCard';
import BoardForm from '../../components/BoardForm';
import DeleteBoard from '../../components/Modals/DeleteBoard';
import Modal from '../../components/Modals';
import Profile from '../../components/Modals/Profile';
import ProfileDropdown from '../../components/ProfileDropdown';
import SharingForm from '../../components/SharingForm';
import {
  createBoard,
  deleteBoard,
  fetchBoards,
  updateBoardSettings
} from '../../store/actions/boards';

const newBoard = {
  boardName: '',
  stages: initStages,
  uid: ''
};

const Dashboard = () => {
  const [boards, setBoards] = useState<BoardSettings[] | null>();
  const [selectedBoard, setSelectedBoard] = useState<BoardSettings>(newBoard);
  const boardData = useAppSelector((state) => state.boards);
  const user = useAppSelector((state) => state.user.firebaseUser);
  const dispatch = useAppDispatch();
  const navigation = useNavigate();

  useEffect(() => {
    getBoards();
  }, [user]);

  useEffect(() => {
    if (selectedBoard.uid !== '') {
      setSelectedBoard(boardData.activeBoard);
    }
  }, [boardData.activeBoard]);

  useEffect(() => {
    const sortedBoards: BoardSettings[] = [...boardData.boards];
    if (user.favorites) {
      user.favorites.forEach((id: string) => {
        const boardIndex = sortedBoards.findIndex((b: BoardSettings) => b.id === id);
        if (boardIndex > -1) {
          sortedBoards.unshift(...sortedBoards.splice(boardIndex, 1));
        }
      });
    }
    setBoards(sortedBoards);
  }, [user.favorites, boardData.boards]);

  const getBoards = async () => {
    if (boardData.boards.length === 0) dispatch(fetchBoards());
  };

  const onBoardAdd = async (board: BoardSettings) => dispatch(createBoard(board));

  const onBoardUpdate = async (board: BoardSettings) => dispatch(updateBoardSettings(board));

  const onBoardDelete = async (board: BoardSettings) => dispatch(deleteBoard(board));

  const signOut = async () => {
    await auth.signOut();
    dispatch({ type: RESET_BOARDS });
    dispatch({ type: SET_USER, user: null });
    navigation('/');
  };

  return (
    <>
      <div className="p-8 flex flex-col items-center">
        <ProfileDropdown signOut={signOut} />
        <div className="lg:w-1/2 md:3/4 w-full flex flex-col mx-auto bg-accent shadow-lg items-center rounded-lg">
          <div className="w-full relative justify-center bg-primary p-1 rounded-t-lg">
            <p
              className="text-xl text-white text-center font-bold"
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
                <BounceLoader size={75} color="#FFD369" />
              </div>
            )}
            {boardData.error.length > 0 && (
              <p className="text-red-500 text-center font-bold">{boardData.error}</p>
            )}
            {boards?.map((board) => (
              <div key={board.id} className="m-4">
                <BoardCard
                  board={board}
                  selectedBoard={selectedBoard}
                  todos={
                    board.todos
                      ? board.todos.filter((todo: Todo) => todo.boardId === board.id)
                      : null
                  }
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
