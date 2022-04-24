import React, { ReactElement, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, firestore } from '../../firebase';
import { useAppDispatch } from '../../hooks';
import { SET_USER } from '../../store/reducers/user';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const onAuthStateChanged = (loggedInUser: User | null) => {
      if (loggedInUser) {
        const q = query(
          collection(firestore, 'users'),
          where('uid', '==', loggedInUser.uid),
          limit(1)
        );
        getDocs(q).then((userDocs) => {
          userDocs.forEach((userDoc) => {
            if (userDoc.exists()) {
              dispatch({ type: SET_USER, user: { recordId: userDoc.id, ...userDoc.data() } });
            }
          });
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
