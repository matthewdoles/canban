import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useAppSelector } from '../../../hooks';
import { Stage } from '../../../models/Stage.model';
import { Todo } from '../../../models/Todo.model';
import { inputStyles } from '../../../const';

type Props = {
  addNewTodo: (todo: Todo) => void;
  allStages: Stage[];
  autoPopStage: string;
  checked: boolean;
  close: () => void;
};

const TodoForm = ({ addNewTodo, allStages, autoPopStage, checked, close }: Props) => {
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<string>(autoPopStage);
  const [stages] = useState<Stage[]>(allStages);
  const [todoName, setTodoName] = useState<string>('');
  const { profile } = useAppSelector((state) => state.profile);

  const onSaveClick = () => {
    if (todoName.length === 0) return setError('Please enter a task name.');
    addNewTodo({
      assignee: profile.id,
      comments: [],
      created: Date.now(),
      description: description,
      id: uuidv4(),
      isArchived: false,
      stage: selectedStage,
      title: todoName
    });
    closeForm();
  };

  const closeForm = () => {
    setDescription('');
    setTodoName('');
    close();
  };

  return (
    <>
      <input className="modal-toggle" checked={checked} readOnly type="checkbox" />
      <div className="modal">
        <div className="modal-box !min-w-[650px] p-0">
          <div className="w-full relative justify-center bg-primary rounded-t-lg p-1"></div>
          <div className="flex flex-col w-full items-center p-4">
            <input
              className={`input max-w-md ${inputStyles}`}
              onChange={(e) => setTodoName(e.target.value)}
              placeholder="Task Name"
              type="text"
              value={todoName}
            />
            <textarea
              className={`textarea max-w-md ${inputStyles}`}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows={3}
              value={description}
            />
            <select
              className={`select max-w-md ${inputStyles}`}
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
              <label className="btn bg-red-500 text-white w-20 border-none" onClick={closeForm}>
                Cancel
              </label>
              <label className="btn bg-green-500 text-white w-20 border-none" onClick={onSaveClick}>
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
