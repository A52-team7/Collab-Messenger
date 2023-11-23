import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppContext, { UserState } from './context/AppContext';
import Body from './hoc/Body/Body';
import Home from './views/Home/Home';
import Register from './components/Register/Register';
import Team from './components/Team/Team';
import Login from './components/Login/Login';
import NoPageFound from './views/NoPageFound/NoPageFound';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebaseConfig';
import { getUserData } from './services/users.service';
import AuthenticatedRoute from './hoc/AuthenticatedRoute/AuthenticatedRoute';
import CreateNewChat from './components/CreateNewChat/CreateNewChat';
import Chat from './components/Chat/Chat';
// import UserDetails from './view/UserDetails/UserDetails';

function App(): JSX.Element {
  // loading, error
  const [userAuth] = useAuthState(auth);
  // this hook will check storage for user credentials (eventually stored during user login with firebase functions) and retrieve the actual authentication state (user will either be null or the user object from the last persisted login)
  // the loading status will be true while the hooks retrieves the status of the user and will be set to false when the user has been retrieved (object or null)
  // the error will be set only when specific problem with the auth state is detected
  const [appState, setAppState] = useState<UserState>({
    user: null,
    userData: null,
    setContext: () => { },
  });

  console.log('THIS IS APP.TSX AND I HAVE RERENDERED!!!');

  // update the user in the app state to match the one retrieved from the hook above
  if (appState.user !== userAuth) {
    setAppState((prevState: UserState) => ({
      ...prevState,
      user: userAuth || null,
    }));
  }

  // finally retrieve user data if the user is logged (this is also broken and will be fixed in a bit)
  useEffect(() => {
    if (userAuth === null || userAuth === undefined) return;

    getUserData(userAuth.uid)
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
  }, [userAuth]);

  return (
    <AppContext.Provider value={{ ...appState, setContext: setAppState }}>
      <Body>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={!appState.user && <Register />} />
          <Route path='/login' element={!appState.user && <Login />} />
          <Route path='/create-new-chat' element={<AuthenticatedRoute><CreateNewChat /></AuthenticatedRoute>} />
          <Route path='/chat' element={<AuthenticatedRoute><Chat /></AuthenticatedRoute>} />
          {/* <Route path='/user-details' element={<AuthenticatedRoute><UserDetails /></AuthenticatedRoute>} /> */}
          {/* <Route path='/search' element={<AuthenticatedRoute><SearchPage /></AuthenticatedRoute>} /> */}
          <Route path='/new-team' element={<AuthenticatedRoute><Team /></AuthenticatedRoute>} />
          <Route path='/edit-team-information' element={<AuthenticatedRoute><Team /></AuthenticatedRoute>} />
          <Route path='/add-remove-members' element={<AuthenticatedRoute><Team /></AuthenticatedRoute>} />
          <Route path='*' element={<NoPageFound />} />
        </Routes>
      </Body>
    </AppContext.Provider>
  );
}

export default App
