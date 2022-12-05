import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks';
import { supabase } from '../supabaseClient';
import { fetchProfile, initProfile, SET_PROFILE } from '../store/reducers/profile';
import ProfileDropdown from '../components/ProfileDropdown';
import Login from '../components/Login';
import MyBoards from '../components/Boards/MyBoards';

function Dashboard() {
  const { profile } = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (profile.id.length === 0) {
      dispatch(fetchProfile());
    }
  }, [profile]);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google'
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    dispatch({ type: SET_PROFILE, profile: initProfile });
  };

  return (
    <div className="pt-8">
      {profile.id.length === 0 ? (
        <>
          <p className="text-5xl text-center text-primary mb-8" style={{ fontFamily: 'LemonMilk' }}>
            Canban
          </p>
          <Login signIn={signIn} />
        </>
      ) : (
        <div className="p-8 flex flex-col items-center">
          <ProfileDropdown signOut={signOut} />
          <MyBoards />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
