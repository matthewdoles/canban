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
import { boardsCol, firestore, todosCol } from '../../firebase';
import { BoardSettings } from '../../models/BoardSettings.model';
import { Todo } from '../../models/Todo.model';

export const ACTION_START = 'ACTION_START';
export const ADD_BOARD = 'ADD_BOARD';
export const DELETE_BOARD = 'DELETE_BOARD';
export const FETCH_BOARDS = 'FETCH_BOARDS';
export const FETCH_TODOS = 'FETCH_TODOS';
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
      uid: user.firebaseUser.uid
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
              uid: b.uid
            });
          });
          dispatch(fetchTodos(boardData));
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

export function updateBoard(board: BoardSettings): AppThunk {
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

export function createTodo(todo: Todo): AppThunk {
  return async (dispatch, getState) => {
    const { boards } = getState();
    dispatch({ type: ACTION_START, start: { loading: true, error: '' } });
    addDoc(collection(firestore, 'todos'), todo)
      .then((docRef) => {
        const udpatedBoards = JSON.parse(JSON.stringify([...boards.boards]));
        const boardIndex = udpatedBoards.findIndex((b: BoardSettings) => b.id === todo.boardId);
        udpatedBoards[boardIndex].todos.push({ id: docRef.id, ...todo });
        dispatch({ type: UPDATE_BOARD, board: udpatedBoards[boardIndex] });
      })
      .catch((err: FirebaseError) => {
        dispatch({ type: SET_ERROR, error: err.message });
      })
      .finally(() => {
        dispatch({ type: SET_IS_LOADING, loading: false });
      });
  };
}

export function fetchTodos(boards: BoardSettings[]): AppThunk {
  return async (dispatch) => {
    const boardIds = boards.map((board) => {
      if (board.id) return board.id;
      return '';
    });

    const q = query(collection(firestore, 'todos'), where('boardId', 'in', boardIds));
    getDocs(q)
      .then((todoDocs) => {
        const todoData: Todo[] = [];
        todoDocs.forEach((todoDoc) => {
          const t = todoDoc.data();
          todoData.push({
            boardId: t.boardId,
            comments: t.comments,
            title: t.title,
            description: t.description,
            id: todoDoc.id,
            stage: t.stage
          });
        });
        const updatedBoards = [...boards];
        updatedBoards.forEach((board) => {
          board.todos = [...todoData.filter((t: Todo) => t.boardId === board.id)];
        });
        dispatch({ type: FETCH_BOARDS, boards: updatedBoards });
      })
      .catch((err: FirebaseError) => {
        dispatch({ type: SET_ERROR, error: err.message });
      })
      .finally(() => {
        dispatch({ type: SET_IS_LOADING, loading: false });
      });
  };
}

export function deleteTodo(todo: Todo): AppThunk {
  return async (dispatch, getState) => {
    const { boards } = getState();
    dispatch({ type: ACTION_START, start: { loading: true, error: '' } });
    const todoDocRef = doc(todosCol, todo.id);
    deleteDoc(todoDocRef)
      .then(() => {
        const udpatedBoards = JSON.parse(JSON.stringify([...boards.boards]));
        const boardIndex = udpatedBoards.findIndex((b: BoardSettings) => b.id === todo.boardId);
        const todoIndex = udpatedBoards[boardIndex].todos.findIndex((t: Todo) => t.id === todo.id);
        udpatedBoards[boardIndex].todos.splice(todoIndex, 1);
        dispatch({ type: UPDATE_BOARD, board: udpatedBoards[boardIndex] });
      })
      .catch((err: FirebaseError) => {
        dispatch({ type: SET_ERROR, error: err.message });
      })
      .finally(() => {
        dispatch({ type: SET_IS_LOADING, loading: false });
      });
  };
}

export function updateTodo(todo: Todo): AppThunk {
  return async (dispatch, getState) => {
    const { boards } = getState();
    dispatch({ type: ACTION_START, start: { loading: true, error: '' } });
    const updatedTodo = {
      comments: todo.comments,
      title: todo.title,
      description: todo.description,
      stage: todo.stage
    };

    const todoDocRef = doc(todosCol, todo.id);
    updateDoc(todoDocRef, {
      ...updatedTodo
    })
      .then(() => {
        const udpatedBoards = JSON.parse(JSON.stringify([...boards.boards]));
        const boardIndex = udpatedBoards.findIndex((b: BoardSettings) => b.id === todo.boardId);
        const todoIndex = udpatedBoards[boardIndex].todos.findIndex((t: Todo) => t.id === todo.id);
        udpatedBoards[boardIndex].todos[todoIndex] = {
          ...udpatedBoards[boardIndex].todos[todoIndex],
          ...updatedTodo
        };
        dispatch({ type: UPDATE_BOARD, board: udpatedBoards[boardIndex] });
      })
      .catch((err: FirebaseError) => {
        dispatch({ type: SET_ERROR, error: err.message });
      })
      .finally(() => {
        dispatch({ type: SET_IS_LOADING, loading: false });
      });
  };
}
