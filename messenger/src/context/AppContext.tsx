import { createContext } from 'react';
import { User } from "firebase/auth";

export interface UserState {
  user: User | null,
  userData: UserData | null,
  setContext: React.Dispatch<React.SetStateAction<UserState>>,
}

export interface UserData {
  uid: string,
  handle: string,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  teams?: object | null,
  profilePhoto: string,
  channels?: { [key: string]: string } | null,
}

const AppContext = createContext<UserState>({
  user: null,
  userData: null,
  setContext: () => { }
});

export default AppContext;