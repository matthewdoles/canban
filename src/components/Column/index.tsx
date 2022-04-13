import React from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { MdAdd } from 'react-icons/md';

import { Todo } from '../../models/Todo.model';
import { Stage } from '../../models/Stage';
import { createTodo } from '../../functions/db';
import TodoCard from '../TodoCard';
import TodoForm from '../TodoForm';

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
  const addTodo = async (todo: Todo) => {
    try {
      const todoId = await createTodo(todo);
      updateBoardTodos({
        ...todo,
        id: todoId
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`static ${allStages.length === 3 ? 'w-1/3' : 'w-1/4'} m-2 shadow-lg ${
        activeTodo.stage !== stage && activeTodo.id !== 0 && isDragging
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
          className="absolute right-3 top-2 text-3xl text-white font-bold cursor-pointer"
          htmlFor={`todo-form-${stage}`}>
          <MdAdd size={28} />
        </label>
      </div>
      <div className="min-h-[600px]">
        {todos.map((todo) => (
          <>
            {(activeTodo.id === 0 ||
              activeTodo.id === todo.id ||
              activeTodo.stage === stage ||
              !isDragging) && (
              <TodoCard
                key={todo.title}
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
                dragStop={() => {
                  updateBoardTodos({
                    ...todo,
                    stage:
                      allStages.find((stage) => stage.stageOrder === activeHoverColumn)?.title || ''
                  });
                  updateActiveDrag({
                    id: 0,
                    stage: 'None',
                    description: '',
                    title: '',
                    boardId: ''
                  });
                  updateIsDragging(false);
                }}
                color={color}
                disabled={false}
              />
            )}
          </>
        ))}
      </div>
      <TodoForm addNewTodo={addTodo} allStages={allStages} autoPopStage={stage} boardId={boardId} />
    </div>
  );
};

export default Column;
