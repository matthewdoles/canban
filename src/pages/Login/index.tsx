import React, { useEffect, useState } from 'react';
import { BounceLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { supabase } from '../../supabaseClient';
import { fetchProfile } from '../../store/reducers/profile';

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const { profile, profileError, profileLoading } = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const inputStyles =
    '!outline-0 text-xl w-full max-w-md my-4 border-x-transparent ' +
    'border-t-transparent rounded-none border-b-2 mr-2 border-gray-200';

  useEffect(() => {
    dispatch(fetchProfile());
    if (profile !== null) {
      navigate('/');
    }
  }, [profile]);

  const handleFormSubmit = async () => {
    //
  };

  return (
    <div className="pt-8">
      <p className="text-5xl text-center text-primary mb-8" style={{ fontFamily: 'LemonMilk' }}>
        Canban
      </p>
      {profile.id.length === 0 && (
        <div className="lg:w-2/5 md:3/4 sm:w-4/5 flex flex-col mx-auto bg-white shadow-lg items-center rounded-lg">
          <div className="w-full relative justify-center bg-primary p-1 rounded-t-lg">
            <p
              className="text-xl text-white text-center font-bold"
              style={{ fontFamily: 'Noto Sans' }}>
              {profile.id.length === 0 ? 'Logout' : isCreate ? 'Create Account' : 'Login'}
            </p>
          </div>
          <div className="flex flex-col w-full items-center p-4">
            <>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input ${inputStyles}`}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input ${inputStyles}`}
              />
            </>
            <p className="text-red-500 font-bold">{profileError}</p>
            <div className="flex flex-col w-full items-center mt-4">
              {profileLoading && (
                <div className="flex flex-row justify-center p-4">
                  <BounceLoader size={75} color="#FFD369" />
                </div>
              )}
              {!profileLoading && (
                <>
                  <label
                    className="btn bg-green-500 text-white w-40 border-none my-2"
                    onClick={handleFormSubmit}>
                    {isCreate ? 'Create' : 'Login'}
                  </label>
                  <label
                    className="btn btn-ghost w-40 border-none my-2"
                    onClick={() => setIsCreate(!isCreate)}>
                    {isCreate ? 'Login' : 'Sign Up'}
                  </label>
                  <label
                    className="btn btn-ghost w-40 border-none my-2"
                    onClick={async () => {
                      await supabase.auth.signInWithOAuth({
                        provider: 'google'
                      });
                    }}>
                    Google
                  </label>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
