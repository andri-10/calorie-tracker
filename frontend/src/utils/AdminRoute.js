import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getToken, clearToken } from './authUtils';

const AdminRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const tokenData = getToken();

      if (!tokenData) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      try {
        const { value, timestamp, expiresIn } = JSON.parse(tokenData);
        const now = new Date().getTime();

        if (now - timestamp > expiresIn) {
          clearToken();
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        const decodedToken = jwtDecode(value);
        setIsAuthorized(decodedToken.role === 'ADMIN');
      } catch (error) {
        console.error('Error verifying admin access:', error);
        clearToken();
        setIsAuthorized(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/404" replace />;
};

export default AdminRoute;
