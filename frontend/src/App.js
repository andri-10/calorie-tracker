import React from 'react';
import {Routes, Route } from 'react-router-dom';
import Login from './components/Login/login';
import Register from './components/Register/register';

function App() {
  return (
    <div className="App">
      
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      
    </div>
  );
}

export default App;