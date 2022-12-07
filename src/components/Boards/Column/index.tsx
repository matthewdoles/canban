import React, { useState } from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { MdAdd } from 'react-icons/md';

import TodoCard from '../../Todos/TodoCard';
import TodoForm from '../../Todos/TodoForm';
import { Stage } from '../../../models/Stage.model';
import { Todo } from '../../../models/Todo.model';
import { initTodo } from '../../../const/initData';

type Props = {
  activeTodo: Todo;
  activeHoverColumn: number;
  addNewTodo: (todo: Todo) => void;
  allStages: Stage[];
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
  addNewTodo,
  allStages,
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
  const [todoFormOpen, setTodoFormOpen] = useState<boolean>(false);

  const handleDragging = (position: DraggableData) => {
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
  };

  const handleDragStop = (todo: Todo) => {
    const updatedTodo = {
      ...todo,
      stage: allStages.find((stage) => stage.stageOrder === activeHoverColumn)?.title || todo.stage
    };
    updateBoardTodos(updatedTodo);
    updateActiveDrag(initTodo);
    updateIsDragging(false);
  };

  return (
    <div
      className={`static ${allStages.length === 3 ? 'w-1/3' : 'w-1/4'} m-2 shadow-lg ${
        activeTodo.stage !== stage && activeTodo.id !== '0' && isDragging
          ? `bg-green-50 ${
              activeHoverColumn === stageNumber ? 'border-green-300 border-4' : 'border-none'
            }`
          : 'bg-accent border-transparent border-none'
      }`}>
      <div className={`${color} p-2 relative flex items-center`}>
        <span className="badge text-lg font-bold bg-white border-none h-6 mx-2">
          {todos.length}
        </span>
        <p className="text-xl text-white font-bold ml-2">{stage}</p>
        <label
          className="absolute right-3 top-2 text-3xl text-white font-bold cursor-pointer"
          onClick={() => setTodoFormOpen(true)}>
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
                  color={color}
                  clicked={(todo: Todo) => updateActiveDrag(todo)}
                  dragging={(_e: DraggableEvent, position: DraggableData) =>
                    handleDragging(position)
                  }
                  dragStart={() => updateActiveDrag(todo)}
                  dragStop={async () => handleDragStop(todo)}
                  disabled={false}
                  todo={todo}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <TodoForm
        addNewTodo={(todo) => {
          addNewTodo(todo);
          setTodoFormOpen(false);
        }}
        allStages={allStages}
        autoPopStage={stage}
        checked={todoFormOpen}
        close={() => setTodoFormOpen(false)}
      />
    </div>
  );
};

export default Column;
