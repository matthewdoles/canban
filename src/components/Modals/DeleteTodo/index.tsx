import React from 'react';

type Props = {
  checked: boolean;
  title: string;
  confirm: () => void;
  close: () => void;
};

const DeleteTodo = ({ checked, title, confirm, close }: Props) => {
  return (
    <>
      <input type="checkbox" className="modal-toggle" checked={checked} readOnly />
      <div className="modal">
        <div className="modal-box p-0">
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
            <label className="btn border-none bg-red-500 text-white" onClick={close}>
              Cancel
            </label>
            <label className="btn border-none bg-green-500 text-white" onClick={confirm}>
              Confirm
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteTodo;
