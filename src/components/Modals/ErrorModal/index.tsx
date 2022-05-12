import React from 'react';

type Props = {
  error: string;
  onClose: () => void;
};

const ErrorModal = ({ error, onClose }: Props) => {
  return (
    <>
      <div
        className={`flex flex-row justify-center bg-red-500 p-1 rounded-t-lg cursor-grab header`}>
        <h3 className="text-2xl text-white font-bold">Error</h3>
      </div>
      <div className="mt-4 text-center">
        <p className="text-lg">{error}</p>
      </div>
      <div className="modal-action p-4">
        <label className="btn border-none bg-red-500 text-white" onClick={onClose}>
          Close
        </label>
      </div>
    </>
  );
};

export default ErrorModal;
