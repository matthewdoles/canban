import React from 'react';
import { Todo } from '../../models/Todo.model';

type Props = {
  color: string;
  todo: Todo;
};

const TodoDetail = ({ color, todo }: Props) => {
  return (
    <div className="w-1/4 bg-white">
      <div className={`h-12 flex flex-row ${color} p-1`}></div>
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
