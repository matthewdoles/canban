import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Column from '../../components/Column';
import Modal from '../../components/Modal';
import TodoDetail from '../../components/TodoDetail.tsx';
import { deleteTodo } from '../../functions/db';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Stage } from '../../models/Stage';
import { Todo } from '../../models/Todo.model';
import { fetchBoards } from '../../store/reducers/boards';

const Board = () => {
  const [activeTodo, setActiveTodo] = useState<Todo>({
    boardId: '',
    comments: [],
    id: '0',
    stage: 'None',
    description: '',
    title: ''
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeHoverColumn, setActiveHoverColumn] = useState<number>(0);
  const boardData = useAppSelector((state) => state.boards.boards);
  const activeBoard = useAppSelector((state) => state.boards.activeBoard);
  const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    fetchBoardData();
    if (activeTodo.id !== '0') {
      setActiveTodo(activeBoard.todos.find((t: Todo) => t.id === activeTodo.id));
    }
  }, [activeBoard]);

  const fetchBoardData = async () => {
    console.log(id);
    if (boardData.length === 0) {
      dispatch(fetchBoards());
    }
  };

  const onConfirmDelete = async () => {
    try {
      if (activeTodo.id) {
        await deleteTodo(activeTodo);
        setActiveTodo({
          boardId: '',
          comments: [],
          id: '0',
          stage: 'None',
          description: '',
          title: ''
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="drawer drawer-end">
      <input id="todo-detail-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-8">
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
              updateActiveDrag={(todo: Todo) => setActiveTodo(todo)}
              updateActiveHoverColumn={(column: number) => setActiveHoverColumn(column)}
              updateIsDragging={(dragging: boolean) => setIsDragging(dragging)}
              updateBoardTodos={(updatedTodo: Todo) => console.log(updatedTodo)}
            />
          ))}
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="todo-detail-drawer" className="drawer-overlay"></label>
        {activeBoard && activeTodo.id !== '0' && (
          <TodoDetail allStages={activeBoard.stages} todo={activeTodo} />
        )}
      </div>
      <Modal>
        <div
          className={`flex flex-row justify-center bg-red-500 p-1 rounded-t-lg cursor-grab header`}>
          <h3 className="text-2xl text-white font-bold">Delete Task</h3>
        </div>
        <div className="mt-4 text-center">
          <p className="text-lg">Are you sure you want to delete this task?</p>
          <p className="text-2xl font-bold my-2">
            <b>{activeTodo.title}</b>
          </p>
        </div>
        <div className="modal-action p-4">
          <label htmlFor="modal" className="btn border-none bg-red-500">
            Cancel
          </label>
          <label
            htmlFor="todo-detail-drawer"
            className="btn border-none bg-green-500"
            onClick={onConfirmDelete}>
            Confirm
          </label>
        </div>
      </Modal>
    </div>
  );
};

export default Board;
