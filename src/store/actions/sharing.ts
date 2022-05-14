import { FirebaseError } from 'firebase/app';
import { doc, updateDoc } from 'firebase/firestore';
import { boardsCol } from '../../firebase';
import { BoardSettings } from '../../models/BoardSettings.model';
import { AppThunk } from '../configureReducer';
import { ACTION_START, SET_ERROR, SET_IS_LOADING, UPDATE_BOARD } from '../reducers/boards';

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
