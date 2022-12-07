import React, { useEffect, useState } from 'react';

import ArchiveTodos from '../../components/Todos/ArchiveTodos';
import Column from '../../components/Boards/Column';
import DeleteTodo from '../../components/Modals/DeleteTodo';
import Navigation from '../../components/Navigation';
import TodoDetail from '../../components/Todos/TodoDetail';

import { BoardSettings } from '../../models/BoardSettings.model';
import { Stage } from '../../models/Stage.model';
import { Todo } from '../../models/Todo.model';
import { initBoard, initTodo, newUserBoard } from '../../const/initData';

const Demo = () => {
  const [activeTodo, setActiveTodo] = useState<Todo>(initTodo);
  const [activeHoverColumn, setActiveHoverColumn] = useState<number>(0);
  const [board, setBoard] = useState<BoardSettings>(initBoard);
  const [isArchived, setIsArchived] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showDeleteTodo, setShowDeleteTodo] = useState<boolean>(false);

  useEffect(() => {
    const newBoard = { ...newUserBoard, id: 99 };
    newBoard.id = 99;
    newBoard.uid = '';
    newBoard.todos[0].assignee = '';
    newBoard.todos[0].comments[0].authorId = '';
    setBoard(newBoard);
  }, []);

  const updateTodos = (updatedTodo: Todo) => {
    const updatedTodos = [...board.todos];
    const todoIndex = updatedTodos.findIndex((t: Todo) => t.id === updatedTodo.id);
    updatedTodos[todoIndex] = {
      ...updatedTodos[todoIndex],
      ...updatedTodo
    };
    setBoard((prevState) => {
      return { ...prevState, todos: updatedTodos };
    });
  };

  const onConfirmDelete = async () => {
    setActiveTodo(initTodo);
    setShowDetail(false);
    setShowDeleteTodo(false);
    setBoard((prevState) => {
      return { ...prevState, todos: [...board.todos.filter((t) => t.id !== activeTodo.id)] };
    });
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
    setActiveTodo(initTodo);
    setShowDetail(false);
    setIsArchived(false);
    setBoard((prevState) => {
      return { ...prevState, todos: updatedTodos };
    });
  };

  return (
    <div className="drawer drawer-end">
      <input type="checkbox" checked={showDetail} className="drawer-toggle" readOnly />
      <div className="drawer-content p-4">
        <Navigation isDemoNav />
        {board.id !== 0 ? (
          <>
            <div className="flex flex-row w-full pt-4">
              {board.stages.map((stage: Stage) => (
                <Column
                  key={stage.title}
                  activeTodo={activeTodo}
                  addNewTodo={(todo: Todo) =>
                    setBoard((prevState) => {
                      return { ...prevState, todos: [...board.todos, todo] };
                    })
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

export default Demo;
