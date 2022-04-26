import { AnyAction } from 'redux';
import { FirebaseError } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore';

import { AppThunk } from '../configureReducer';
import { boardsCol, firestore } from '../../firebase';
import { BoardSettings } from '../../models/BoardSettings.model';
import { Todo } from '../../models/Todo.model';
import { BoardSharing } from '../../models/BoardSharing.model';

export const ACTION_START = 'ACTION_START';
export const ADD_BOARD = 'ADD_BOARD';
export const DELETE_BOARD = 'DELETE_BOARD';
export const FETCH_BOARDS = 'FETCH_BOARDS';
export const SET_ACTIVE_BOARD = 'SET_ACTIVE_BOARD';
export const SET_ERROR = 'SET_ERROR';
export const SET_IS_LOADING = 'SET_IS_LOADING';
export const UPDATE_BOARD = 'UPDATE_BOARD';

type BoardState = {
  activeBoard: BoardSettings;
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
        boards: [...state.boards, action.board]
      };
    case DELETE_BOARD:
      return {
        ...state,
        boards: [...state.boards.filter((b) => b.id !== action.boardId)]
      };
    case FETCH_BOARDS:
      return {
        ...state,
        boards: [...action.boards]
      };
    case SET_ACTIVE_BOARD:
      return {
        ...state,
        activeBoard: action.board
      };
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
    case UPDATE_BOARD: {
      return {
        ...state,
        boards: [
          ...state.boards.filter((b) => b.id !== action.board.id),
          { ...state.boards.find((b) => b.id === action.board.id), ...action.board }
        ],
        activeBoard: action.board
      };
    }
    default:
      return { ...state };
  }
}

export function createBoard(board: BoardSettings): AppThunk {
  return async (dispatch, getState) => {
    const { user } = getState();
    dispatch({ type: ACTION_START, start: { loading: true, error: '' } });
    addDoc(collection(firestore, 'boards'), {
      boardName: board.boardName,
      stages: board.stages,
      uid: user.firebaseUser.uid,
      todos: [],
      sharing: []
    })
      .then((docRef) => {
        dispatch({ type: ADD_BOARD, board: { ...board, todos: [], id: docRef.id } });
      })
      .catch((err: FirebaseError) => {
        dispatch({ type: SET_ERROR, error: err.message });
      })
      .finally(() => {
        dispatch({ type: SET_IS_LOADING, loading: false });
      });
  };
}

export function deleteBoard(board: BoardSettings): AppThunk {
  return async (dispatch) => {
    dispatch({ type: ACTION_START, start: { loading: true, error: '' } });
    const boardDocRef = doc(boardsCol, board.id);
    deleteDoc(boardDocRef)
      .then(() => {
        dispatch({ type: DELETE_BOARD, boardId: board.id });
      })
      .catch((err: FirebaseError) => {
        dispatch({ type: SET_ERROR, error: err.message });
      })
      .finally(() => {
        dispatch({ type: SET_IS_LOADING, loading: false });
      });
  };
}

export function fetchBoards(): AppThunk {
  return async (dispatch, getState) => {
    const { user } = getState();
    if (user.firebaseUser) {
      dispatch({ type: ACTION_START, start: { loading: true, error: '' } });
      const q = query(collection(firestore, 'boards'), where('uid', '==', user.firebaseUser.uid));
      getDocs(q)
        .then((boardDocs) => {
          const boardData: BoardSettings[] = [];
          boardDocs.forEach((boardDoc) => {
            const b = boardDoc.data();
            boardData.push({
              boardName: b.boardName,
              stages: b.stages,
              id: boardDoc.id,
              uid: b.uid,
              todos: b.todos,
              sharing: b.sharing
            });
          });
          dispatch({ type: FETCH_BOARDS, boards: boardData });
        })
        .catch((err: FirebaseError) => {
          dispatch({ type: SET_ERROR, error: err.message });
        })
        .finally(() => {
          dispatch({ type: SET_IS_LOADING, loading: false });
        });
    }
  };
}

export function updateBoardSettings(board: BoardSettings): AppThunk {
  return async (dispatch) => {
    dispatch({ type: ACTION_START, start: { loading: true, error: '' } });
    const boardDocRef = doc(boardsCol, board.id);
    updateDoc(boardDocRef, {
      boardName: board.boardName,
      stages: board.stages
    })
      .then(() => {
        dispatch({ type: UPDATE_BOARD, board });
      })
      .catch((err: FirebaseError) => {
        dispatch({ type: SET_ERROR, error: err.message });
      })
      .finally(() => {
        dispatch({ type: SET_IS_LOADING, loading: false });
      });
  };
}

export function updateBoardTodos(board: BoardSettings): AppThunk {
  return async (dispatch) => {
    dispatch({ type: ACTION_START, start: { loading: true, error: '' } });
    const boardDocRef = doc(boardsCol, board.id);
    updateDoc(boardDocRef, {
      todos: board.todos
    })
      .then(() => {
        dispatch({ type: UPDATE_BOARD, board });
      })
      .catch((err: FirebaseError) => {
        dispatch({ type: SET_ERROR, error: err.message });
      })
      .finally(() => {
        dispatch({ type: SET_IS_LOADING, loading: false });
      });
  };
}

export function updateBoardSharing(board: BoardSettings): AppThunk {
  return async (dispatch) => {
    dispatch({ type: ACTION_START, start: { loading: true, error: '' } });
    const boardDocRef = doc(boardsCol, board.id);
    updateDoc(boardDocRef, {
      sharing: board.sharing
    })
      .then(() => {
        dispatch({ type: UPDATE_BOARD, board });
      })
      .catch((err: FirebaseError) => {
        dispatch({ type: SET_ERROR, error: err.message });
      })
      .finally(() => {
        dispatch({ type: SET_IS_LOADING, loading: false });
      });
  };
}

export function createTodo(todo: Todo): AppThunk {
  return async (dispatch, getState) => {
    const { boards } = getState();
    const udpatedBoards = JSON.parse(JSON.stringify([...boards.boards]));
    const boardIndex = udpatedBoards.findIndex((b: BoardSettings) => b.id === todo.boardId);
    udpatedBoards[boardIndex].todos.push(todo);
    dispatch(updateBoardTodos(udpatedBoards[boardIndex]));
  };
}

export function deleteTodo(todo: Todo): AppThunk {
  return async (dispatch, getState) => {
    const { boards } = getState();
    const udpatedBoards = JSON.parse(JSON.stringify([...boards.boards]));
    const boardIndex = udpatedBoards.findIndex((b: BoardSettings) => b.id === todo.boardId);
    const todoIndex = udpatedBoards[boardIndex].todos.findIndex((t: Todo) => t.id === todo.id);
    udpatedBoards[boardIndex].todos.splice(todoIndex, 1);
    dispatch(updateBoardTodos(udpatedBoards[boardIndex]));
  };
}

export function updateTodo(todo: Todo): AppThunk {
  return async (dispatch, getState) => {
    const { boards } = getState();
    const updatedTodo = {
      comments: todo.comments,
      title: todo.title,
      description: todo.description,
      stage: todo.stage
    };
    const udpatedBoards = JSON.parse(JSON.stringify([...boards.boards]));
    const boardIndex = udpatedBoards.findIndex((b: BoardSettings) => b.id === todo.boardId);
    const todoIndex = udpatedBoards[boardIndex].todos.findIndex((t: Todo) => t.id === todo.id);
    udpatedBoards[boardIndex].todos[todoIndex] = {
      ...udpatedBoards[boardIndex].todos[todoIndex],
      ...updatedTodo
    };
    dispatch(updateBoardTodos(udpatedBoards[boardIndex]));
  };
}

export function addSharing(share: BoardSharing, boardId: string): AppThunk {
  return async (dispatch, getState) => {
    const { boards } = getState();
    const udpatedBoards = JSON.parse(JSON.stringify([...boards.boards]));
    const boardIndex = udpatedBoards.findIndex((b: BoardSettings) => b.id === boardId);
    if (
      udpatedBoards[boardIndex].sharing.filter((s: BoardSharing) => s.uid === share.uid).length ===
      0
    ) {
      udpatedBoards[boardIndex].sharing.push(share);
      dispatch(updateBoardSharing(udpatedBoards[boardIndex]));
    } else {
      dispatch({ type: SET_ERROR, error: 'User already has access.' });
    }
  };
}

export function deleteSharing(uid: string, boardId: string): AppThunk {
  return async (dispatch, getState) => {
    const { boards } = getState();
    const udpatedBoards = JSON.parse(JSON.stringify([...boards.boards]));
    const boardIndex = udpatedBoards.findIndex((b: BoardSettings) => b.id === boardId);
    if (udpatedBoards[boardIndex].sharing.filter((s: BoardSharing) => s.uid === uid).length === 1) {
      const shareIndex = udpatedBoards[boardIndex].sharing.findIndex(
        (s: BoardSharing) => s.uid === uid
      );
      udpatedBoards[boardIndex].sharing.splice(shareIndex, 1);
      dispatch(updateBoardSharing(udpatedBoards[boardIndex]));
    } else {
      dispatch({ type: SET_ERROR, error: 'User already has access.' });
    }
  };
}
