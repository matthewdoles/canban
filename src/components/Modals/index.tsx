import React from 'react';

type Props = {
  children: React.ReactNode;
};

const Modal = ({ children }: Props) => {
  return (
    <>
      <input type="checkbox" id="modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box p-0">{children}</div>
      </div>
    </>
  );
};

export default Modal;
