import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppContext, {UserState} from './context/AppContext';
import Body from './hoc/Body/Body';
// import CreateAccount from './view/CreateAccount/CreateAccount';
// import Login from './view/Login/Login';
//import AuthenticatedRoute from './hoc/AuthenticatedRoute';
import Home from './views/Home/Home';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebaseConfig';
import { getUserData } from './services/users.service';
// import UserDetails from './view/UserDetails/UserDetails';
// import NoPageFound from './view/NoPageFound/NoPageFound';

function App(): JSX.Element {
  // loading, error
  const [user] = useAuthState(auth);
  // this hook will check storage for user credentials (eventually stored during user login with firebase functions) and retrieve the actual authentication state (user will either be null or the user object from the last persisted login)
  // the loading status will be true while the hooks retrieves the status of the user and will be set to false when the user has been retrieved (object or null)
  // the error will be set only when specific problem with the auth state is detected
  const [appState, setAppState] = useState<UserState>({
    user: null,
    userData: null,
    setContext: ()=> {},
  });

  // update the user in the app state to match the one retrieved from the hook above
  if (appState.user !== user) {
    setAppState((prevState: UserState) => ({
      ...prevState,
      user: user || null,
    }));
  }

  // finally retrieve user data if the user is logged (this is also broken and will be fixed in a bit)
  useEffect(() => {
    if (user === null || user === undefined) return;

    getUserData(user.uid)
      .then(snapshot => {
        if (!snapshot.exists()) {
          throw new Error('Something went wrong!');
        }

        setAppState({
          ...appState,
          userData: snapshot.val()[Object.keys(snapshot.val())[0]]
        });
      })
      .catch(e => alert(e.message));
  }, [appState, user]);

  return (
    <AppContext.Provider value={{ ...appState, setContext: setAppState }}>
      <Body>
        <Routes>
          <Route path='/' element={<Home />} />
          {/* <Route path='/user-details' element={<AuthenticatedRoute><UserDetails /></AuthenticatedRoute>} /> */}
          {/* <Route path='/register' element={!appState.user && <CreateAccount />} /> */}
          {/* <Route path='/login' element={!appState.user && <Login />} /> */}
          {/* <Route path='/search' element={<AuthenticatedRoute><SearchPage /></AuthenticatedRoute>} /> */}
          {/* <Route path='*' element={<NoPageFound />} /> */}
        </Routes>
      </Body>
    </AppContext.Provider>
  );
}

export default App
