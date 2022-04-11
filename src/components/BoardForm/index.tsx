import React from 'react';

const BoardForm = () => {
  return (
    <>
      <input type="checkbox" id="board-form" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Congratulations random Interner user!</h3>
          <p className="py-4">
            Youve been selected for a chance to get one year of subscription to use Wikipedia for
            free!
          </p>
          <div className="modal-action">
            <label htmlFor="board-form" className="btn bg-red-500 w-20 border-none">
              Cancel
            </label>
            <label htmlFor="board-form" className="btn bg-green-500 w-20 border-none">
              Save
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardForm;
