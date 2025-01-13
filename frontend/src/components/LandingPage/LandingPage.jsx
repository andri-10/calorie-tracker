import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fullLogo from '../../images/logo-full.png';
import animation from '../../images/heart-animation.gif';
import bgImage from '../../images/bg-image.png';
import './LandingPage.css'; // Add this line for external styles

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div
      className="landing-container fade-in-animation"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="landing-content">
        <div className="content-wrapper">
          <div className="logo-container">
            <img
              src={fullLogo}
              alt="Logo"
              className="logo slide-down-animation"
            />
          </div>

          <div className="text-content fade-in-animation">
            <h1 className="title">Track Your Calories & Budget</h1>
            <p className="description">
              Keep track of your daily nutrition and spending with our
              easy-to-use calorie and budget tracker.
            </p>
            <div className="buttons-container">
              {isLoggedIn ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="dashboard-btn login-btn"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="login-btn"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="register-btn"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="animation-container">
            <img
              src={animation}
              alt="Illustration"
              className="heart-animation slide-up-animation"
            />
          </div>
        </div>
      </div>

      <footer className="landing-footer fw-bold">
        <p>&copy; CaloriesTracker 2025. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
