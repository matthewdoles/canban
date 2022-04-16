import React, { useEffect, useState } from 'react';
import { Stage } from '../../models/Stage';
import { Todo } from '../../models/Todo.model';

type Props = {
  allStages: Stage[];
  todo: Todo;
};

const TodoDetail = ({ allStages, todo }: Props) => {
  const [todoStageNumber, setTodoStageNumber] = useState<number>(0);
  useEffect(() => {
    setTodoStageNumber(allStages.filter((stage) => stage.title === todo.stage)[0].stageOrder);
  }, [todo]);
  return (
    <div className="w-1/2 lg:w-1/3 xl:w-1/4 bg-white text-lg">
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
        <ul className="steps steps-vertical">
          {allStages.map((stage) => (
            <li
              key={stage.stageOrder}
              className={`step ${stage.stageOrder <= todoStageNumber ? 'step-filled' : ''}`}>
              {stage.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoDetail;
