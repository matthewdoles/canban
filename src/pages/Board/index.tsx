import React, { useEffect, useState } from 'react';
import { MdError } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import ArchiveTodos from '../../components/Todos/ArchiveTodos';
import Column from '../../components/Boards/Column';
import DeleteTodo from '../../components/Modals/DeleteTodo';
import Navigation from '../../components/Navigation';
import TodoDetail from '../../components/Todos/TodoDetail';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchBoards, updateBoardTodos } from '../../store/reducers/boards';
import { fetchProfile } from '../../store/reducers/profile';
import { BoardSettings } from '../../models/BoardSettings.model';
import { Stage } from '../../models/Stage.model';
import { Todo } from '../../models/Todo.model';
import { initBoard, initTodo } from '../../const/initData';

const Board = () => {
  const [activeTodo, setActiveTodo] = useState<Todo>(initTodo);
  const [activeHoverColumn, setActiveHoverColumn] = useState<number>(0);
  const [board, setBoard] = useState<BoardSettings>(initBoard);
  const [isArchived, setIsArchived] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showDeleteTodo, setShowDeleteTodo] = useState<boolean>(false);
  const { boards, boardsError } = useAppSelector((state) => state.boards);
  const { profile } = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (boards.length === 0) {
      dispatch(fetchBoards());
    } else if (profile.id.length === 0) {
      dispatch(fetchProfile());
    } else {
      if (id) {
        const board = boards.find((b) => b.id === +id);
        if (board) setBoard(board);
      }
    }
  }, [boards, profile]);

  const updateTodos = (updatedTodo: Todo) => {
    const updatedTodos = [...board.todos];
    const todoIndex = updatedTodos.findIndex((t: Todo) => t.id === updatedTodo.id);
    updatedTodos[todoIndex] = {
      ...updatedTodos[todoIndex],
      ...updatedTodo
    };
    dispatch(updateBoardTodos(board.id, updatedTodos));
  };

  const onConfirmDelete = async () => {
    dispatch(updateBoardTodos(board.id, [...board.todos.filter((t) => t.id !== activeTodo.id)]));
    setActiveTodo(initTodo);
    setShowDetail(false);
    setShowDeleteTodo(false);
  };

  const handleArchive = async () => {
    const updatedTodos = [...board.todos];
    const todoIndex = updatedTodos.findIndex((t: Todo) => t.id === activeTodo.id);
    if (isArchived) {
      updatedTodos[todoIndex] = {
        ...updatedTodos[todoIndex],
        isArchived: false
      };
    } else {
      updatedTodos[todoIndex] = {
        ...updatedTodos[todoIndex],
        isArchived: true
      };
    }
    dispatch(updateBoardTodos(board.id, updatedTodos));
    setActiveTodo(initTodo);
    setShowDetail(false);
    setIsArchived(false);
  };

  return (
    <div className="drawer drawer-end">
      <input type="checkbox" checked={showDetail} className="drawer-toggle" readOnly />
      <div className="drawer-content p-4">
        <Navigation />
        {boardsError.length > 0 ? (
          <div className="alert alert-error shadow-lg bg-red-400 flex justify-center">
            <div>
              <MdError color="white" size={24} />
              <p className="text-white font-bold">{boardsError}</p>
            </div>
          </div>
        ) : null}
        {board.id !== 0 ? (
          <>
            <div className="flex flex-row w-full pt-4">
              {board.stages.map((stage: Stage) => (
                <Column
                  key={stage.title}
                  activeTodo={activeTodo}
                  addNewTodo={(todo: Todo) =>
                    dispatch(updateBoardTodos(board.id, [...board.todos, todo]))
                  }
                  activeHoverColumn={activeHoverColumn}
                  allStages={board.stages}
                  color={stage.color}
                  isDragging={isDragging}
                  stage={stage.title}
                  stageNumber={stage.stageOrder}
                  todos={board.todos.filter(
                    (todo: Todo) => todo.stage === stage.title && !todo.isArchived
                  )}
                  updateActiveDrag={(todo: Todo) => {
                    setActiveTodo(todo);
                    setShowDetail(true);
                    setIsArchived(false);
                  }}
                  updateActiveHoverColumn={(column: number) => setActiveHoverColumn(column)}
                  updateIsDragging={(dragging: boolean) => setIsDragging(dragging)}
                  updateBoardTodos={(updatedTodo: Todo) => updateTodos(updatedTodo)}
                />
              ))}
            </div>
            <ArchiveTodos
              archivedTodos={board.todos.filter((t) => t.isArchived)}
              board={board}
              updateActiveTodo={(todo: Todo) => {
                setActiveTodo(todo);
                setShowDetail(true);
                setIsArchived(true);
              }}
            />
          </>
        ) : null}
      </div>
      {board && activeTodo.id !== '0' && !isDragging ? (
        <div className="drawer-side">
          <div className="drawer-overlay" onClick={() => setShowDetail(false)}></div>
          <TodoDetail
            allStages={board.stages}
            todo={activeTodo}
            onArchive={handleArchive}
            onDelete={() => setShowDeleteTodo(true)}
            updateTodo={(updatedTodo: Todo) => updateTodos(updatedTodo)}
          />
        </div>
      ) : null}
      <DeleteTodo
        checked={showDeleteTodo}
        confirm={onConfirmDelete}
        close={() => setShowDeleteTodo(false)}
        title={activeTodo.title}
      />
    </div>
  );
};

export default Board;
