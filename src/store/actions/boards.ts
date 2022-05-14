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
import { boardsCol, firestore } from '../../firebase';
import { BoardSettings } from '../../models/BoardSettings.model';
import { AppThunk } from '../configureReducer';
import {
  ACTION_START,
  ADD_BOARD,
  DELETE_BOARD,
  FETCH_BOARDS,
  SET_ERROR,
  SET_IS_LOADING,
  UPDATE_BOARD
} from '../reducers/boards';

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
