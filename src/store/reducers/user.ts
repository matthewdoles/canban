import { AnyAction } from 'redux';
import { updateProfile } from 'firebase/auth';
import { User } from 'firebase/auth';
import { AppThunk } from '../configureReducer';
import { auth } from '../../firebase';

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

export function updateUser(updatedUser: object): AppThunk {
  return async (dispatch, getState) => {
    const { user } = getState();
    if (auth.currentUser) {
      updateProfile(auth.currentUser, {
        ...updatedUser
      }).then(
        function () {
          dispatch({ type: SET_USER, user: { ...user, ...updatedUser } });
        },
        function (error: string) {
          console.log(error);
        }
      );
    }
  };
}
