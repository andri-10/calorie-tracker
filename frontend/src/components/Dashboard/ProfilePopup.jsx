import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { getToken } from '../../utils/authUtils';

const ProfilePopup = ({ show, onHide }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: ''
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No token found');
        }
    
        const response = await fetch('http://localhost:8080/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
    
        const data = await response.json();
        const userData = {
          ...data.user,
          joinedDate: data.joinedDate
        };
        
        setUser(userData);
        setEditedUser(userData);
        setError('');
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile. Please try again.');
      }
    };

    if (show) {
      fetchUserProfile();
    }
  }, [show]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }
  
      
      const userToUpdate = {
        name: editedUser.name,
        email: user.email  // Include current email since backend expects it
      };
  
      const response = await fetch('http://localhost:8080/users/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userToUpdate)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
  
      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      setError('');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
    setError('');
  };


  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
    return passwordRegex.test(password);
  };

  const handlePasswordReset = async () => {
    setPasswordError('');
    
    // Validate inputs
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (!validatePassword(passwordData.newPassword)) {
      setPasswordError('Password must contain at least one uppercase letter, one number, and one special character');
      return;
    }

    try {
      const token = getToken();
      const response = await fetch('http://localhost:8080/users/password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }

      // Clear password fields and show success
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordFields(false);
      Alert.success('Password reset successfully');
    } catch (error) {
      setPasswordError(error.message || 'Failed to reset password');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats as MM/DD/YYYY
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Your Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {user && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={isEditing ? editedUser.name : user.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter your name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={user.email}
                disabled={true}  // Always disabled
                readOnly        // Added for extra clarity
                placeholder="Your email"
              />
            </Form.Group>
            <Form.Text className="text-muted">
              <strong>Joined Date: </strong>{formatDate(user.joinedDate)}
            </Form.Text>
            <div className="d-flex gap-2 mt-3">
              {!isEditing ? (
                <>
                  <Button variant="primary" onClick={handleEdit}>
                    Edit Profile
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                  >
                    {showPasswordFields ? 'Hide Password Reset' : 'Reset Password'}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="success" onClick={handleSave}>
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
            {showPasswordFields && (
              <div className="password-reset-section mt-3">
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value
                    })}
                    placeholder="Enter current password"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value
                    })}
                    placeholder="Enter new password"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value
                    })}
                    placeholder="Confirm new password"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Show Password"
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                </Form.Group>

                {passwordError && (
                  <Alert variant="danger" className="mt-2">
                    {passwordError}
                  </Alert>
                )}

                <div className="d-flex gap-2">
                  <Button variant="primary" onClick={handlePasswordReset}>
                    Save Password
                  </Button>
                  <Button variant="secondary" onClick={() => {
                    setShowPasswordFields(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setPasswordError('');
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Back to Dashboard
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfilePopup;
