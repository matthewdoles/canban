import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './reducers/boards';
import { AnyAction } from 'redux';
import { ThunkAction } from '@reduxjs/toolkit';
import todoReducer from './reducers/todos';

export const store = configureStore({
  reducer: {
    boards: boardReducer,
    todos: todoReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;
