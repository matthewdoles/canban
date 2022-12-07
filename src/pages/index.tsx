import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks';
import { supabase } from '../supabaseClient';
import { fetchProfile } from '../store/reducers/profile';
import Login from '../components/Login';
import MyBoards from '../components/Boards/MyBoards';
import BoardForm from '../components/Boards/BoardForm';
import Navigation from '../components/Navigation';

function Dashboard() {
  const [showBoardForm, setShowBoardForm] = useState<boolean>(false);
  const { profile } = useAppSelector((state) => state.profile);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (profile.id.length === 0) {
      dispatch(fetchProfile());
    }
  }, [profile]);

  const signInFacebook = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'twitter'
    });
  };

  const signInGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github'
    });
  };

  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google'
    });
  };

  return (
    <div className="mx-4">
      {profile.id.length === 0 ? (
        <div className="h-screen flex flex-col justify-center">
          <p className="text-5xl text-center text-primary" style={{ fontFamily: 'LemonMilk' }}>
            Canban
          </p>
          <p className="text-md text-white text-center font-bold mt-4">You can do anything!</p>
          <Login
            signInFacebook={signInFacebook}
            signInGithub={signInGithub}
            signInGoogle={signInGoogle}
          />
        </div>
      ) : (
        <div className="pt-4">
          <Navigation />
          <div className="p-4 flex flex-col items-center">
            <MyBoards showBoardForm={() => setShowBoardForm(true)} />
            <BoardForm checked={showBoardForm} close={() => setShowBoardForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
