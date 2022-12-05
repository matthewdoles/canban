import React, { useEffect, useState } from 'react';
import { BsArchiveFill } from 'react-icons/bs';
import { MdDelete, MdOutlineModeEditOutline } from 'react-icons/md';
import Moment from 'react-moment';
import { useAppSelector } from '../../../hooks';

import { Stage } from '../../../models/Stage.model';
import { Todo } from '../../../models/Todo.model';
import TodoComment from '../TodoComment';

type Props = {
  allStages: Stage[];
  todo: Todo;
  onArchive: () => void;
  updateTodo: (todo: Todo) => void;
};

const TodoDetail = ({ allStages, todo, onArchive, updateTodo }: Props) => {
  const [todoStageNumber, setTodoStageNumber] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [stageTitle, setStageTitle] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const { profile } = useAppSelector((state) => state.profile);

  const inputStyles =
    '!outline-0 text-xl w-full my-2 border-x-transparent ' +
    'border-t-transparent rounded-none border-b-2 mr-2 border-gray-200';

  useEffect(() => {
    setFormData();
  }, [todo]);

  const onSaveSubmit = async () => {
    updateTodo({
      ...todo,
      description: description,
      title: title,
      stage: stageTitle
    });
    setEditMode(false);
  };

  const onCancelClick = () => {
    setFormData();
    setEditMode(false);
  };

  const setFormData = () => {
    const stage = allStages.filter((stage) => stage.title === todo.stage);
    if (stage.length > 0) {
      setTodoStageNumber(stage[0].stageOrder);
    }
    setDescription(todo.description);
    setTitle(todo.title);
    setStageTitle(todo.stage);
  };

  const onCommentSubmit = async () => {
    updateTodo({
      ...todo,
      comments: [
        ...todo.comments,
        { authorId: profile.id, description: newComment, date: Date.now() }
      ]
    });
    setNewComment('');
  };

  return (
    <div className="w-1/2 lg:w-1/3 bg-white text-lg">
      <div
        className={`h-12 flex flex-row ${
          allStages.find((stage) => {
            return stage.title === todo.stage;
          })?.color
        } p-1`}></div>

      {!todo.isArchived ? (
        <div className="absolute right-3 top-14">
          <div className="tooltip tooltip-bottom font-bold" data-tip="Edit">
            <MdOutlineModeEditOutline
              size={28}
              className="mr-2 cursor-pointer text-green-500"
              onClick={() => setEditMode(!editMode)}
            />
          </div>
          <div
            className="tooltip tooltip-bottom font-bold"
            data-tip={todo.isArchived ? 'Restore' : 'Archive'}>
            <label>
              <BsArchiveFill
                size={20}
                className="mx-2 mb-1 cursor-pointer text-purple-500"
                onClick={onArchive}
              />
            </label>
          </div>
          <div className="tooltip tooltip-bottom font-bold" data-tip="Delete">
            <label htmlFor="delete-todo-modal">
              <MdDelete size={28} className="mx-2 cursor-pointer text-red-500" />
            </label>
          </div>
        </div>
      ) : (
        <div className="absolute right-6 top-16">
          <div className="tooltip tooltip-bottom font-bold" data-tip="Un-Archive">
            <label>
              <BsArchiveFill
                size={20}
                className="mx-2 mb-1 cursor-pointer text-purple-500"
                onClick={onArchive}
              />
            </label>
          </div>
        </div>
      )}
      <div className="m-4">
        <p className="font-bold">Title</p>
        {editMode ? (
          <input
            className={`input ${inputStyles}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <p className="text-xl">{title}</p>
        )}
      </div>
      <div className="m-4">
        <p className="font-bold">Description</p>
        {editMode ? (
          <textarea
            className={`textarea ${inputStyles}`}
            value={description}
            rows={5}
            onChange={(e) => setDescription(e.target.value)}
          />
        ) : (
          <p className="text-xl">{description}</p>
        )}
      </div>
      <div className="m-4">
        <p className="font-bold">Created</p>
        <Moment className="text-xl" format="MM/DD/YY, h:mm a">
          {todo.created}
        </Moment>
      </div>
      <div className="m-4">
        <p className="font-bold">Stage</p>
        <ul className="steps steps-vertical">
          {allStages.map((stg) => (
            <li
              key={stg.stageOrder}
              className={`step ${stg.stageOrder <= todoStageNumber && 'step-filled'} ${
                editMode && 'cursor-pointer'
              }`}
              onClick={() => {
                if (editMode) {
                  setStageTitle(stg.title);
                  const stage = allStages.filter((stage) => stage.title === stg.title);
                  if (stage.length > 0) {
                    setTodoStageNumber(stage[0].stageOrder);
                  }
                }
              }}>
              {stg.title}
            </li>
          ))}
        </ul>
      </div>
      {editMode && (
        <div className="flex flex-row justify-center">
          <button
            className="btn bg-red-500 text-white w-30 border-none mx-2"
            onClick={onCancelClick}>
            Cancel
          </button>
          <button
            className="btn bg-green-500 text-white w-30 border-none mx-2"
            onClick={onSaveSubmit}>
            Save
          </button>
          <div className="divider mt-4" />
        </div>
      )}
      <div className="m-4">
        <p className="font-bold">Comments</p>
        <div className="flex flex-col my-2">
          {todo.comments.length === 0 && <p className="mt-2 mb-4">No comment history.</p>}
          {todo.comments.map((comment, i) => (
            <div key={comment.date}>
              <TodoComment
                author={profile.username}
                comment={comment.description}
                date={comment.date}
              />
              {i + 1 !== todo.comments.length && <div className="divider mt-4" />}
            </div>
          ))}
          <div className="mt-8">
            <p className="font-bold">New Comment</p>
            <textarea
              className={
                `textarea !outline-0 text-lg w-full mt-4 p-0 border-x-transparent ` +
                `border-t-transparent rounded-none border-b-2 border-gray-200`
              }
              placeholder="Type here..."
              rows={3}
              onChange={(e) => setNewComment(e.target.value)}
              value={newComment}
            />
            <div className="flex justify-end">
              <button
                className="btn bg-green-500 text-white w-30 border-none mt-4"
                onClick={onCommentSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoDetail;