import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import DailyProgress from './DailyProgress';
import FoodList from './FoodList';
import axios from 'axios';
import './styles/Dashboard.css';

const Dashboard = ({ userId }) => {
  const [dailyCalories, setDailyCalories] = useState(0);
  const [monthlyExpenditure, setMonthlyExpenditure] = useState(0);
  const [averageDailyCalories, setAverageDailyCalories] = useState(0);
  const [weeklySpending, setWeeklySpending] = useState(0);
  const [showTips, setShowTips] = useState(false);

  // Thresholds for the daily calories and monthly spending
  const CALORIES_LIMIT = 2500;
  const SPENDING_LIMIT = 1000;

  // Flags to show warnings
  const dailyCaloriesExceeded = dailyCalories > CALORIES_LIMIT;
  const monthlyExpenditureExceeded = monthlyExpenditure > SPENDING_LIMIT;

  useEffect(() => {
    const fetchDashboardData = async () => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1; // Months are zero-indexed
      const currentWeek = Math.ceil(
        (today.getDate() - today.getDay() + 7) / 7
      );

      today.setHours(0, 0, 0, 0);

      const timezoneOffset = today.getTimezoneOffset();

      today.setMinutes(today.getMinutes() - timezoneOffset);

      const dateParam = today.toISOString().split('T')[0] + 'T00:00:00';

      try {
        const token = localStorage.getItem('jwtToken');
        const dailyCaloriesResponse = await axios.get(
          `http://localhost:8080/api/food-entries/calories/daily`,
          {
            params: { date: dateParam },
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        setDailyCalories(dailyCaloriesResponse.data || 0);

        const monthlySpendingResponse = await axios.get(
          `http://localhost:8080/api/food-entries/spending/monthly`,
          {
            params: { year: currentYear, month: currentMonth },
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        setMonthlyExpenditure(monthlySpendingResponse.data || 0);

        // Fetch weekly spending
        const weeklyResponse = await axios.get(
          `http://localhost:8080/api/food-entries/history`,
          {
            params: { range: 'week', year: currentYear, week: currentWeek },
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        const weeklySpending = weeklyResponse.data.entries.reduce(
          (sum, entry) => sum + entry.price,
          0
        );
        setWeeklySpending(weeklySpending);

        // Fetch all-time entries for average daily calories
        const allEntriesResponse = await axios.get(
          `http://localhost:8080/api/food-entries/history`,
          {
            params: { range: 'all' },
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        const totalCalories = allEntriesResponse.data.entries.reduce(
          (sum, entry) => sum + entry.calories,
          0
        );
        const activeDays = allEntriesResponse.data.entries.reduce(
          (acc, entry) => {
            const date = entry.dateTime.split('T')[0]; // Extract date part
            acc.add(date); // Use a Set to store unique dates
            return acc;
          },
          new Set()
        ).size;

        setAverageDailyCalories(activeDays > 0 ? totalCalories / activeDays : 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [userId]);

  const updateStatsAfterDeletion = async (deletedEntry) => {
    // Recalculate stats after the deletion of an entry
    setDailyCalories((prev) => prev - deletedEntry.calories);
    setMonthlyExpenditure((prev) => prev - deletedEntry.price);
    setWeeklySpending((prev) => prev - deletedEntry.price);
  
    try {
      const token = localStorage.getItem('jwtToken');
      
      // Refetch all-time entries after deletion
      const allEntriesResponse = await axios.get(
        `http://localhost:8080/api/food-entries/history`,
        {
          params: { range: 'all' },
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
  
      // Calculate total calories and active days
      const totalCalories = allEntriesResponse.data.entries.reduce(
        (sum, entry) => sum + entry.calories,
        0
      );
  
      const activeDays = new Set();
      allEntriesResponse.data.entries.forEach((entry) => {
        const date = entry.dateTime.split('T')[0]; // Extract date part
        activeDays.add(date);
      });
  
      const newAverageCalories = activeDays.size > 0 ? totalCalories / activeDays.size : 0;
  
      setAverageDailyCalories(newAverageCalories);
    } catch (error) {
      console.error('Error fetching all-time entries after deletion:', error);
    }
  };

  return (
    <div className="min-vh-100 bg-light p-0">
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
              <div className="card-body today-calories">
                <div>
                  <h5 className="card-title text-primary fw-bold">Today's Calories</h5>
                  <h2
                    className={`display-6 fw-bold mb-3 ${
                      dailyCaloriesExceeded ? 'text-danger' : ''
                    }`}
                  >
                    {dailyCalories} / 2,500
                  </h2>
                  {dailyCaloriesExceeded && (
                    <p className="text-danger">You've exceeded your daily calorie limit!</p>
                  )}
                </div>
                <DailyProgress calories={dailyCalories} maxCalories={2500} />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm card-hover">
              <div className="card-body monthly-spending">
                <div>
                  <h5 className="card-title text-primary fw-bold">Monthly Spending</h5>
                  <h2
                    className={`display-6 fw-bold mb-3 ${
                      monthlyExpenditureExceeded ? 'text-danger' : ''
                    }`}
                  >
                    €{monthlyExpenditure.toFixed(2)}
                  </h2>
                  {monthlyExpenditureExceeded && (
                    <p className="text-danger">You've exceeded your monthly spending limit!</p>
                  )}
                </div>
                <div className="progress mt-5" style={{ height: '10px' }}>
                  <div
                    className={`progress-bar ${
                      monthlyExpenditureExceeded ? 'bg-danger' : 'bg-primary'
                    }`}
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
                      <span className="fw-bold">{averageDailyCalories.toFixed(0)}</span>
                    </div>
                  </div>
                  <div className="list-group-item border-0 px-0">
                    <div className="d-flex justify-content-between">
                      <span>This Week's Total</span>
                      <span className="fw-bold">€{weeklySpending.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <FoodList updateStatsAfterDeletion={updateStatsAfterDeletion} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
