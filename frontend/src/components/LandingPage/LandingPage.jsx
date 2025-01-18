import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getToken, 
  setupTokenCleanup, 
  markNavigatingToLandingPage,
  resetNavigatingFlag 
} from '../../utils/authUtils'; 
import fullLogo from '../../images/logo-full.png';
import animation from '../../images/heart-animation.gif';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mark that we're on landing page
    markNavigatingToLandingPage();
    
    // Initialize token cleanup
    setupTokenCleanup();

    // Function to check auth status
    const checkAuth = () => {
      const token = getToken();
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };

    // Initial check
    checkAuth();

    // Clean up when component unmounts
    return () => {
      resetNavigatingFlag();
    };
  }, []); 

  const handleNavigation = (path) => {
    // Reset the navigating flag before navigation
    resetNavigatingFlag();
    navigate(path);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="landing-container fade-in-animation">
      <div className="landing-content">
        <div className="content-wrapper">
          <div className="logo-container">
            <img src={fullLogo} alt="Logo" className="logo slide-down-animation" />
          </div>

          <div className="text-content fade-in-animation">
            <h1 className="title">Track Your Calories & Budget</h1>
            <p className="description">
              Keep track of your daily nutrition and spending with our easy-to-use calorie and budget tracker.
            </p>
            <div className="buttons-container">
              {isLoggedIn ? (
                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className="dashboard-btn login-btn"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="login-btn"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigation('/register')}
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
        <p>&copy; CalorieTracker 2025. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;