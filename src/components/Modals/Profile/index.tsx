import React from 'react';
import { useAppSelector } from '../../../hooks';

const Profile = () => {
  const user = useAppSelector((state) => state.user.firebaseUser);
  const inputStyles =
    '!outline-0 text-xl w-full my-2 border-x-transparent ' +
    'border-t-transparent rounded-none border-b-2 mr-2 border-gray-200';

  return (
    <>
      <div className="flex flex-row justify-center bg-blue-500 p-1 rounded-t-lg">
        <h3 className="text-2xl text-white font-bold">Your Profile</h3>
      </div>
      <div className="flex flex-col mx-4 mb-8">
        <div className="avatar justify-center mt-4">
          <div className="w-20 h-20 rounded-full">
            <img src="https://avatars.githubusercontent.com/u/38084552?s=48&v=4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="m-4">
            <p className="text-xl font-bold">Display Name</p>
            <input className={`input ${inputStyles}`} />
          </div>
          <div className="flex flex-row m-4 items-center">
            <div className="w-full">
              <p className="text-xl font-bold">Photo URL</p>
              <input className={`input ${inputStyles}`} />
            </div>
            <div className="mt-7 ml-4">
              <button className="btn border-none w-30 bg-blue-500">Preview</button>
            </div>
          </div>
          <div className="m-4">
            <p className="text-xl font-bold">Email</p>
            <p className="text-xl">{user.email}</p>
          </div>
        </div>
        <div className="modal-action px-4">
          <label htmlFor="profile-modal" className="btn border-none w-20 bg-red-500">
            Close
          </label>
          <label htmlFor="profile-modal" className="btn border-none w-20 bg-green-500">
            Save
          </label>
        </div>
      </div>
    </>
  );
};

export default Profile;
