import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Container, Spinner } from 'react-bootstrap';
import './login.css';
import headerLogo from '../../images/header-logo.png';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sms, setSms] = useState('');
  const [smsColor, setSmsColor] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const tokenData = localStorage.getItem('jwtToken');
      if (tokenData) {
        try {
          const { timestamp, expiresIn } = JSON.parse(tokenData);
          const now = new Date().getTime();
          if (now - timestamp < expiresIn) {
            // Token is still valid, redirect to dashboard
            navigate('/dashboard');
          } else {
            // Token expired, remove it
            localStorage.removeItem('jwtToken');
          }
        } catch {
          localStorage.removeItem('jwtToken');
        }
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const storeToken = (token) => {
    const tokenData = {
      value: token,
      timestamp: new Date().getTime(),
      expiresIn: 24 * 60 * 60 * 1000 // 24 hours
    };
    localStorage.setItem('jwtToken', JSON.stringify(tokenData));
  };

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
        storeToken(token);

        setSms('Login successful');
        setSmsColor('green');
        
        // Get the redirect path from localStorage or use default
        const redirectPath = localStorage.getItem('redirectPath') || '/dashboard';
        localStorage.removeItem('redirectPath'); // Clear the saved path
        
        // Small delay to show success message
        setTimeout(() => {
          navigate(redirectPath);
        }, 500);
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

  // Input validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (sms && validateEmail(e.target.value)) {
      setSms('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (sms && e.target.value.length > 0) {
      setSms('');
    }
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
              onChange={handleEmailChange}
              required
              className={isShaking ? 'shake-input' : ''}
              isInvalid={email && !validateEmail(email)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
              className={isShaking ? 'shake-input' : ''}
              minLength="6"
            />
            <Form.Control.Feedback type="invalid">
              Password must be at least 6 characters long.
            </Form.Control.Feedback>
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
            disabled={loading || (email && !validateEmail(email))}
          >
            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Sign in'}
          </Button>

          {sms && (
            <div 
              className={`alert ${smsColor === 'green' ? 'alert-success' : 'alert-danger'} mt-3`} 
              role="alert"
            >
              {sms}
            </div>
          )}

          <div className="text-center mt-3">
            <p>
              Don't have an account?{' '}
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