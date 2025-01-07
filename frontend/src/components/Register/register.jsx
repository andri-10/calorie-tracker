import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import './register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [sms, setSms] = useState('');
  const [smsColor, setSmsColor] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to control password visibility

  const handleSubmit = (e) => {
    e.preventDefault();
    setSms(''); // Clear any previous messages

    // Empty fields validation
    if (email==="" || password==="" || confirmPass==="") {
        setSms('Please fill in all fields');
        setSmsColor('red');
        return; // Don't continue if email is invalid
    }

    // Email validation
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setSms('Email is invalid');
      setSmsColor('red');
      setEmail("");
      setPassword(""); 
      setConfirmPass("");
      return; // Don't continue if email is invalid
    }

    // Check if passwords match
    if (confirmPass !== password) {
      setSms('Passwords don\'t match');
      setSmsColor('red');
      setPassword(""); 
      setConfirmPass("");
      return; // Don't continue if passwords don't match
    }

    // Password validation
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) {
      setSms('Your password should have at least 8 letters, 1 capital letter, and 1 special character');
      setSmsColor('red');
      setPassword(""); 
      setConfirmPass(""); 
      return; // Don't continue if password is invalid
    }

    // Registration successful
    setSms('Registration successful');
    setSmsColor('green');
  };

  return (
    <Container className="register-container">
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
            onChange={(e) => setShowPassword(e.target.checked)} // Changes password toggle if checkbox is checked/unchecked
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