import React, { useState } from 'react';

import { Stage } from '../../models/Stage';
import { Todo } from '../../models/Todo.model';

type Props = {
  addNewTodo: (todo: Todo) => void;
  allStages: Stage[];
  autoPopStage: string;
  boardId: string;
};

const TodoForm = ({ addNewTodo, allStages, autoPopStage, boardId }: Props) => {
  const [todoName, setTodoName] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<string>(autoPopStage);
  const [stages] = useState<Stage[]>(allStages);
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');

  const inputStyles =
    '!outline-0 text-xl w-full max-w-sm my-4 border-x-transparent ' +
    'border-t-transparent rounded-none border-b-2 mr-2 border-gray-200';

  const onSaveClick = () => {
    if (todoName.length === 0) return setError('Please enter a task name.');
    addNewTodo({
      title: todoName,
      description: description,
      stage: selectedStage,
      boardId,
      comments: []
    });
  };

  return (
    <>
      <input type="checkbox" id={`todo-form-${autoPopStage}`} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box p-0 !min-w-[650px]">
          <div className="w-full relative justify-center bg-blue-500 p-1 rounded-t-lg">
            <p className="text-2xl text-white text-center font-bold">New Todo</p>
          </div>
          <div className="flex flex-col w-full items-center p-4">
            <input
              type="text"
              placeholder="Task Name"
              value={todoName}
              onChange={(e) => setTodoName(e.target.value)}
              className={`input ${inputStyles}`}
            />
            <textarea
              className={`textarea ${inputStyles}`}
              rows={3}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              className={`select ${inputStyles}`}
              onChange={(e) => setSelectedStage(e.target.value)}
              value={selectedStage}>
              {stages.map((stage) => (
                <option key={stage.stageOrder}>{stage.title}</option>
              ))}
            </select>
            {error.length > 0 && (
              <div className="mt-4">
                <p className="text-xl text-red-500 font-bold">{error}</p>
              </div>
            )}
            <div className="modal-action">
              <label
                htmlFor={`todo-form-${autoPopStage}`}
                className="btn bg-red-500 w-20 border-none">
                Cancel
              </label>
              <label className="btn bg-green-500 w-20 border-none" onClick={onSaveClick}>
                Save
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoForm;
