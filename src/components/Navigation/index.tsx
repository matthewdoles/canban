import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Profile from '../Modals/Profile';
import { supabase } from '../../supabaseClient';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { initProfile, SET_PROFILE } from '../../store/reducers/profile';
import { fonts, messages } from '../../const';

type Props = {
  isDemoNav?: boolean;
};

const Navigation = ({ isDemoNav }: Props) => {
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const profile = useAppSelector((state) => state.profile.profile);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const signOut = async () => {
    await supabase.auth.signOut();
    dispatch({ type: SET_PROFILE, profile: initProfile });
    navigate('/');
  };

  return (
    <>
      <div className="flex flex-row  align-center w-full">
        <div className="w-1/3 "></div>
        <p
          className="w-1/3 text-5xl text-center text-primary"
          style={{ fontFamily: fonts.lemonMilk }}>
          <Link to={'/'}>{messages.title}</Link>
        </p>
        <div className="w-1/3 ">
          {!isDemoNav ? (
            <>
              <div className="flex justify-end align-center mx-4">
                {location.pathname !== '/' ? (
                  <Link to={'/'}>
                    <div className="btn btn-ghost h-14">
                      <p className="text-white">Dashboard</p>
                    </div>
                  </Link>
                ) : null}
                <div className="btn btn-ghost h-14" onClick={() => setShowProfile(true)}>
                  <p className="text-white">Profile</p>
                </div>
                <div className="btn btn-ghost h-14" onClick={signOut}>
                  <p className="text-white">Logout</p>
                </div>
                <label className="avatar placeholder mx-2">
                  <div className="w-14 h-14 rounded-full bg-primary border-4 border-white">
                    {profile.photoURL.length === 0 ? (
                      <span className="text-3xl text-white font-bold">
                        {profile.username.charAt(0)}
                      </span>
                    ) : (
                      <img src={profile.photoURL} />
                    )}
                  </div>
                </label>
              </div>
              <Profile checked={showProfile} close={() => setShowProfile(false)} />
            </>
          ) : (
            <div className="flex justify-end align-center mx-4">
              <Link to={'/'}>
                <div className="btn btn-ghost h-14">
                  <p className="text-white">Login</p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;
