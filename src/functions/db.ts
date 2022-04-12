import { doc, getDoc, getDocs, setDoc } from '@firebase/firestore';
import { boardsCol } from '../firebase';
import { BoardSettings } from '../models/BoardSettings';

export const getBoards = async () => {
  const boardDocs = await getDocs(boardsCol);
  const boardData: BoardSettings[] = [];
  boardDocs.docs.forEach((bookDoc) => {
    boardData.push({ ...bookDoc.data(), id: bookDoc.id });
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
  const boardRef = doc(boardsCol);
  setDoc(boardRef, board)
    .then(() => console.log('Success'))
    .catch((err) => console.log(err));
};
