import { doc, updateDoc } from 'firebase/firestore';
import { AnyAction } from 'redux';
import { userCol } from '../../firebase';
import { User } from '../../models/User.model';
import { AppThunk } from '../configureReducer';

export const SET_USER = 'SET_USER';

type UserState = {
  firebaseUser: User | null;
};

const initialState: UserState = {
  firebaseUser: null
};

export default function userReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        firebaseUser: action.user
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
