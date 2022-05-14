import React, { useEffect, useState } from 'react';
import { MdError } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { initTodo } from '../../const/initData';
import { Stage } from '../../models/Stage.model';
import { Todo } from '../../models/Todo.model';
import { SET_ACTIVE_BOARD } from '../../store/reducers/boards';
import { fetchBoards } from '../../store/actions/boards';
import { deleteTodo, updateTodo } from '../../store/actions/todos';
import { archiveTodo, fetchArchivedTodos, unarchiveTodo } from '../../store/actions/archive';
import ArchiveDetails from '../../components/ArchiveDetails';
import Column from '../../components/Column';
import DeleteTodo from '../../components/Modals/DeleteTodo';
import Modal from '../../components/Modals';
import TodoDetail from '../../components/TodoDetail.tsx';

const Board = () => {
  const [activeTodo, setActiveTodo] = useState<Todo>(initTodo);
  const [isArchived, setIsArchived] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeHoverColumn, setActiveHoverColumn] = useState<number>(0);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const boardData = useAppSelector((state) => state.boards.boards);
  const activeBoard = useAppSelector((state) => state.boards.activeBoard);
  const error = useAppSelector((state) => state.boards.error);
  const user = useAppSelector((state) => state.user.firebaseUser);
  const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (boardData.length === 0) dispatch(fetchBoards());
    else {
      if (activeBoard.id === '' || id === activeBoard.id) {
        const board = boardData.find((b) => b.id === id);
        if (board) {
          dispatch({ type: SET_ACTIVE_BOARD, board });
          dispatch(fetchArchivedTodos(board.id));
        }
      }
    }
  }, [boardData, user, activeBoard.id]);

  useEffect(() => {
    if (activeTodo.id !== '0') {
      setActiveTodo(activeBoard.todos.find((t: Todo) => t.id === activeTodo.id));
    }
  }, [activeBoard]);

  const onConfirmDelete = async () => {
    dispatch(deleteTodo(activeTodo));
    setActiveTodo(initTodo);
    setShowDetail(false);
  };

  const handleArchive = async () => {
    if (isArchived) {
      dispatch(unarchiveTodo(activeTodo));
    } else {
      dispatch(archiveTodo(activeTodo));
    }
    setActiveTodo(initTodo);
    setShowDetail(false);
    setIsArchived(false);
  };

  return (
    <div className="drawer drawer-end">
      <input type="checkbox" checked={showDetail} className="drawer-toggle" />
      <div className="drawer-content p-8">
        {error.length > 0 && (
          <div className="alert alert-error shadow-lg bg-red-400 flex justify-center">
            <div>
              <MdError size={24} color="white" />
              <p className="text-white font-bold">{error}</p>
            </div>
          </div>
        )}
        <div className="flex flex-row w-full">
          {activeBoard?.stages.map((stage: Stage) => (
            <Column
              key={stage.title}
              activeTodo={activeTodo}
              activeHoverColumn={activeHoverColumn}
              allStages={activeBoard.stages}
              boardId={activeBoard.id || ''}
              color={stage.color}
              isDragging={isDragging}
              stage={stage.title}
              stageNumber={stage.stageOrder}
              todos={activeBoard.todos.filter((todo: Todo) => todo.stage === stage.title)}
              updateActiveDrag={(todo: Todo) => {
                setActiveTodo(todo);
                setShowDetail(true);
                setIsArchived(false);
              }}
              updateActiveHoverColumn={(column: number) => setActiveHoverColumn(column)}
              updateIsDragging={(dragging: boolean) => setIsDragging(dragging)}
              updateBoardTodos={(updatedTodo: Todo) => dispatch(updateTodo(updatedTodo))}
            />
          ))}
        </div>
        <ArchiveDetails
          updateActiveTodo={(todo: Todo) => {
            setActiveTodo(todo);
            setShowDetail(true);
            setIsArchived(true);
          }}
        />
      </div>
      {activeBoard && activeTodo.id !== '0' && !isDragging && (
        <div className="drawer-side">
          <div className="drawer-overlay" onClick={() => setShowDetail(false)}></div>
          <TodoDetail
            allStages={activeBoard.stages}
            todo={activeTodo}
            onArchive={handleArchive}
            isArchived={isArchived}
          />
        </div>
      )}
      <Modal id="delete-todo-modal">
        <DeleteTodo confirm={onConfirmDelete} title={activeTodo.title} />
      </Modal>
    </div>
  );
};

export default Board;
