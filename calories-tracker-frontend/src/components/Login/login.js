import React, { useState } from 'react';
//import axios from 'axios';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (email === "test@example.com" && password === "password") {
      alert("Login successful!");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      
    </div>
  );
};

export default Login;

