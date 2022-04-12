import { initializeApp } from 'firebase/app';
import { getFirestore, CollectionReference, collection, DocumentData } from 'firebase/firestore';

import { BoardSettings } from './models/BoardSettings';

export const firebaseApp = initializeApp({
  apiKey: 'AIzaSyA1jeIw0sjswanLHTK3q1riIGBXuufXBlM',
  authDomain: 'canban-185c8.firebaseapp.com',
  projectId: 'canban-185c8',
  storageBucket: 'canban-185c8.appspot.com',
  messagingSenderId: '931369585473',
  appId: '1:931369585473:web:44e91b6c9d65bf2093efc0',
  measurementId: 'G-8R6HB0YRBS'
});

export const firestore = getFirestore();

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

// export all your collections
export const boardsCol = createCollection<BoardSettings>('boards');