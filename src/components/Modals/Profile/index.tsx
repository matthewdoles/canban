import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { updateUser } from '../../../store/reducers/user';

const Profile = () => {
  const [displayName, setDisplayName] = useState<string>('');
  const [photoURL, setPhotoURL] = useState<string>('');
  const user = useAppSelector((state) => state.user.firebaseUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    resetForm();
  }, [user]);

  const inputStyles =
    '!outline-0 text-xl w-full my-2 border-x-transparent ' +
    'border-t-transparent rounded-none border-b-2 border-gray-200';

  const onSaveClick = () => dispatch(updateUser({ ...user, displayName, photoURL }));

  const resetForm = () => {
    setDisplayName(user.displayName || user.email);
    setPhotoURL(user.photoURL || '');
  };

  return (
    <>
      <div className="flex flex-row justify-center bg-primary p-1 rounded-t-lg">
        <h3 className="text-2xl text-white font-bold">Your Profile</h3>
      </div>
      <div className="flex flex-col mx-4 mb-8">
        <div className="avatar placeholder justify-center mt-4">
          <div className="w-20 h-20 rounded-full bg-primary">
            {photoURL.length === 0 ? (
              <span className="text-3xl text-white font-bold">{displayName.charAt(0)}</span>
            ) : (
              <img src={photoURL} />
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="m-4">
            <p className="text-xl font-bold">Name</p>
            <input
              type="text"
              className={`input ${inputStyles}`}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="m-4">
            <p className="text-xl font-bold">Photo URL</p>
            <input
              type="text"
              className={`input ${inputStyles}`}
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
            />
          </div>
          <div className="m-4">
            <p className="text-xl font-bold">Email</p>
            <p className="text-xl">{user.email}</p>
          </div>
        </div>
        <div className="modal-action px-4">
          <label
            htmlFor="profile-modal"
            className="btn border-none w-20 bg-red-500 text-white"
            onClick={resetForm}>
            Close
          </label>
          <label
            htmlFor="profile-modal"
            className="btn border-none w-20 bg-green-500 text-white"
            onClick={onSaveClick}>
            Save
          </label>
        </div>
      </div>
    </>
  );
};

export default Profile;
