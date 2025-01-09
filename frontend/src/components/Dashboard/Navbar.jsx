import React from 'react';
import { Link } from 'react-router-dom';
import headerLogo from '../../images/header-logo.png';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{ backgroundColor: '#E3F2FD' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
          <img src={headerLogo} alt="Logo" width="200" height="30" className="me-2" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/dashboard/add-food">Add Food</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/dashboard/history">History</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/dashboard/expenses">Expenses</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;