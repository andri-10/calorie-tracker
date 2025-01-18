import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/Routes/PrivateRoute';
import PublicRoute from './components/Routes/PublicRoute';
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
        {/* Public landing page - accessible to all */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth routes - only for non-authenticated users */}
        <Route 
          path="/login" 
          element={<PublicRoute element={<Login />} />} 
        />
        <Route 
          path="/register" 
          element={<PublicRoute element={<Register />} />} 
        />
        <Route 
          path="/reset" 
          element={<PublicRoute element={<Reset />} />} 
        />

        {/* Private routes - only for authenticated users */}
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