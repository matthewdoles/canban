import React, { useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Todo } from '../../models/Todo.model';

type Props = {
  color: string;
  clicked: (todo: Todo) => void;
  disabled: boolean;
  dragging: (_e: DraggableEvent, position: DraggableData) => void;
  dragStart: () => void;
  dragStop: () => void;
  todo: Todo;
};

const TodoCard = ({ color, disabled, clicked, dragging, dragStart, dragStop, todo }: Props) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      disabled={disabled}
      handle=".header"
      onDrag={dragging}
      onStart={dragStart}
      onStop={dragStop}
      position={{ x: 0, y: 0 }}>
      <div className="min-h-[100px] bg-white m-3 drop-shadow-lg rounded-lg" ref={nodeRef}>
        <div className={`flex flex-row ${color} p-1 rounded-t-lg cursor-grab header`}>
          <p className="text-md text-white font-bold ml-2">{todo.title}</p>
          <p className="text-md text-white font-bold ml-auto mr-2 ">&equiv;</p>
        </div>
        <label htmlFor="todo-detail-drawer" onClick={() => clicked(todo)}>
          <div className="mx-4 py-2 cursor-pointer">
            <p>{todo.description}</p>
          </div>
        </label>
      </div>
    </Draggable>
  );
};

export default TodoCard;
