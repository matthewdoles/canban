import { AnyAction } from 'redux';
import { User } from 'firebase/auth';

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
