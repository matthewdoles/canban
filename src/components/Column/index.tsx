import React, { useState } from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { MdAdd } from 'react-icons/md';
import { BsArchiveFill } from 'react-icons/bs';

import { Todo } from '../../models/Todo.model';
import { Stage } from '../../models/Stage.model';
import TodoCard from '../TodoCard';
import TodoForm from '../TodoForm';
import { createTodo } from '../../store/reducers/boards';
import { useAppDispatch } from '../../hooks';

type Props = {
  activeTodo: Todo;
  activeHoverColumn: number;
  allStages: Stage[];
  boardId: string;
  color: string;
  isDragging: boolean;
  stage: string;
  stageNumber: number;
  todos: Todo[];
  updateActiveDrag: (todo: Todo) => void;
  updateActiveHoverColumn: (column: number) => void;
  updateBoardTodos: (todo: Todo) => void;
  updateIsDragging: (dragging: boolean) => void;
};

const Column = ({
  activeTodo,
  activeHoverColumn,
  allStages,
  boardId,
  color,
  isDragging,
  stage,
  stageNumber,
  todos,
  updateActiveDrag,
  updateActiveHoverColumn,
  updateBoardTodos,
  updateIsDragging
}: Props) => {
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <div
      className={`static ${allStages.length === 3 ? 'w-1/3' : 'w-1/4'} m-2 shadow-lg ${
        activeTodo.stage !== stage && activeTodo.id !== '0' && isDragging
          ? `bg-green-50 ${
              activeHoverColumn === stageNumber ? 'border-green-300 border-4' : 'border-none'
            }`
          : 'bg-gray-100 border-transparent border-none'
      }`}>
      <div className={`${color} p-2 relative justify-center`}>
        <p className="text-lg text-white font-bold ml-2">
          <span className="badge mr-2">{todos.length}</span>
          {stage}
        </p>
        <label
          className="absolute right-14 top-3 text-3xl text-white font-bold cursor-pointer"
          htmlFor={`archive-${stage}`}
          onClick={() => setCreateFormOpen(true)}>
          <BsArchiveFill size={20} />
        </label>
        <label
          className="absolute right-3 top-2 text-3xl text-white font-bold cursor-pointer"
          htmlFor={`todo-form-${stage}`}
          onClick={() => setCreateFormOpen(true)}>
          <MdAdd size={28} />
        </label>
      </div>
      <div className="min-h-[600px]">
        {todos.map((todo) => (
          <div key={todo.id}>
            {(activeTodo.id === '0' ||
              activeTodo.id === todo.id ||
              activeTodo.stage === stage ||
              !isDragging) && (
              <div className="m-3">
                <TodoCard
                  todo={todo}
                  clicked={(todo: Todo) => updateActiveDrag(todo)}
                  dragging={(_e: DraggableEvent, position: DraggableData) => {
                    const { x } = position;
                    const columnWidth = window.innerWidth / 4 - 50;
                    const offset = columnWidth * (stageNumber - 1) + (x + columnWidth / 2);
                    let column =
                      columnWidth > offset
                        ? 1
                        : columnWidth * 2 > offset && columnWidth < offset
                        ? 2
                        : columnWidth * 3 > offset && columnWidth * 2 < offset
                        ? 3
                        : columnWidth * 4 > offset && columnWidth * 3 < offset
                        ? 4
                        : 5;
                    if (column > allStages.length) column = allStages.length;
                    updateActiveHoverColumn(Math.floor(column));
                    if (!isDragging) updateIsDragging(true);
                  }}
                  dragStart={() => {
                    updateActiveDrag(todo);
                  }}
                  dragStop={async () => {
                    try {
                      const updatedTodo = {
                        ...todo,
                        stage:
                          allStages.find((stage) => stage.stageOrder === activeHoverColumn)
                            ?.title || todo.stage
                      };
                      updateBoardTodos(updatedTodo);
                      updateActiveDrag({
                        id: '0',
                        stage: 'None',
                        description: '',
                        comments: [],
                        title: '',
                        boardId: '',
                        created: Date.now(),
                        assignee: ''
                      });
                      updateIsDragging(false);
                    } catch (err) {
                      console.log(err);
                    }
                  }}
                  color={color}
                  disabled={false}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {createFormOpen && (
        <TodoForm
          addNewTodo={(todo) => {
            dispatch(createTodo(todo));
            setCreateFormOpen(false);
          }}
          allStages={allStages}
          autoPopStage={stage}
          boardId={boardId}
        />
      )}
    </div>
  );
};

export default Column;
