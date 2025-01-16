import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login/login';
import Reset from './components/Login/reset';
import Register from './components/Register/register';
import LandingPage from './components/LandingPage/LandingPage';
import Dashboard from './components/Dashboard/Dashboard';
import AddFoodEntry from './components/Dashboard/AddFoodEntry';
import History from './components/Dashboard/History';
import AdminDashboard from './components/Admin/AdminDashboard';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<Reset />} />

        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={<PrivateRoute element={<Dashboard />} />} 
        />
        <Route 
          path="/dashboard/add-food" 
          element={<PrivateRoute element={<AddFoodEntry />} />} 
        />
        <Route 
          path="/dashboard/history" 
          element={<PrivateRoute element={<History />} />} 
        />

        {/* Admin routes */}
        <Route 
          path="/admin" 
          element={<PrivateRoute element={<AdminDashboard />} requiredRole="ROLE_ADMIN" />} 
        />
      </Routes>
    </div>
  );
}

export default App;