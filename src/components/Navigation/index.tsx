import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { initProfile, SET_PROFILE } from '../../store/reducers/profile';
import { supabase } from '../../supabaseClient';
import Profile from '../Modals/Profile';

const Navigation = () => {
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
              <span className="text-3xl text-white font-bold">{profile.username.charAt(0)}</span>
            ) : (
              <img src={profile.photoURL} />
            )}
          </div>
        </label>
      </div>
      <Profile checked={showProfile} close={() => setShowProfile(false)} />
    </>
  );
};

export default Navigation;
