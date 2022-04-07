import React, { useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

type Props = {
  color: string;
  description: string;
  disabled: boolean;
  dragging: (_e: DraggableEvent, position: DraggableData) => void;
  dragStart: () => void;
  dragStop: () => void;
  title: string;
};

const TodoDetail = ({
  color,
  description,
  disabled,
  dragging,
  dragStart,
  dragStop,
  title
}: Props) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      disabled={disabled}
      onDrag={dragging}
      onStart={dragStart}
      onStop={dragStop}
      position={{ x: 0, y: 0 }}>
      <div className="min-h-[100px] bg-white m-3 drop-shadow-lg rounded-lg" ref={nodeRef}>
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

export default TodoDetail;
