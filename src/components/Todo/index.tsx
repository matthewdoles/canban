import React, { useRef } from 'react';
import Draggable from 'react-draggable';

type Props = {
  color: string;
  disabled: boolean;
  title: string;
};

const Todo = ({ color, disabled, title }: Props) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <Draggable nodeRef={nodeRef} disabled={disabled}>
      <div
        className="min-h-[100px] bg-white m-3 drop-shadow-lg rounded-lg"
        ref={nodeRef}
        style={{ zIndex: 999 }}>
        <div className={`${color} p-1 rounded-t-lg`}>
          <p className="text-md text-white font-bold ml-2">{title}</p>
        </div>
      </div>
    </Draggable>
  );
};

export default Todo;
