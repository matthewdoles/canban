import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './reducers/boards';
import { AnyAction } from 'redux';
import { ThunkAction } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    boards: boardReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;
