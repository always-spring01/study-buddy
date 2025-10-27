import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut
  } from "firebase/auth";
  import app from '../config/firebaseConfig';
  
  const auth = getAuth(app);
  
  export const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error occured: ", error);
      return null;
    }
  };
  
  export const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error occured: ", error);
      return null;
    }
  };
  
  export const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error occured: ", error);
    }
  };