import React, { useEffect, useState } from 'react';
import { MdError } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { initBoard, initTodo } from '../../const/initData';

import { BoardSettings } from '../../models/BoardSettings.model';
import { fetchBoards, updateBoardTodos } from '../../store/reducers/boards';
import Column from '../../components/Boards/Column';
import { Stage } from '../../models/Stage.model';
import { Todo } from '../../models/Todo.model';
import { fetchProfile } from '../../store/reducers/profile';
import TodoDetail from '../../components/Todos/TodoDetail';
import Modal from '../../components/Modals';
import DeleteTodo from '../../components/Modals/DeleteTodo';
import ArchiveTodos from '../../components/Todos/ArchiveTodos';

const Board = () => {
  const [board, setBoard] = useState<BoardSettings>(initBoard);
  const [activeTodo, setActiveTodo] = useState<Todo>(initTodo);
  const [activeHoverColumn, setActiveHoverColumn] = useState<number>(0);
  const [isArchived, setIsArchived] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
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
      <input type="checkbox" checked={showDetail} className="drawer-toggle" />
      <div className="drawer-content p-8">
        {boardsError.length > 0 && (
          <div className="alert alert-error shadow-lg bg-red-400 flex justify-center">
            <div>
              <MdError size={24} color="white" />
              <p className="text-white font-bold">{boardsError}</p>
            </div>
          </div>
        )}
        <div className="flex flex-row w-full">
          {board.stages.map((stage: Stage) => (
            <Column
              key={stage.title}
              activeTodo={activeTodo}
              addNewTodo={(todo: Todo) =>
                dispatch(updateBoardTodos(board.id, [...board.todos, todo]))
              }
              activeHoverColumn={activeHoverColumn}
              allStages={board.stages}
              boardId={board.id}
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
      </div>
      {board && activeTodo.id !== '0' && !isDragging && (
        <div className="drawer-side">
          <div className="drawer-overlay" onClick={() => setShowDetail(false)}></div>
          <TodoDetail
            allStages={board.stages}
            todo={activeTodo}
            onArchive={handleArchive}
            updateTodo={(updatedTodo: Todo) => updateTodos(updatedTodo)}
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
