import { Navigate } from 'react-router-dom';
import { getToken } from '../../utils/authUtils';

const PublicRoute = ({ element }) => {
  const token = getToken();
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

export default PublicRoute;