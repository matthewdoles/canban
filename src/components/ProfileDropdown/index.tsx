import React from 'react';

import { useAppSelector } from '../../hooks';

type Props = {
  signOut: () => void;
};

const ProfileDropdown = ({ signOut }: Props) => {
  const user = useAppSelector((state) => state.user.firebaseUser);

  return (
    <div className="dropdown dropdown-end mb-8">
      <label tabIndex={0} className="avatar placeholder justify-center">
        <div className="w-20 h-20 rounded-full bg-primary border-4 border-white hover:border-black">
          {user !== null && (
            <>
              {user.photoURL === null || user.photoURL.length === 0 ? (
                <span className="text-3xl text-white font-bold">
                  {user.displayName ? user.displayName.charAt(0) : user.email.charAt(0)}
                </span>
              ) : (
                <img src={user.photoURL} />
              )}
            </>
          )}
        </div>
      </label>
      <ul
        tabIndex={0}
        className="mt-1 mr-4 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
        <li>
          <label htmlFor="profile-modal" className="text-xl active:bg-primary">
            Profile
          </label>
        </li>
        <li>
          <a onClick={signOut} className="text-xl active:bg-primary">
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
