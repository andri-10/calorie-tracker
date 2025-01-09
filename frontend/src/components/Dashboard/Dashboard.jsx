import React, { useState } from 'react';
import Navbar from './Navbar';
import DailyProgress from './DailyProgress';
import FoodList from './FoodList';

const Dashboard = () => {
  const [dailyCalories, setDailyCalories] = useState(1750);
  const [monthlyExpenditure, setMonthlyExpenditure] = useState(800);
  const [showTips, setShowTips] = useState(false);

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary mb-0">Dashboard</h2>
          <button 
            className="btn btn-outline-primary"
            onClick={() => setShowTips(!showTips)}
          >
            {showTips ? 'Hide Tips' : 'Show Tips'}
          </button>
        </div>

        {showTips && (
          <div className="alert alert-info mb-4 animate-slide-in">
            <h5 className="alert-heading">💡 Daily Tips</h5>
            <ul className="mb-0">
              <li>Try to keep your daily calories under 2,500</li>
              <li>Track your food immediately after eating for better accuracy</li>
              <li>Monitor your monthly spending to stay within budget</li>
            </ul>
          </div>
        )}

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm card-hover">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">Today's Calories</h5>
                <h2 className="display-6 fw-bold mb-3">{dailyCalories} / 2,500</h2>
                <DailyProgress calories={dailyCalories} maxCalories={2500} />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm card-hover">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">Monthly Spending</h5>
                <h2 className="display-6 fw-bold mb-0">€{monthlyExpenditure.toFixed(2)}</h2>
                <div className="progress mt-5" style={{ height: '10px' }}>
                  <div 
                    className="progress-bar bg-primary"
                    style={{ width: `${(monthlyExpenditure / 1000) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm card-hover">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">Quick Stats</h5>
                <div className="list-group list-group-flush">
                  <div className="list-group-item border-0 px-0">
                    <div className="d-flex justify-content-between">
                      <span>Average Daily Calories</span>
                      <span className="fw-bold">2,100</span>
                    </div>
                  </div>
                  <div className="list-group-item border-0 px-0">
                    <div className="d-flex justify-content-between">
                      <span>This Week's Total</span>
                      <span className="fw-bold">€145.50</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <FoodList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;