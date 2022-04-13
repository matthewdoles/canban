import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc
} from '@firebase/firestore';

import { boardsCol, firestore } from '../firebase';
import { BoardSettings } from '../models/BoardSettings';
import { Todo } from '../models/Todo.model';

export const getBoards = async () => {
  const boardDocs = await getDocs(boardsCol);
  const boardData: BoardSettings[] = [];
  boardDocs.docs.forEach((boardDoc) => {
    boardData.push({ ...boardDoc.data(), id: boardDoc.id });
  });
  return boardData;
};

export const getBoard = async (id: string) => {
  const boardRef = doc(boardsCol, id);
  const boardDoc = await getDoc(boardRef);
  const boardData = boardDoc.data();
  if (boardData)
    return {
      id: boardDoc.id,
      boardName: boardData.boardName || '',
      stages: boardData.stages || []
    };
  return { id: '1', boardName: 'Empty', stages: [] };
};

export const createBoard = async (board: BoardSettings) => {
  let result;
  addDoc(collection(firestore, 'boards'), { boardName: board.boardName, stages: board.stages })
    .then((docRef) => {
      result = docRef.id;
    })
    .catch((err) => {
      throw err;
    });
  return result;
};

export const updateBoard = async (board: BoardSettings) => {
  const boardDocRef = doc(boardsCol, board.id);
  await updateDoc(boardDocRef, {
    boardName: board.boardName,
    stages: board.stages
  });
};

export const deleteBoard = async (board: BoardSettings) => {
  const boardDocRef = doc(boardsCol, board.id);
  await deleteDoc(boardDocRef);
};

export const createTodo = async (todo: Todo) => {
  let result;
  addDoc(collection(firestore, 'todos'), {
    boardId: todo.boardId,
    title: todo.title,
    stage: todo.stage,
    descrption: todo.description
  })
    .then((docRef) => {
      result = docRef.id;
    })
    .catch((err) => {
      throw err;
    });
  return result;
};
