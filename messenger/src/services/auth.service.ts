import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { User } from 'firebase/auth';

export const registerUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};

export const updateUserPassword = (newPassword: string) => {
  const user: User | null = auth.currentUser;
  if (user !== null) return updatePassword(user, newPassword);
};