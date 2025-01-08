import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container } from 'react-bootstrap';

import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sms, setSms] = useState('');
  const [smsColor, setSmsColor] = useState('');
  const [showPassword, setShowPassword] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSms('');

    
    if (email === "" || password === "") {
      setSms('Please fill in all fields');
      setSmsColor('red');
      return;
    }

    // Posts to Spring Backend
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', {
        email,
        password,
      });

     
      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('jwtToken', token); 
        setSms('Login successful');
        setSmsColor('green');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        
        setSms('Invalid email or password');
        setSmsColor('red');
      } else {
        
        setSms('An error occurred. Please try again.');
        setSmsColor('red');
      }
    }
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
            type={showPassword ? 'text' : 'password'} // Toggles the password visibility based on checkbox
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
            onChange={(e) => setShowPassword(e.target.checked)} // Toggles password visibility
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
