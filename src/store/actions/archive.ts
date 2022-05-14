import { FirebaseError } from 'firebase/app';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { archiveCol, firestore } from '../../firebase';
import { Archive } from '../../models/Archive.model';
import { Todo } from '../../models/Todo.model';
import { AppThunk } from '../configureReducer';
import {
  ACTION_START,
  FETCH_ARCHIVE,
  SET_ERROR,
  SET_IS_LOADING,
  UPDATE_ARCHIVE
} from '../reducers/boards';
import { createTodo, deleteTodo } from './todos';

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
