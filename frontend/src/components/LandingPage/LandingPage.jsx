import React from 'react';
import { useNavigate } from 'react-router-dom';
import fullLogo from '../../images/logo-full.png';
import animation from '../../images/heart-animation.gif';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ 
      background: 'linear-gradient(135deg, #E3F2FD 0%, #90CAF9 100%)'
    }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="text-center text-md-start">
              <img src={fullLogo} alt="Logo" className="mb-4" style={{ width: '360px' }} />
              <h1 className="display-4 fw-bold text-primary mb-3">
                Track Your Calories & Budget
              </h1>
              <p className="lead text-dark mb-4">
                Keep track of your daily nutrition and spending with our easy-to-use calorie and budget tracker.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-md-start">
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
            </div>
          </div>
          <div className="col-md-6 d-none d-md-block">
            <img 
              src={animation} 
              alt="Illustration" 
              className="img-fluid"
              style={{ width: '250px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;