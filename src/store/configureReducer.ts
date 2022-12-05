import { configureStore } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { ThunkAction } from '@reduxjs/toolkit';
import profileReducer from './reducers/profile';

export const store = configureStore({
  reducer: {
    profile: profileReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;
