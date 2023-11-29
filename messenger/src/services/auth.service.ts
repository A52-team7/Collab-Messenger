import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  UserCredential
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export const registerUser = (email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password)
    .catch((err: string) => { throw err });
};

export const loginUser = (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password)
    .catch((err: string) => { throw err });
};

export const logoutUser = (): Promise<void> => {
  if (!auth.currentUser) {
    return Promise.resolve();
  }
  return signOut(auth);
};

export const updateUserPassword = (newPassword: string): Promise<void> => {
  const user = auth.currentUser;
  console.log(user);

  if (!user) {
    return Promise.reject(new Error('No authenticated user'));
  }
  return updatePassword(user, newPassword);
}