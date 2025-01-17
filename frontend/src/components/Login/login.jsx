import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Container, Spinner } from 'react-bootstrap';
import { setToken, setupTokenCleanup } from '../../utils/authUtils';
import './login.css';
import headerLogo from '../../images/header-logo.png';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sms, setSms] = useState('');
  const [smsColor, setSmsColor] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setupTokenCleanup();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSms('');

    if (email.trim() === '' || password.trim() === '') {
      setSms('Please fill in all fields!');
      setSmsColor('red');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/users/login', {
        email,
        password,
      });
      
      if (response.status === 200) {
        const { token } = response.data;
        setToken(token); // Use the new setToken function
        
        const decoded = jwtDecode(token);
        
        setSms('Login successful');
        setSmsColor('green');
        
        if (decoded.role === 'ROLE_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setSms('Invalid email or password');
      } else {
        setSms('An unexpected error occurred. Please try again.');
      }
      setSmsColor('red');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <Container className={`login-container ${isShaking ? 'shake-animation' : ''}`}>
      <div className="login-message text-center mb-4">
        <h2>Welcome to Calorie Tracker!</h2>
        <p>Track your calories and achieve your health goals effortlessly.</p>
      </div>

      <div className="login-card">
        <Form onSubmit={handleSubmit}>
          <div className="login-logo mb-2">
           
            <Link className="d-flex align-items-center" to="/">
              <img src={headerLogo} alt="Logo" width="250" height="40" className="me-2" />
            </Link>
          </div>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={isShaking ? 'shake-input' : ''}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={isShaking ? 'shake-input' : ''}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Show password"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
          </Form.Group>
          
          <div className="text-center mt-3">
            <p>
              <Link to="/reset" className="text-primary fw-bold no-underline">
                Forgot your password?
              </Link>
            </p>
          </div>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Sign in'}
          </Button>

          {sms && <p style={{ color: smsColor, marginTop: '10px' }}>{sms}</p>}

          <div className="text-center mt-3">
            <p>
              Don’t have an account?{' '}
              <Link to="/register" className="text-primary fw-bold no-underline">
                Register here
              </Link>
              
            </p>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Login;