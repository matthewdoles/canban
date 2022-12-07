import React, { useEffect, useState } from 'react';
import { inputStyles } from '../../../const';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { updateProfile } from '../../../store/reducers/profile';

type Props = {
  checked: boolean;
  close: () => void;
};

const Profile = ({ checked, close }: Props) => {
  const [username, setUsername] = useState<string>('');
  const [photoURL, setPhotoURL] = useState<string>('');
  const { profile } = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();

  useEffect(() => {
    resetForm();
  }, [profile]);

  const onSaveClick = () => {
    dispatch(updateProfile(username, photoURL));
    close();
  };

  const resetForm = () => {
    setUsername(profile.username);
    setPhotoURL(profile.photoURL);
    close();
  };

  return (
    <>
      <input type="checkbox" className="modal-toggle" checked={checked} readOnly />
      <div className="modal">
        <div className="modal-box p-0">
          <div className="flex flex-row justify-center bg-primary p-1 rounded-t-lg"></div>
          <div className="flex flex-col mx-4 mb-8">
            <div className="avatar placeholder justify-center mt-4">
              <div className="w-20 h-20 rounded-full bg-primary">
                {photoURL.length === 0 ? (
                  <span className="text-3xl text-white font-bold">{username.charAt(0)}</span>
                ) : (
                  <img src={photoURL} />
                )}
              </div>
            </div>
            <div className="mt-4">
              <div className="m-4">
                <p className="text-xl font-bold">Username</p>
                <input
                  type="text"
                  className={`input ${inputStyles}`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                <p className="text-xl">{profile.email}</p>
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
        </div>
      </div>
    </>
  );
};

export default Profile;
