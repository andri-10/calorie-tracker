import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import headerLogo from '../../images/header-logo.png';
import ProfilePopup from './ProfilePopup.jsx';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

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
      localStorage.removeItem('user');
      navigate('/');
    }
  }

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('jwtToken');  
    localStorage.removeItem('user');  
    navigate('/');
  };

  const [showProfile, setShowProfile] = useState(false);

  const handleLinkClick = () => {
    if (!isNavCollapsed) {
      setIsNavCollapsed(true);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#E3F2FD' }}>
      <div className="container">
        <Link 
          className="navbar-brand d-flex align-items-center link-primary" 
          to="/dashboard"
          onClick={handleLinkClick}
        >
          <img src={headerLogo} alt="Logo" width="200" height="40" className="me-2" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
          aria-controls="navbarNav"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {userRole === 'ROLE_ADMIN' && (
              <li className="nav-item">
                <Link 
                  className={getLinkClass('/admin')} 
                  to="/admin"
                  onClick={handleLinkClick}
                >
                  Admin
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link 
                className={getLinkClass('/dashboard')} 
                to="/dashboard"
                onClick={handleLinkClick}
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={getLinkClass('/dashboard/add-food')} 
                to="/dashboard/add-food"
                onClick={handleLinkClick}
              >
                Add Food
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={getLinkClass('/dashboard/history')} 
                to="/dashboard/history"
                onClick={handleLinkClick}
              >
                History
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="nav-link fw-medium link-primary border-0 bg-transparent"
                onClick={() => {
                  setShowProfile(true);
                  handleLinkClick();
                }}
              >
                Account
              </button>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link fw-medium link-primary"
                to="/"
                onClick={(e) => {
                  handleLogout(e);
                  handleLinkClick();
                }}
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