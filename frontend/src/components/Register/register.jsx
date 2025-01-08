import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container } from 'react-bootstrap';
import './register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [name, setName] = useState(''); 
  const [sms, setSms] = useState('');
  const [smsColor, setSmsColor] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSms(''); // Clear any previous messages

    // Empty fields validation
    if (email === "" || password === "" || confirmPass === "" || name === "") {
      setSms('Please fill in all fields');
      setSmsColor('red');
      return;
    }

    // Email validation
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setSms('Email is invalid');
      setSmsColor('red');
      setEmail("");
      setPassword("");
      setConfirmPass("");
      return;
    }

    // Check if passwords match
    if (confirmPass !== password) {
      setSms('Passwords don\'t match');
      setSmsColor('red');
      setPassword("");
      setConfirmPass("");
      return;
    }

    // Password validation
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) {
      setSms('Your password should have at least 8 letters, 1 capital letter, and 1 special character');
      setSmsColor('red');
      setPassword("");
      setConfirmPass("");
      return;
    }

    try {
      // Sending registration data to Spring Boot backend
      const response = await axios.post('http://localhost:8080/users/register', {
        email,
        password,
        name,  
        role: 'USER',  
      });

      // If registration is successful
      if (response.status === 200) {
        console.log('Response Status:', response.status);
        setSms('Registration successful');
        setSmsColor('green');
        window.location.href = "/login";
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        console.log('Error Response Status:', error.response.status);
        console.log('Error Response Data:', error.response.data);
        if (error.response.status === 400) {
          setSms('Email already exists');
          setSmsColor('red');
        } else {
          setSms('An error occurred. Please try again.');
          setSmsColor('red');
        }
      } else {
        console.log('Error:', error.message);
        setSms('An error occurred. Please try again.');
        setSmsColor('red');
      }
    }
  };

  return (
    <Container className="register-container">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

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
            type={showPassword ? 'text' : 'password'} // Toggles password visibility based on checkbox
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type={showPassword ? 'text' : 'password'} // Toggles password visibility based on checkbox
            placeholder="Confirm Password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label="Show password"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)} // Toggles password visibility
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
        <p style={{ color: `${smsColor}` }}>{sms}</p>
      </Form>
    </Container>
  );
};

export default Register;
