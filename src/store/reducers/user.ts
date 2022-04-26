import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { AnyAction } from 'redux';
import { firestore, userCol } from '../../firebase';
import { User } from '../../models/User.model';
import { AppThunk } from '../configureReducer';

export const SET_USER = 'SET_USER';
export const SET_ALL_USERS = 'SET_ALL_USERS';

type UserState = {
  firebaseUser: User | null;
  allUsers: User[];
};

const initialState: UserState = {
  firebaseUser: null,
  allUsers: []
};

export default function userReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        firebaseUser: action.user
      };
    case SET_ALL_USERS:
      return {
        ...state,
        allUsers: [...state.allUsers, ...action.users]
      };
    default:
      return { ...state };
  }
}

export function updateUser(user: User): AppThunk {
  return async (dispatch) => {
    const userDocRef = doc(userCol, user.recordId);
    updateDoc(userDocRef, {
      displayName: user.displayName,
      photoURL: user.photoURL
    }).then(() => {
      dispatch({ type: SET_USER, user });
    });
  };
}

export function getUsers(uids: string[]): AppThunk {
  return async (dispatch, getState) => {
    const { user } = getState();
    const newUIDs: string[] = [];
    uids.forEach((uid) => {
      if (user.allUsers.filter((u) => u.uid === uid).length === 0) newUIDs.push(uid);
    });
    if (newUIDs.length > 0) {
      const q = query(collection(firestore, 'users'), where('uid', 'in', newUIDs));
      getDocs(q).then((userDocs) => {
        const userData: User[] = [];
        userDocs.forEach((userDoc) => {
          const user = { ...userDoc.data() };
          userData.push({
            recordId: userDoc.id,
            email: user.email,
            emailVerified: user.emailVerified,
            creationTime: user.creationTime,
            photoURL: user.photoURL,
            uid: user.uid,
            displayName: user.displayName
          });
        });
        dispatch({ type: SET_ALL_USERS, users: userData });
      });
    }
  };
}
