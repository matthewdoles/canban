import { AnyAction } from 'redux';
import { Profile } from '../../models/Profile.model';
import { supabase } from '../../supabaseClient';
import { AppThunk } from '../configureReducer';

export const SET_PROFILE = 'SET_PROFILE';
export const SET_PROFILE_COLLECTION = 'SET_PROFILE_COLLECTION';
export const SET_PROFILE_ACTION_START = 'SET_PROFILE_ACTION_START';
export const SET_PROFILE_ERROR = 'SET_PROFILE_ERROR';
export const SET_PROFILE_LOADING = 'SET_PROFILE_LOADING';

export const initProfile = {
  id: '',
  photoURL: '',
  username: ''
};

type ProfileState = {
  profile: Profile;
  profileError: string;
  profileLoading: boolean;
};

const initialState: ProfileState = {
  profile: initProfile,
  profileError: '',
  profileLoading: false
};

export default function profileReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case SET_PROFILE:
      return {
        ...state,
        profile: action.profile
      };
    case SET_PROFILE_ACTION_START:
      return {
        ...state,
        profileError: '',
        profileLoading: true
      };
    case SET_PROFILE_ERROR:
      return {
        ...state,
        profileError: action.profileError
      };
    case SET_PROFILE_LOADING:
      return {
        ...state,
        profileLoading: action.profileLoading
      };
    default:
      return { ...state };
  }
}

export const fetchProfile = (): AppThunk => {
  return async (dispatch) => {
    dispatch({ type: SET_PROFILE_ACTION_START });
    supabase.auth
      .getUser()
      .then(async ({ data }) => {
        if (data.user?.id) {
          const record = await supabase.from('profiles').select().eq('id', data.user.id).limit(1);

          if (record.error) {
            return dispatch({ type: SET_PROFILE_ERROR, profileError: record.error.message });
          }
          if (record.data?.length === 1) {
            dispatch({ type: SET_PROFILE, profile: record.data[0] });
          }
          if (record.data?.length === 0 && !record.error) {
            dispatch(createProfile());
          }
        }
        return null;
      })
      .catch((e: unknown) => {
        if (typeof e === 'string') {
          dispatch({ type: SET_PROFILE_ERROR, profileError: e });
        } else if (e instanceof Error) {
          dispatch({ type: SET_PROFILE_ERROR, profileError: e.message });
        }
      })
      .finally(() => {
        dispatch({ type: SET_PROFILE_LOADING, profileLoading: false });
      });
  };
};

const createProfile = (): AppThunk => {
  return async (dispatch) => {
    dispatch({ type: SET_PROFILE_ACTION_START });
    supabase.auth
      .getUser()
      .then(async ({ data }) => {
        if (data.user?.id && data.user?.email) {
          const record = await supabase
            .from('profiles')
            .upsert({
              email: data.user.email,
              username: data.user.email.substring(0, data.user.email.lastIndexOf('@')),
              id: data.user.id
            })
            .select();
          if (record.error) {
            dispatch({ type: SET_PROFILE_ERROR, profileError: record.error.message });
          }
          if (record.data) {
            dispatch({ type: SET_PROFILE, profile: record.data[0] });
          }
        }
      })
      .catch((e: unknown) => {
        if (typeof e === 'string') {
          dispatch({ type: SET_PROFILE_ERROR, profileError: e });
        } else if (e instanceof Error) {
          dispatch({ type: SET_PROFILE_ERROR, profileError: e.message });
        }
      })
      .finally(() => {
        dispatch({ type: SET_PROFILE_LOADING, profileLoading: false });
      });
  };
};
