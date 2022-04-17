import { AnyAction } from 'redux';
import { getTodos } from '../../functions/db';
import { AppThunk } from '../configureReducer';
import { Todo } from '../../models/Todo.model';

export const FETCH_TODOS = 'FETCH_TODOS';

type TodoState = {
  todos: Todo[];
};

const initialState: TodoState = {
  todos: []
};

export default function todoReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case FETCH_TODOS:
      return {
        ...state,
        todos: [...action.todos]
      };
    default:
      return { ...state };
  }
}

export function fetchTodos(boardIds: string[]): AppThunk {
  return async (dispatch) => {
    const todos: Todo[] = await getTodos(boardIds);
    dispatch({ type: FETCH_TODOS, todos });
  };
}
