import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Alert } from 'react-bootstrap';

const ProfilePopup = ({ show, onHide }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('No token found');
        }

        let tokenValue = token;
        try {
          const tokenData = JSON.parse(token);
          tokenValue = tokenData.value;
        } catch {
         
        }

        const response = await fetch('http://localhost:8080/users/profile', {
          headers: {
            'Authorization': `Bearer ${tokenValue}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUser(data);
        setEditedUser(data);
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
      const token = localStorage.getItem('jwtToken');
      let tokenValue = token;
      try {
        const tokenData = JSON.parse(token);
        tokenValue = tokenData.value;
      } catch {
       
      }

      const response = await fetch('http://localhost:8080/users/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenValue}`
        },
        body: JSON.stringify(editedUser)
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

  const handleResetPassword = () => {
    localStorage.setItem('returnToDashboard', 'true');
    navigate('/reset');
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={isEditing ? editedUser.email : user.email}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                disabled={!isEditing}
              />
            </Form.Group>
            <div className="d-flex gap-2">
              {!isEditing ? (
                <>
                  <Button variant="primary" onClick={handleEdit}>
                    Edit Profile
                  </Button>
                  <Button variant="secondary" onClick={handleResetPassword}>
                    Reset Password
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