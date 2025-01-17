import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Spinner } from 'react-bootstrap';
import './login.css';
import headerLogo from '../../images/header-logo.png';
import EmailUtils from '../../utils/EmailUtils';

const Reset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sms, setSms] = useState('');
  const [smsColor, setSmsColor] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setSms('');

    if (!EmailUtils.validateEmail(email)) {
      setSms('Please enter a valid email address');
      setSmsColor('red');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const result = await EmailUtils.sendConfirmationCode(email);
      setSms(result.message);
      setSmsColor('green');
      setStep(2);
    } catch (error) {
      setSms(error.message);
      setSmsColor('red');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setSms('');

    if (!confirmationCode) {
      setSms('Please enter the confirmation code');
      setSmsColor('red');
      triggerShake();
      return;
    }

    if (EmailUtils.verifyConfirmationCode(confirmationCode)) {
      setStep(3);
      setSms('Code verified successfully');
      setSmsColor('green');
    } else {
      setSms('Invalid confirmation code');
      setSmsColor('red');
      triggerShake();
    }
  };

  useEffect(() => {
    const returnToDashboard = localStorage.getItem('returnToDashboard');
    if (returnToDashboard === 'true') {
      
      localStorage.removeItem('returnToDashboard');
    }
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setSms('');

    if (newPassword !== confirmPassword) {
      setSms('Passwords do not match');
      setSmsColor('red');
      triggerShake();
      return;
    }

    if (newPassword.length < 8) {
      setSms('Password must be at least 8 characters long');
      setSmsColor('red');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const result = await EmailUtils.resetPassword(newPassword);
      setSms(result.message);
      setSmsColor('green');
      
      const returnToDashboard = localStorage.getItem('returnToDashboard');
      setTimeout(() => {
        if (returnToDashboard === 'true') {
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      }, 2000);
    } catch (error) {
      setSms(error.message);
      setSmsColor('red');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className={`login-container ${isShaking ? 'shake-animation' : ''}`}>
      <div className="login-message text-center mb-4">
        <h2>Reset Your Password</h2>
        <p>
          {step === 1 && 'Enter your email to receive a confirmation code.'}
          {step === 2 && 'Enter the confirmation code sent to your email.'}
          {step === 3 && 'Enter your new password.'}
        </p>
      </div>

      <div className="login-card">
        <Form onSubmit={
          step === 1 ? handleSendCode :
          step === 2 ? handleVerifyCode :
          handleResetPassword
        }>
          <div className="login-logo mb-2">
            <Link className="d-flex align-items-center" to="/">
              <img src={headerLogo} alt="Logo" width="250" height="40" className="me-2" />
            </Link>
          </div>

          {step === 1 && (
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
          )}

          {step === 2 && (
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter confirmation code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                required
              />
            </Form.Group>
          )}

          {step === 3 && (
            <>
              <Form.Group className="mb-3">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3 d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  label="Show password"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
              </Form.Group>
            </>
          )}

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? <Spinner as="span" animation="border" size="sm" /> : (
              step === 1 ? 'Send Code' :
              step === 2 ? 'Verify Code' :
              'Reset Password'
            )}
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
