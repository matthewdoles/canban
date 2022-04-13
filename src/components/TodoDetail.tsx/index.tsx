import React from 'react';
import { Stage } from '../../models/Stage';
import { Todo } from '../../models/Todo.model';

type Props = {
  allStages: Stage[];
  todo: Todo;
};

const TodoDetail = ({ allStages, todo }: Props) => {
  return (
    <div className="w-1/4 bg-white text-lg">
      <div
        className={`h-12 flex flex-row ${
          allStages.find((stage) => {
            return stage.title === todo.stage;
          })?.color
        } p-1`}></div>
      <div className="m-4">
        <p className="font-bold">Title</p>
        <p>{todo.title}</p>
      </div>
      <div className="m-4">
        <p className="font-bold">Description</p>
        <p>{todo.description}</p>
      </div>
      <div className="m-4">
        <p className="font-bold">Stage</p>
        <p>{todo.stage}</p>
      </div>
    </div>
  );
};

export default TodoDetail;
