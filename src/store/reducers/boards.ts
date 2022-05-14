import { AnyAction } from 'redux';

import { BoardSettings } from '../../models/BoardSettings.model';
import { Archive } from '../../models/Archive.model';

export const ACTION_START = 'ACTION_START';
export const ADD_BOARD = 'ADD_BOARD';
export const DELETE_BOARD = 'DELETE_BOARD';
export const FETCH_ARCHIVE = 'FETCH_ARCHIVE';
export const FETCH_BOARDS = 'FETCH_BOARDS';
export const SET_ACTIVE_BOARD = 'SET_ACTIVE_BOARD';
export const SET_ERROR = 'SET_ERROR';
export const SET_IS_LOADING = 'SET_IS_LOADING';
export const RESET_BOARDS = 'RESET_BOARDS';
export const UPDATE_ARCHIVE = 'UPDATE_ARCHIVE';
export const UPDATE_BOARD = 'UPDATE_BOARD';

type BoardState = {
  activeBoard: BoardSettings;
  activeBoardArchive: Archive[];
  boards: BoardSettings[];
  loading: boolean;
  error: string;
};

const initialState: BoardState = {
  activeBoard: {
    boardName: '',
    id: '',
    sharing: [],
    stages: [],
    todos: [],
    uid: ''
  },
  activeBoardArchive: [],
  boards: [],
  loading: false,
  error: ''
};

export default function boardReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case ACTION_START:
      return {
        ...state,
        error: action.start.error,
        loading: action.start.loading
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
    case FETCH_ARCHIVE:
      return {
        ...state,
        activeBoardArchive: [...action.archive]
      };
    case FETCH_BOARDS:
      return {
        ...state,
        boards: [...action.boards].sort((a, b) => a.boardName.localeCompare(b.boardName))
      };
    case SET_ACTIVE_BOARD:
      return {
        ...state,
        activeBoard: action.board
      };
    case RESET_BOARDS:
      return initialState;
    case SET_ERROR:
      return {
        ...state,
        error: action.error
      };
    case SET_IS_LOADING:
      return {
        ...state,
        loading: action.loading
      };
    case UPDATE_ARCHIVE: {
      return {
        ...state,
        activeBoardArchive: [
          ...state.activeBoardArchive.filter((a) => a.id !== action.archive.id),
          { ...state.activeBoardArchive.find((a) => a.id === action.archive.id), ...action.archive }
        ]
      };
    }
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
