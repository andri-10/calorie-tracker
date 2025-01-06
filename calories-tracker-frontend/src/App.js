import React from 'react';
import Login from './components/Login/login.js';
import Register from './components/Register/register.js';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the Calories Tracker</h1>
      </header>
      <Login />
      <Register />
    </div>
  );
}

export default App;
