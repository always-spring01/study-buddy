import { db } from '../config/firebaseConfig';
import { collection, addDoc, serverTimestamp, getDocs, doc, getDoc } from 'firebase/firestore';

const notesCollectionRef = collection(db, 'notes');

export const addNote = async (userId, content) => {
  try {
    const userNotesCollectionRef = collection(db, 'users', userId, 'notes');
    const docRef = await addDoc(userNotesCollectionRef, {
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

export const getNotes = async (userId) => {
    if (!userId) return [];
    try {
        const userNotesCollectionRef = collection(db, 'users', userId, 'notes');
        const data = await getDocs(userNotesCollectionRef);
      const notes = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      return notes;
    } catch (e) {
      console.error('Error occured: ', e);
      return [];
    }
  };

  export const getNoteById = async (userId, noteId) => {
    if (!userId) return null;
    try {
      const noteDoc = doc(db, 'users', userId, 'notes', noteId);
      const docSnap = await getDoc(noteDoc);
  
      if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id };
      } else {
        console.log('Note not found!');
        return null;
      }
    } catch (e) {
      console.error('Error occured: ', e);
      return null;
    }
  };