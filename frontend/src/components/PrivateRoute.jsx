import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ element: Element, requiredRole = null }) => {
  const token = localStorage.getItem('jwtToken');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    
    if (requiredRole) {
      const userRole = decoded.role;
      if (!userRole || userRole !== requiredRole) {
        return <Navigate to="/dashboard" />;
      }
    }
    
    return Element;
  } catch (error) {
    localStorage.removeItem('jwtToken');
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;