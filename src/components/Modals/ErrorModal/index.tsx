import React from 'react';

type Props = {
  checked: boolean;
  error: string;
  onClose: () => void;
};

const ErrorModal = ({ checked, error, onClose }: Props) => {
  return (
    <>
      <input type="checkbox" className="modal-toggle" checked={checked} readOnly />
      <div className="modal">
        <div className="modal-box p-0">
          <div className="bg-red-500 p-1" />
          <p className="text-lg my-4 px-8 break-word">{error}</p>
          <div className="modal-action mb-4 mr-4">
            <label className="btn btn-sm border-none bg-red-500 text-white" onClick={onClose}>
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorModal;
