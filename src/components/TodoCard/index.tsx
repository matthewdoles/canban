import React, { useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useAppSelector } from '../../hooks';
import { Todo } from '../../models/Todo.model';

type Props = {
  color: string;
  clicked: (todo: Todo) => void;
  disabled: boolean;
  dragging?: (_e: DraggableEvent, position: DraggableData) => void;
  dragStart?: () => void;
  dragStop?: () => void;
  todo: Todo;
};

const TodoCard = ({ color, disabled, clicked, dragging, dragStart, dragStop, todo }: Props) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.user.firebaseUser);

  return (
    <Draggable
      nodeRef={nodeRef}
      disabled={disabled}
      handle=".header"
      onDrag={dragging}
      onStart={dragStart}
      onStop={dragStop}
      position={{ x: 0, y: 0 }}>
      <div className="min-h-[100px] bg-white drop-shadow-lg rounded-lg" ref={nodeRef}>
        <div
          className={`flex flex-row ${color} p-1 rounded-t-lg ${
            !disabled ? 'cursor-grab' : ''
          } header`}>
          <p className="text-md text-white font-bold ml-2">{todo.title}</p>
          {!disabled && <p className="text-md text-white font-bold ml-auto mr-2 ">&equiv;</p>}
        </div>
        <div onClick={() => clicked(todo)}>
          <div className="flex flex-row justify-between cursor-pointer">
            <div className="mx-4 py-2">
              <p>{todo.description}</p>
            </div>
            <div className="avatar placeholder m-2">
              <div className="w-10 h-10 rounded-full bg-blue-500">
                {user !== null && (
                  <>
                    {user.photoURL === null || user.photoURL.length === 0 ? (
                      <span className="text-xl text-white font-bold">
                        {user.displayName ? user.displayName.charAt(0) : user.email.charAt(0)}
                      </span>
                    ) : (
                      <img src={user.photoURL} />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default TodoCard;
