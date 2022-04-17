import { AnyAction } from 'redux';
import { BoardSettings } from '../../models/BoardSettings';
import { getBoards } from '../../functions/db';
import { AppThunk } from '../configureReducer';
import { fetchTodos } from './todos';

export const FETCH_BOARDS = 'FETCH_BOARDS';

type BoardState = {
  boards: BoardSettings[];
};

const initialState: BoardState = {
  boards: []
};

export default function boardReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case FETCH_BOARDS:
      return {
        ...state,
        boards: [...action.boards]
      };
    default:
      return { ...state };
  }
}

export function fetchBoards(): AppThunk {
  return async (dispatch) => {
    const boards: BoardSettings[] = await getBoards();
    const boardIds = boards.map((board) => {
      if (board.id) return board.id;
      return '';
    });
    dispatch(fetchTodos(boardIds));
    dispatch({ type: FETCH_BOARDS, boards });
  };
}
