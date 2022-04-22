import React, { ReactElement, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAppDispatch } from '../../hooks';
import { SET_USER } from '../../store/reducers/user';

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const onAuthStateChanged = (loggedInUser: User | null) => {
      if (loggedInUser) {
        dispatch({
          type: SET_USER,
          user: {
            displayName: loggedInUser.displayName,
            email: loggedInUser.email,
            photoURL: loggedInUser.photoURL,
            uid: loggedInUser.uid
          }
        });
      } else {
        dispatch({ type: SET_USER, user: null });
      }
    };
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  return children as ReactElement<any>;
}
