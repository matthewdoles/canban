import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { initProfile, SET_PROFILE } from '../../store/reducers/profile';
import { supabase } from '../../supabaseClient';

const Navigation = () => {
  const profile = useAppSelector((state) => state.profile.profile);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    dispatch({ type: SET_PROFILE, profile: initProfile });
    navigate('/');
  };

  return (
    <div className="flex justify-end align-center mx-4">
      <div className="btn btn-ghost h-14" onClick={signOut}>
        <p className="text-white">Profile</p>
      </div>
      <div className="btn btn-ghost h-14" onClick={signOut}>
        <p className="text-white">Logout</p>
      </div>
      <label className="avatar placeholder mx-2">
        <div className="w-14 h-14 rounded-full bg-primary border-4 border-white">
          <span className="text-3xl text-white font-bold">{profile.username.charAt(0)}</span>
        </div>
      </label>
    </div>
  );
};

export default Navigation;
