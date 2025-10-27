import { db } from '../config/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const notesCollectionRef = collection(db, 'notes');

export const addNote = async (content) => {
  try {
    const docRef = await addDoc(notesCollectionRef, {
      title: '새 노트',
      content: content,
      createdAt: serverTimestamp(),
    });
    console.log('문서 ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error occured: ', e);
    return null;
  }
};