import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { checkTokenValidity } from './components/utils/tokenUtils';

import Login from './components/Login/login';
import Reset from './components/Login/reset';
import Register from './components/Register/register';
import LandingPage from './components/LandingPage/LandingPage';
import Dashboard from './components/Dashboard/Dashboard';
import AddFoodEntry from './components/Dashboard/AddFoodEntry';
import History from './components/Dashboard/History';
import AdminDashboard from './components/Admin/AdminDashboard';
import NotFoundPage from './components/NotFoundPage';
import AdminRoute from './components/utils/AdminRoute';

const ProtectedRoute = ({ element }) => {
  const location = useLocation();
  const isAuthenticated = checkTokenValidity();

  if (!isAuthenticated) {
    localStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/login" replace />;
  }

  return element;
};

const publicRoutes = ['/', '/login', '/register', '/reset', '/404'];

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = checkTokenValidity();
      
      if (isAuthenticated) {
        if (publicRoutes.includes(location.pathname)) {
          navigate('/dashboard');
        }
      } else {
        if (!publicRoutes.includes(location.pathname)) {
          localStorage.setItem('redirectPath', location.pathname);
          navigate('/login');
        }
      }
      setIsInitialized(true);
    };

    checkAuth();
  }, [location, navigate]);

  if (!isInitialized) {
    return null;
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/404" element={<NotFoundPage />} />

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute element={<Dashboard />} />
        } />
        <Route path="/dashboard/add-food" element={
          <ProtectedRoute element={<AddFoodEntry />} />
        } />
        <Route path="/dashboard/history" element={
          <ProtectedRoute element={<History />} />
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  );
}

export default App;