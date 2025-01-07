import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container } from 'react-bootstrap';

import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sms, setSms] = useState('');
  const [smsColor, setSmsColor] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to control password visibility

  const handleSubmit = (e) => {
    e.preventDefault();
    setSms('');

    // Empty fields validation
    if (email==="" || password==="") {
      setSms('Please fill in all fields');
      setSmsColor('red');
      return; // Don't continue if email is invalid
    }

    // Checking if account exists
    if (email !== 'test@example.com' && password !== 'password') {
      setSms('Invalid email or password');
      setSmsColor('red');
      return;
    }
    
      setSms('Login successful');
      setSmsColor('green');
    
  };

  return (
    <Container className="login-container">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type={showPassword ? 'text' : 'password'} //Toggles the password based on the checkbox selection
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label="Show password"
            checked={showPassword} 
            onChange={(e) => setShowPassword(e.target.checked)} //Changes password toggle if we check or uncheck the box
          />
          <Form.Check type="checkbox" label="Keep me signed in" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
        <p style={{ color: `${smsColor}` }}>{sms}</p>
      </Form>
    </Container>
  );
};

export default Login;