import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import headerLogo from '../../images/header-logo.png';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getLinkClass = (path) =>
    `nav-link fw-medium link-primary ${location.pathname === path ? 'active' : ''}`;

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('jwtToken');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#E3F2FD' }}>
      <div className="container">
        <div >
          <Link className="navbar-brand d-flex align-items-center link-primary" to="/dashboard">
            <img src={headerLogo} alt="Logo" width="200" height="40" className="me-2" />
          </Link>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
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
    </nav>
  );
};

export default Navbar;
