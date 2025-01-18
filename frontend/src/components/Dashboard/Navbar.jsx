import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Remove curly braces for default import
import headerLogo from '../../images/header-logo.png';
import ProfilePopup from './ProfilePopup.jsx';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getLinkClass = (path) =>
    `nav-link fw-medium link-primary ${location.pathname === path ? 'active' : ''}`;
  const token = localStorage.getItem('jwtToken');
  let userRole = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.role;
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('jwtToken');
      navigate('/');
    }
  }

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('jwtToken');
    navigate('/');
  };

  const [showProfile, setShowProfile] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#E3F2FD' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center link-primary" to="/dashboard">
          <img src={headerLogo} alt="Logo" width="200" height="40" className="me-2" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {userRole === 'ROLE_ADMIN' && (
              <li className="nav-item">
                <Link className={getLinkClass('/admin')} to="/admin">
                  Admin
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link className={getLinkClass('/dashboard')} to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={getLinkClass('/dashboard/add-food')} to="/dashboard/add-food">
                Add Food
              </Link>
            </li>
            <li className="nav-item">
              <Link className={getLinkClass('/dashboard/history')} to="/dashboard/history">
                History
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="nav-link fw-medium link-primary border-0 bg-transparent"
                onClick={() => setShowProfile(true)}
              >
                Account
              </button>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link fw-medium link-primary"
                to="/"
                onClick={handleLogout}
              >
                Log Out
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <ProfilePopup show={showProfile} onHide={() => setShowProfile(false)} />
    </nav>
  );
};

export default Navbar;
