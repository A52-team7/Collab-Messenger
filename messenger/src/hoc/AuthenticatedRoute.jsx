import { useContext } from 'react';
import AppContext from '../context/AppContext';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";

const AuthenticatedRoute = ({ children }) => {
  const { user, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (user === null) {
    return <Navigate to='/login' path={location.pathname} />;
  } else if (userData.isBlocked) navigate('/');

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