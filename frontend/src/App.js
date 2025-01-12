import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login/login';
import Reset from './components/Login/reset';
import Register from './components/Register/register';
import LandingPage from './components/LandingPage/LandingPage';
import Dashboard from './components/Dashboard/Dashboard';
import AddFoodEntry from './components/Dashboard/AddFoodEntry';
import History from './components/Dashboard/History';


function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<Reset />} />
        
        {/* Protected routes - you might want to add authentication checking later */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/add-food" element={<AddFoodEntry />} />
        <Route path="/dashboard/history" element={<History />} />

      </Routes>
    </div>
  );
}

export default App;