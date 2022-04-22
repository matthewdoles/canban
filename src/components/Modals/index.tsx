import React from 'react';

type Props = {
  children: React.ReactNode;
  id: string;
};

const Modal = ({ children, id }: Props) => {
  return (
    <>
      <input type="checkbox" id={id} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box p-0">{children}</div>
      </div>
    </>
  );
};

export default Modal;
