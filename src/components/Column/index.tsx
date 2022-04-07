import React from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { Todo } from '../../models/Todo.model';
import TodoDetail from '../TodoDetail';

type Props = {
  activeDrag: Todo;
  activeHoverColumn: number;
  color: string;
  stage: string;
  stageNumber: number;
  todos: Todo[];
  updateActiveDrag: (todo: Todo) => void;
  updateActiveHoverColumn: (column: number) => void;
  updateBoardTodos: (todo: Todo) => void;
};

const Column = ({
  activeDrag,
  activeHoverColumn,
  color,
  stage,
  stageNumber,
  todos,
  updateActiveDrag,
  updateActiveHoverColumn,
  updateBoardTodos
}: Props) => {
  return (
    <div className="static w-1/4 m-2 shadow-lg">
      <div className={`${color} p-2`}>
        <p className="text-lg text-white font-bold ml-2">
          <span className="badge mr-2">{todos.length}</span>
          {stage}
        </p>
      </div>
      <div
        className={`min-h-[600px] ${
          activeDrag.stage !== stage && activeDrag.id !== 0
            ? `bg-green-50 ${
                activeHoverColumn === stageNumber ? 'border-green-300' : 'border-transparent'
              } border-4`
            : 'bg-gray-100 border-transparent border-4'
        }`}>
        {todos.map((todo) => (
          <>
            {(activeDrag.id === 0 || activeDrag.id === todo.id) && (
              <TodoDetail
                key={todo.title}
                title={todo.title}
                description={todo.description}
                dragging={(_e: DraggableEvent, position: DraggableData) => {
                  const { x } = position;
                  const columnWidth = window.innerWidth / 4 - 30;
                  const column =
                    columnWidth > x
                      ? 1
                      : columnWidth * 2 > x && columnWidth < x
                      ? 2
                      : columnWidth * 3 > x && columnWidth * 2 < x
                      ? 3
                      : 4;
                  console.log(column);
                  updateActiveHoverColumn(Math.floor(column));
                }}
                dragStart={() => {
                  updateActiveDrag(todo);
                }}
                dragStop={() => {
                  updateBoardTodos({
                    ...todo,
                    stage:
                      activeHoverColumn === 1
                        ? 'Todo'
                        : activeHoverColumn === 2
                        ? 'In Progress'
                        : activeHoverColumn === 3
                        ? 'In Review'
                        : 'Done'
                  });
                  updateActiveDrag({ id: 0, stage: 'None', description: '', title: '' });
                }}
                color={color}
                disabled={false}
              />
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default Column;
