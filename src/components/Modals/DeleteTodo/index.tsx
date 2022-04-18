import React from 'react';

type Props = {
  title: string;
  confirm: () => void;
};

const DeleteTodo = ({ title, confirm }: Props) => {
  return (
    <>
      <div
        className={`flex flex-row justify-center bg-red-500 p-1 rounded-t-lg cursor-grab header`}>
        <h3 className="text-2xl text-white font-bold">Delete Task</h3>
      </div>
      <div className="mt-4 text-center">
        <p className="text-lg">Are you sure you want to delete this task?</p>
        <p className="text-2xl font-bold my-2">
          <b>{title}</b>
        </p>
      </div>
      <div className="modal-action p-4">
        <label htmlFor="modal" className="btn border-none bg-red-500">
          Cancel
        </label>
        <label htmlFor="modal" className="btn border-none bg-green-500" onClick={confirm}>
          Confirm
        </label>
      </div>
    </>
  );
};

export default DeleteTodo;
