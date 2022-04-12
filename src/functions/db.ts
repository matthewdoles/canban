import { getDocs } from '@firebase/firestore';
import { boardsCol } from '../firebase';
import { BoardSettings } from '../models/BoardSettings';

export const getBoards = async () => {
  const bookDocs = await getDocs(boardsCol);
  const boardData: BoardSettings[] = [];
  bookDocs.docs.forEach((bookDoc) => {
    boardData.push({ ...bookDoc.data(), id: bookDoc.id });
  });
  return boardData;
};
