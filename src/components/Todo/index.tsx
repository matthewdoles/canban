import React, { useRef } from 'react';
import Draggable from 'react-draggable';

type Props = {
  color: string;
  description: string;
  disabled: boolean;
  dragStart: () => void;
  dragStop: () => void;
  title: string;
};

const Todo = ({ color, description, disabled, dragStart, dragStop, title }: Props) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <Draggable nodeRef={nodeRef} disabled={disabled} onStart={dragStart} onStop={dragStop}>
      <div
        className="min-h-[100px] bg-white m-3 drop-shadow-lg rounded-lg"
        ref={nodeRef}
        style={{ zIndex: 999 }}>
        <div className={`${color} p-1 rounded-t-lg`}>
          <p className="text-md text-white font-bold ml-2">{title}</p>
        </div>
        <div className="mx-4 py-2">
          <p className="font-medium">{description}</p>
        </div>
      </div>
    </Draggable>
  );
};

export default Todo;
