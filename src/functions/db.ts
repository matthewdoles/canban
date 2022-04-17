import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where
} from '@firebase/firestore';

import { boardsCol, firestore, todosCol } from '../firebase';
import { Todo } from '../models/Todo.model';

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

export const getTodos = async (boardIds: string[]) => {
  const q = query(collection(firestore, 'todos'), where('boardId', 'in', boardIds));

  const todoDocs = await getDocs(q);
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
  return todoData;
};

export const createTodo = async (todo: Todo) => {
  let result;
  addDoc(collection(firestore, 'todos'), {
    boardId: todo.boardId,
    comments: [],
    title: todo.title,
    stage: todo.stage,
    description: todo.description
  })
    .then((docRef) => {
      result = docRef.id;
    })
    .catch((err) => {
      throw err;
    });
  return result;
};

export const updateTodo = async (todo: Todo) => {
  const todoDocRef = doc(todosCol, todo.id);
  await updateDoc(todoDocRef, {
    comments: todo.comments,
    description: todo.description,
    stage: todo.stage,
    title: todo.title
  });
};

export const deleteTodo = async (todo: Todo) => {
  const todoDocRef = doc(todosCol, todo.id);
  await deleteDoc(todoDocRef);
};
