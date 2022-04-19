import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './reducers/boards';
import { AnyAction } from 'redux';
import { ThunkAction } from '@reduxjs/toolkit';
import userReducer from './reducers/user';

export const store = configureStore({
  reducer: {
    boards: boardReducer,
    user: userReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;
