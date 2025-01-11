import React from 'react';
import { useNavigate } from 'react-router-dom';
import fullLogo from '../../images/logo-full.png';
import animation from '../../images/heart-animation.gif';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ 
      background: 'linear-gradient(135deg, #E3F2FD 0%, #90CAF9 100%)'
    }}>
      {/* Main Content */}
      <div className="flex-grow-1 d-flex align-items-start pt-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <img src={fullLogo} alt="Logo" className="mb-4" style={{ width: '360px' }} />
              <h1 className="display-4 fw-bold text-primary mb-3">
                Track Your Calories & Budget
              </h1>
              <p className="lead text-dark mb-4">
                Keep track of your daily nutrition and spending with our easy-to-use calorie and budget tracker.
              </p>
              <div className="d-flex gap-3 justify-content-center mb-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="btn btn-primary btn-lg px-4"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="btn btn-outline-primary btn-lg px-4"
                >
                  Register
                </button>
              </div>
              <div className="d-flex justify-content-center">
                <img 
                  src={animation} 
                  alt="Illustration" 
                  className="img-fluid"
                  style={{ 
                    width: '200px',
                    maxWidth: '100%'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-3">
        <div className="container">
          <div className="text-center text-dark">
            <p className="mb-0 lead text-dark" >
              &copy; CaloriesTracker 2025. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;