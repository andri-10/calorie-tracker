import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Container } from 'react-bootstrap';
import './register.css';
import headerLogo from '../../images/header-logo.png'; 

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPass: ''
  });
  const [sms, setSms] = useState('');
  const [smsColor, setSmsColor] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSms('');
    const { name, email, password, confirmPass } = formData;
    if (!name || !email || !password || !confirmPass) {
      setSms('Please fill in all fields!');
      setSmsColor('red');
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setSms('Email is invalid');
      setSmsColor('red');
      setFormData(prev => ({
        ...prev,
        email: '',
        password: '',
        confirmPass: ''
      }));
      return;
    }
    if (confirmPass !== password) {
      setSms('Passwords don\'t match');
      setSmsColor('red');
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPass: ''
      }));
      return;
    }
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) {
      setSms('Your password should have at least 8 letters, 1 capital letter, and 1 special character');
      setSmsColor('red');
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPass: ''
      }));
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/users/register', {
        name,
        email,
        password
      });

      if (response.status === 200) {
        setSms('Registration successful');
        setSmsColor('green');
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        console.log('Error Response Status:', error.response.status);
        console.log('Error Response Data:', error.response.data);
        if (error.response.status === 400) {
          setSms(error.response.data.includes('Email is already in use') 
            ? 'Email already exists' 
            : 'Registration failed. Please try again.');
        } else {
          setSms('An error occurred. Please try again.');
        }
        setSmsColor('red');
      } else {
        console.log('Error:', error.message);
        setSms('An error occurred. Please try again.');
        setSmsColor('red');
      }
    }
  };

  return (
    <Container className="register-container">
      <div className="register-message">
        <h2>Create an Account</h2>
        <p>Join us and start tracking your calories today!</p>
      </div>

      <div className="register-card">
        <Form onSubmit={handleSubmit} className="register-form">
        <div className="login-logo mb-2">
            <Link className="d-flex align-items-center" to="/">
              <img src={headerLogo} alt="Logo" width="250" height="40" className="me-2" />
            </Link>
          </div>

          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              name="confirmPass"
              value={formData.confirmPass}
              onChange={handleChange}
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

          <Button variant="primary" type="submit" className="register-button">
            Register
          </Button>

          {sms && <p className={smsColor === 'red' ? 'error-message' : 'success-message'}>{sms}</p>}

          <div className="register-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-primary fw-bold no-underline">
                Login here.
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Register;
