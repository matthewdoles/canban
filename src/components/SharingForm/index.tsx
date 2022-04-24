import React, { useState } from 'react';

const SharingForm = () => {
  const [email, setEmail] = useState<string>('');

  const inputStyles =
    '!outline-0 text-xl w-full my-4 border-x-transparent ' +
    'border-t-transparent rounded-none border-b-2 mr-2 border-gray-200';

  const searchForUser = () => {
    console.log(email);
  };

  return (
    <>
      <input type="checkbox" id="share-form" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box p-0 !min-w-[650px]">
          <div className="w-full relative justify-center bg-purple-500 p-1 rounded-t-lg">
            <p className="text-2xl text-white text-center font-bold">Sharing</p>
          </div>
          <div className="flex flex-col w-full items-center p-4">
            <div className="flex flex-row w-3/4 items-center">
              <input
                type="text"
                placeholder="User Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input ${inputStyles}`}
              />
              <button className="btn bg-purple-500 w-20 border-none" onClick={searchForUser}>
                Search
              </button>
            </div>
            <div className="modal-action">
              <label htmlFor="share-form" className="btn bg-red-500 w-20 border-none">
                Cancel
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SharingForm;
