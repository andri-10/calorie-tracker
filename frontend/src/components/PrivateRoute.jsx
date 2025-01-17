import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/authUtils';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ element, requiredRole }) => {
  const token = getToken();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    try {
      const decoded = jwtDecode(token);

      if (!decoded.role || decoded.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
      }
    } catch (error) {
      console.error('Token decoding failed:', error);
      return <Navigate to="/login" replace />;
    }
  }

  return element;
};

export default PrivateRoute;
