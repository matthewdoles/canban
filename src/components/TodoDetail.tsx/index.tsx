import React, { useEffect, useState } from 'react';
import { updateTodo } from '../../functions/db';
import { Stage } from '../../models/Stage';
import { Todo } from '../../models/Todo.model';
import TodoComment from '../TodoComment';

type Props = {
  allStages: Stage[];
  todo: Todo;
};

const TodoDetail = ({ allStages, todo }: Props) => {
  const [todoStageNumber, setTodoStageNumber] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    const stage = allStages.filter((stage) => stage.title === todo.stage);
    if (stage.length > 0) {
      setTodoStageNumber(stage[0].stageOrder);
    }
  }, [todo]);

  const onCommentSubmit = async () => {
    try {
      await updateTodo({
        ...todo,
        comments: [
          ...todo.comments,
          { authorId: '12345', description: newComment, date: Date.now() }
        ]
      });
      setNewComment('');
    } catch (err) {
      console.log(err);
    }
  };

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
      <div className="m-4">
        <p className="font-bold">Comments</p>
        <div className="flex flex-col my-2">
          {todo.comments.length === 0 && <p className="mt-2 mb-4">No comment history.</p>}
          {todo.comments.map((comment, i) => (
            <div key={comment.date}>
              <TodoComment
                author="Matthew Doles"
                comment={comment.description}
                date={new Date(comment.date).toString().substring(4, 11)}
                profilePic="https://avatars.githubusercontent.com/u/38084552?s=48&v=4"
              />
              {i + 1 !== todo.comments.length && <div className="divider mt-4"></div>}
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
              <button className="btn bg-green-500 w-30 border-none mt-4" onClick={onCommentSubmit}>
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
