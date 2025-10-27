import { db } from '../config/firebaseConfig';
import { collection, addDoc, serverTimestamp, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const notesCollectionRef = collection(db, 'notes');

export const addNote = async (userId, title, content) => {
  try {
    const userNotesCollectionRef = collection(db, 'users', userId, 'notes');
    const docRef = await addDoc(userNotesCollectionRef, {
      title: title || '제목 없음',
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

  export const updateNote = async (userId, noteId, newTitle, newContent) => {
    if (!userId || !noteId) return null;
    try {
      const noteDoc = doc(db, 'users', userId, 'notes', noteId);
      await updateDoc(noteDoc, {
        title: newTitle,
        content: newContent,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (e) {
      console.error("노트 수정 오류:", e);
      return false;
    }
  };

  export const deleteNote = async (userId, noteId) => {
    if (!userId || !noteId) return null;
    try {
      const noteDoc = doc(db, 'users', userId, 'notes', noteId);
      await deleteDoc(noteDoc);
      return true;
    } catch (e) {
      console.error("노트 삭제 오류:", e);
      return false;
    }
  };