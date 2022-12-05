import { AnyAction } from 'redux';

import { AppThunk } from '../configureReducer';
import { supabase } from '../../supabaseClient';
import { Stage } from '../../models/Stage.model';
import { BoardSettings } from '../../models/BoardSettings.model';

export const ACTION_START = 'ACTION_START';
export const ADD_BOARD = 'ADD_BOARD';
export const DELETE_BOARD = 'DELETE_BOARD';
export const FETCH_BOARDS = 'FETCH_BOARDS';
export const SET_ERROR = 'SET_ERROR';
export const SET_IS_LOADING = 'SET_IS_LOADING';
export const RESET_BOARDS = 'RESET_BOARDS';
export const UPDATE_BOARD = 'UPDATE_BOARD';

type BoardState = {
  boards: BoardSettings[];
  boardsLoading: boolean;
  boardsError: string;
};

const initialState: BoardState = {
  boards: [],
  boardsLoading: false,
  boardsError: ''
};

export default function boardReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case ACTION_START:
      return {
        ...state,
        boardsError: action.start.error,
        boardsLoading: action.start.loading
      };
    case ADD_BOARD:
      return {
        ...state,
        boards: [...state.boards, action.board].sort((a, b) =>
          a.boardName.localeCompare(b.boardName)
        )
      };
    case DELETE_BOARD:
      return {
        ...state,
        boards: [...state.boards.filter((b) => b.id !== action.boardId)]
      };
    case FETCH_BOARDS:
      return {
        ...state,
        boards: [...action.boards].sort((a, b) => a.boardName.localeCompare(b.boardName))
      };
    case RESET_BOARDS:
      return initialState;
    case SET_ERROR:
      return {
        ...state,
        boardsError: action.error
      };
    case SET_IS_LOADING:
      return {
        ...state,
        boardsLoading: action.loading
      };
    case UPDATE_BOARD: {
      return {
        ...state,
        boards: [
          ...state.boards.filter((b) => b.id !== action.board.id),
          { ...state.boards.find((b) => b.id === action.board.id), ...action.board }
        ].sort((a, b) => a.boardName.localeCompare(b.boardName)),
        activeBoard: action.board
      };
    }
    default:
      return { ...state };
  }
}

export function submitBoard(boardName: string, stages: Stage[]): AppThunk {
  return async (dispatch, getState) => {
    const { profile } = getState();
    dispatch({ type: ACTION_START, start: { boardsLoading: true, boardsError: '' } });
    try {
      const { data, error } = await supabase
        .from('boards')
        .insert({
          boardName,
          stages,
          uid: profile.profile.id,
          todos: []
        })
        .select();
      if (error) {
        dispatch({ type: SET_ERROR, boardsError: error.message });
      }
      if (data) {
        dispatch({
          type: ADD_BOARD,
          board: data[0]
        });
      }
    } catch (e: unknown) {
      if (typeof e === 'string') {
        dispatch({ type: SET_ERROR, boardsError: e });
      } else if (e instanceof Error) {
        dispatch({ type: SET_ERROR, boardsError: e.message });
      }
    } finally {
      dispatch({ type: SET_IS_LOADING, boardsLoading: false });
    }
  };
}

export function deleteBoard(id: number): AppThunk {
  return async (dispatch) => {
    try {
      const { error } = await supabase.from('boards').delete().match({ id });
      if (error) {
        dispatch({ type: SET_ERROR, boardsError: error.message });
      }
      if (!error) {
        dispatch({ type: DELETE_BOARD, boardId: id });
      }
    } catch (e: unknown) {
      if (typeof e === 'string') {
        dispatch({ type: SET_ERROR, boardsError: e });
      } else if (e instanceof Error) {
        dispatch({ type: SET_ERROR, boardsError: e.message });
      }
    } finally {
      dispatch({ type: SET_IS_LOADING, boardsLoading: false });
    }
  };
}

export function fetchBoards(): AppThunk {
  return async (dispatch) => {
    try {
      const { data, error } = await supabase.from('boards').select().order('id');
      if (error) {
        dispatch({ type: SET_ERROR, boardsError: error.message });
      }
      if (data) {
        dispatch({ type: FETCH_BOARDS, boards: data });
      }
    } catch (e: unknown) {
      if (typeof e === 'string') {
        dispatch({ type: SET_ERROR, boardsError: e });
      } else if (e instanceof Error) {
        dispatch({ type: SET_ERROR, boardsError: e.message });
      }
    } finally {
      dispatch({ type: SET_IS_LOADING, boardsLoading: false });
    }
  };
}
