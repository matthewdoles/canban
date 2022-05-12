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
import { archiveCol, boardsCol, firestore } from '../../firebase';
import { BoardSettings } from '../../models/BoardSettings.model';
import { Todo } from '../../models/Todo.model';
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

export function fetchArchivedTodos(boardId: string): AppThunk {
  return async (dispatch, getState) => {
    const { user } = getState();
    if (user.firebaseUser) {
      dispatch({ type: ACTION_START, start: { loading: true, error: '' } });
      const q = query(
        collection(firestore, 'archive'),
        where('boardId', '==', boardId),
        where('uid', '==', user.firebaseUser.uid)
      );
      getDocs(q)
        .then((archiveDocs) => {
          const archives: Archive[] = [];
          archiveDocs.forEach((archiveDoc) => {
            const a = archiveDoc.data();
            archives.push({
              id: archiveDoc.id,
              boardId: a.boardId,
              todos: a.todos,
              uid: a.uid
            });
          });
          dispatch({ type: FETCH_ARCHIVE, archive: archives });
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
    if (udpatedBoards[boardIndex].todos.length <= 100) {
      udpatedBoards[boardIndex].todos.push(todo);
      dispatch(updateBoardTodos(udpatedBoards[boardIndex]));
    }
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

export function addSharing(uid: string, boardId: string): AppThunk {
  return async (dispatch, getState) => {
    const { boards } = getState();
    const udpatedBoards = JSON.parse(JSON.stringify([...boards.boards]));
    const boardIndex = udpatedBoards.findIndex((b: BoardSettings) => b.id === boardId);
    if (udpatedBoards[boardIndex].sharing.filter((userId: string) => userId === uid).length === 0) {
      udpatedBoards[boardIndex].sharing.push(uid);
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
    if (udpatedBoards[boardIndex].sharing.filter((userId: string) => userId === uid).length === 1) {
      const shareIndex = udpatedBoards[boardIndex].sharing.findIndex(
        (userId: string) => userId === uid
      );
      udpatedBoards[boardIndex].sharing.splice(shareIndex, 1);
      dispatch(updateBoardSharing(udpatedBoards[boardIndex]));
    } else {
      dispatch({ type: SET_ERROR, error: 'Trouble removing user access.' });
    }
  };
}

export function archiveTodo(todo: Todo): AppThunk {
  return async (dispatch, getState) => {
    const { boards } = getState();
    if (boards.activeBoardArchive.length > 0) {
      const updatedArchive = JSON.parse(JSON.stringify([...boards.activeBoardArchive]));
      const arhciveIndex = updatedArchive.findIndex((a: Archive) => a.boardId === todo.boardId);
      if (updatedArchive[arhciveIndex].todos.length < 100) {
        updatedArchive[arhciveIndex].todos.push(todo);
        dispatch({ type: ACTION_START, start: { loading: true, error: '' } });
        const archiveDocRef = doc(archiveCol, updatedArchive[arhciveIndex].id);
        updateDoc(archiveDocRef, {
          todos: updatedArchive[arhciveIndex].todos
        })
          .then(() => {
            dispatch({ type: UPDATE_ARCHIVE, archive: updatedArchive[arhciveIndex] });
            dispatch(deleteTodo(todo));
          })
          .catch((err: FirebaseError) => {
            dispatch({ type: SET_ERROR, error: err.message });
          })
          .finally(() => {
            dispatch({ type: SET_IS_LOADING, loading: false });
          });
      } else {
        dispatch(createArchive(todo));
      }
    } else {
      dispatch(createArchive(todo));
    }
  };
}

function createArchive(todo: Todo): AppThunk {
  return async (dispatch, getState) => {
    const { user } = getState();
    dispatch({ type: ACTION_START, start: { loading: true, error: '' } });
    addDoc(collection(firestore, 'archive'), {
      boardId: todo.boardId,
      todos: [todo],
      uid: user.firebaseUser.uid
    })
      .then((docRef) => {
        dispatch({
          type: UPDATE_ARCHIVE,
          board: { boardId: todo.boardId, todos: [todo], id: docRef.id }
        });
        dispatch(deleteTodo(todo));
      })
      .catch((err: FirebaseError) => {
        dispatch({ type: SET_ERROR, error: err.message });
      })
      .finally(() => {
        dispatch({ type: SET_IS_LOADING, loading: false });
      });
  };
}

export function unarchiveTodo(todo: Todo): AppThunk {
  return async (dispatch, getState) => {
    const { boards } = getState();

    const updatedArchive = JSON.parse(JSON.stringify([...boards.activeBoardArchive]));
    const arhciveIndex = updatedArchive.findIndex((a: Archive) => a.boardId === todo.boardId);
    const todoIndex = updatedArchive[arhciveIndex].todos.findIndex((t: Todo) => t.id === todo.id);
    updatedArchive[arhciveIndex].todos.splice(todoIndex, 1);

    dispatch({ type: SET_IS_LOADING, loading: true });
    const archiveDocRef = doc(archiveCol, updatedArchive[arhciveIndex].id);
    updateDoc(archiveDocRef, {
      todos: updatedArchive[arhciveIndex].todos
    })
      .then(() => {
        dispatch({ type: UPDATE_ARCHIVE, archive: updatedArchive[arhciveIndex] });
        dispatch(createTodo(todo));
      })
      .catch((err: FirebaseError) => {
        dispatch({ type: SET_ERROR, error: err.message });
      })
      .finally(() => {
        dispatch({ type: SET_IS_LOADING, loading: false });
      });
  };
}
