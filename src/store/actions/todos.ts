import { FirebaseError } from 'firebase/app';
import { doc, updateDoc } from 'firebase/firestore';
import { boardsCol } from '../../firebase';
import { BoardSettings } from '../../models/BoardSettings.model';
import { Todo } from '../../models/Todo.model';
import { AppThunk } from '../configureReducer';
import { ACTION_START, SET_ERROR, SET_IS_LOADING, UPDATE_BOARD } from '../reducers/boards';

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
