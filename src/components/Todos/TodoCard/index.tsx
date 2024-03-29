import React, { useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

import { useAppSelector } from '../../../hooks';
import { Todo } from '../../../models/Todo.model';

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
  const draggableRef = useRef<HTMLDivElement>(null);
  const { profile } = useAppSelector((state) => state.profile);

  return (
    <Draggable
      nodeRef={draggableRef}
      disabled={disabled}
      handle=".header"
      onDrag={dragging}
      onStart={dragStart}
      onStop={dragStop}
      position={{ x: 0, y: 0 }}>
      <div className="min-h-[100px] h-full bg-white drop-shadow-lg rounded-lg" ref={draggableRef}>
        <div
          className={`flex flex-row ${color} p-1 rounded-t-lg ${
            !disabled ? 'cursor-grab' : ''
          } header`}>
          <p className="text-lg text-white font-bold ml-2">{todo.title}</p>
          {!disabled ? <p className="text-xl text-white font-bold ml-auto mr-2">&equiv;</p> : null}
        </div>
        <div onClick={() => clicked(todo)}>
          <div className="flex flex-row justify-between cursor-pointer">
            <div className="mx-4 py-2">
              <p className="text-lg">{todo.description}</p>
            </div>
            <div className="avatar placeholder m-2">
              <div className="w-10 h-10 rounded-full bg-blue-500">
                {profile.photoURL.length === 0 ? (
                  <span className="text-xl text-white font-bold">{profile.username.charAt(0)}</span>
                ) : (
                  <img src={profile.photoURL} />
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
