import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Container, Spinner } from 'react-bootstrap';
import './login.css';
import headerLogo from '../../images/header-logo.png';

const Reset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sms, setSms] = useState('');
  const [smsColor, setSmsColor] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSms('');

    if (email.trim() === '') {
      setSms('Please fill in your email!');
      setSmsColor('red');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/users/reset-password', {
        email,
      });

      if (response.status === 200) {
        setSms('Password reset link sent successfully!');
        setSmsColor('green');
        navigate('/login');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setSms('Email not found');
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
        <h2>Reset Your Password</h2>
        <p>Enter your email to receive a password reset link.</p>
      </div>

      <div className="login-card">
        <Form onSubmit={handleSubmit}>
          <div className="login-logo mb-2">
            <Link className="d-flex align-items-center" to="/">
              <img src={headerLogo} alt="Logo" width="250" height="40" className="me-2" />
            </Link>
          </div>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={isShaking ? 'shake-input' : ''}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Send Code'}
          </Button>

          {sms && <p style={{ color: smsColor, marginTop: '10px' }}>{sms}</p>}

          <div className="text-center mt-3">
            <p>
              Remembered your password?{' '}
              <Link to="/login" className="text-primary fw-bold no-underline">
                Login here
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Reset;