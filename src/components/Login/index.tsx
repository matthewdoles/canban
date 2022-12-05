import React from 'react';
import { BounceLoader } from 'react-spinners';

import { useAppSelector } from '../../hooks';

type Props = {
  signIn: () => void;
};

const Login = ({ signIn }: Props) => {
  const { profileError, profileLoading } = useAppSelector((state) => state.profile);

  return (
    <div className="lg:w-2/5 md:3/4 sm:w-4/5 flex flex-col mx-auto bg-white shadow-lg items-center rounded-lg">
      <div className="flex flex-col w-full items-center p-4">
        <p className="text-red-500 font-bold">{profileError}</p>
        <div className="flex flex-col w-full items-center mt-4">
          {profileLoading && (
            <div className="flex flex-row justify-center p-4">
              <BounceLoader size={75} color="#FFD369" />
            </div>
          )}
          {!profileLoading && (
            <>
              <label className="btn btn-ghost w-40 border-none my-2" onClick={signIn}>
                Google
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
