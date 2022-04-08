import React from 'react';
import { sampleBoardSettings } from '../../const/sampleData';
import { Todo } from '../../models/Todo.model';

type Props = {
  todo: Todo;
};

const TodoDetail = ({ todo }: Props) => {
  return (
    <div className="w-1/4 bg-white text-lg">
      <div
        className={`h-12 flex flex-row ${
          sampleBoardSettings.stages.find((stage) => {
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
