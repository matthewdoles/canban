import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { BounceLoader } from 'react-spinners';

import { useAppSelector } from '../../hooks';

type Props = {
  signInFacebook: () => void;
  signInGithub: () => void;
  signInGoogle: () => void;
};

const Login = ({ signInFacebook, signInGithub, signInGoogle }: Props) => {
  const { profileError, profileLoading } = useAppSelector((state) => state.profile);

  return (
    <div className="lg:w-2/5 md:3/4 sm:w-4/5 flex flex-col mx-auto items-center rounded-lg">
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
              <div className="flex flex-col border-4 border-primary rounded-md p-8">
                <div className="bg-primary p-3 rounded-md w-60 border-none my-2 align-center justify-between">
                  <p className="text-white text-center" style={{ fontFamily: 'LemonMilk' }}>
                    LOGIN
                  </p>
                </div>
                <div
                  className="btn btn-white w-60 border-none my-2 align-center justify-between"
                  onClick={signInGoogle}>
                  <div className="w-1/3 flex justify-center">
                    <FcGoogle size={22} />
                  </div>
                  <div className="w-1/3">
                    <p>Google</p>
                  </div>
                  <div className="w-1/3"></div>
                </div>
                <div
                  className="btn btn-white w-60 border-none my-2 align-center justify-between"
                  onClick={signInGithub}>
                  <div className="w-1/3 flex justify-center">
                    <FaGithub size={22} />
                  </div>
                  <div className="w-1/3">
                    <p>Github</p>
                  </div>
                  <div className="w-1/3"></div>
                </div>
                <div
                  className="btn btn-white w-60 border-none my-2 align-center justify-between"
                  onClick={signInFacebook}>
                  <div className="w-1/3 flex justify-center">
                    <FaFacebook size={22} className="text-blue-700" />
                  </div>
                  <div className="w-1/3">
                    <p>Facebook</p>
                  </div>
                  <div className="w-1/3"></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
