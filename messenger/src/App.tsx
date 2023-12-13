import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppContext, { UserState } from './context/AppContext';
import Body from './hoc/Body/Body';
import Home from './views/Home/Home';
import Register from './components/Register/Register';
import CreateTeam from './components/CreateTeam/CreateTeam';
import Login from './components/Login/Login';
import NoPageFound from './views/NoPageFound/NoPageFound';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebaseConfig';
import { getUserData } from './services/users.service';
import AuthenticatedRoute from './hoc/AuthenticatedRoute/AuthenticatedRoute';
import Chat from './components/Chat/Chat';
import NewChat from './components/NewChat/NewChat';
import UserDetails from './components/UserDetails/UserDetails';
import EditTeamInfo from './components/EditTeamInfo/EditTeamInfo';
import GroupVideoMain from './components/GroupVideoMain/GroupVideoMain';
import NewEvent from './components/NewEvent/NewEvent';
import MyCalendar from './components/MyCalendar/MyCalendar';

function App(): JSX.Element {
  const [userAuth, loading] = useAuthState(auth);
  const [appState, setAppState] = useState<UserState>({
    user: null,
    userData: null,
    loading: true,
    setContext: () => { },
  });

  if (appState.user !== userAuth) {
    setAppState((prevState: UserState) => ({
      ...prevState,
      user: userAuth || null,
    }));
  }

  useEffect(() => {
    if (userAuth === null || userAuth === undefined) {
      if (!loading) {
        setAppState(prevState => ({
          ...prevState,
          loading: false,
        }));
      }
      return;
    }

    getUserData(userAuth.uid)
      .then(snapshot => {
        if (!snapshot.exists()) {
          throw new Error('Something went wrong!');
        }

        setAppState(prevState => ({
          ...prevState,
          loading: false,
          userData: snapshot.val()[Object.keys(snapshot.val())[0]],
        }));
      })
      .catch(e => alert(e.message))
  }, [userAuth, loading]);

  return (
    <AppContext.Provider value={{ ...appState, setContext: setAppState }}>
      {!appState.loading && <Body>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={!appState.user && <Register />} />
          <Route path='/login' element={!appState.user && <Login />} />
          <Route path='/new-chat' element={<AuthenticatedRoute><NewChat /></AuthenticatedRoute>} />
          <Route path='/chat/:id' element={<AuthenticatedRoute><Chat /></AuthenticatedRoute>} />
          <Route path='/user-details' element={<AuthenticatedRoute><UserDetails /></AuthenticatedRoute>} />
          <Route path='/calendar' element={<AuthenticatedRoute><MyCalendar /></AuthenticatedRoute>} />
          <Route path='/video' element={<AuthenticatedRoute><GroupVideoMain /></AuthenticatedRoute>} />
          {/* <Route path='/search' element={<AuthenticatedRoute><SearchPage /></AuthenticatedRoute>} /> */}
          <Route path='/new-team' element={<AuthenticatedRoute><CreateTeam /></AuthenticatedRoute>} />
          <Route path='/edit-team-information' element={<AuthenticatedRoute><EditTeamInfo /></AuthenticatedRoute>} />
          <Route path='/new-event' element={<AuthenticatedRoute><NewEvent /></AuthenticatedRoute>} />
          <Route path='*' element={<NoPageFound />} />
        </Routes>
      </Body>}
    </AppContext.Provider>
  );
}

export default App
