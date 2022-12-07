import React, { useEffect, useState } from 'react';

import BoardForm from '../components/Boards/BoardForm';
import Login from '../components/Login';
import Navigation from '../components/Navigation';
import MyBoards from '../components/Boards/MyBoards';
import { supabase } from '../supabaseClient';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProfile } from '../store/reducers/profile';
import { fonts, messages } from '../const';

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
          <p className="text-5xl text-center text-primary" style={{ fontFamily: fonts.lemonMilk }}>
            {messages.title}
          </p>
          <p className="text-md text-white text-center font-bold mt-4">{messages.subtitle}</p>
          <Login
            signInFacebook={signInFacebook}
            signInGithub={signInGithub}
            signInGoogle={signInGoogle}
          />
        </div>
      ) : (
        <div className="pt-4">
          <Navigation />
          <div className="flex flex-col items-center p-4">
            <MyBoards showBoardForm={() => setShowBoardForm(true)} />
            <BoardForm checked={showBoardForm} close={() => setShowBoardForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
