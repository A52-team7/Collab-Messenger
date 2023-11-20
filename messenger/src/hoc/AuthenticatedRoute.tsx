import { useContext, ReactNode } from 'react';
import AppContext, {UserState} from '../context/AppContext';
import { Navigate, useLocation  } from 'react-router-dom';
import PropTypes from "prop-types";

interface RouteProps{
  children: ReactNode
}

const AuthenticatedRoute = ({ children } : RouteProps) => {
  const { user } = useContext<UserState>(AppContext);
  const location = useLocation();

  if (user === null) {
    return <Navigate to='/login' state={location.pathname} />;
  } 

  return children;
}

AuthenticatedRoute.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func
  ]).isRequired
}

export default AuthenticatedRoute;