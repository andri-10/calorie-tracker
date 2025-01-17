import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import DailyProgress from './DailyProgress';
import FoodList from './FoodList';
import axios from 'axios';
import './styles/Dashboard.css';
import MonthlyProgress from './MonthlyProgress';
import { getToken } from '../../utils/authUtils';

const Dashboard = ({ userId }) => {
  const navigate = useNavigate();
  const [dailyCalories, setDailyCalories] = useState(0);
  const [monthlyExpenditure, setMonthlyExpenditure] = useState(0);
  const [averageDailyCalories, setAverageDailyCalories] = useState(0);
  const [weeklySpending, setWeeklySpending] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [last7DaysCalories, setLast7DaysCalories] = useState([]);

  const CALORIES_LIMIT = 2500;
  const SPENDING_LIMIT = 1000;

  const dailyCaloriesExceeded = dailyCalories > CALORIES_LIMIT;
  const monthlyExpenditureExceeded = monthlyExpenditure > SPENDING_LIMIT;

  const createAxiosConfig = () => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return null;
    }
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };


  useEffect(() => {
    const fetchDashboardData = async () => {
      const config = createAxiosConfig();
      if (!config) return;

      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      const currentWeek = Math.ceil((today.getDate() - today.getDay() + 7) / 7);

      today.setHours(0, 0, 0, 0);
      const timezoneOffset = today.getTimezoneOffset();
      today.setMinutes(today.getMinutes() - timezoneOffset);
      const dateParam = today.toISOString().split('T')[0] + 'T00:00:00';

      try {
        const dailyCaloriesResponse = await axios.get(
          `http://localhost:8080/api/food-entries/calories/daily`,
          {
            ...config,
            params: { date: dateParam }
          }
        );
        setDailyCalories(dailyCaloriesResponse.data || 0);

        const monthlySpendingResponse = await axios.get(
          `http://localhost:8080/api/food-entries/spending/monthly`,
          {
            ...config,
            params: { year: currentYear, month: currentMonth }
          }
        );
        setMonthlyExpenditure(monthlySpendingResponse.data || 0);

        const weeklyResponse = await axios.get(
          `http://localhost:8080/api/food-entries/history`,
          {
            ...config,
            params: { range: 'week', year: currentYear, week: currentWeek }
          }
        );

        const entries = weeklyResponse.data.entries;
        const groupedCalories = calculateLast7DaysCalories(entries);
        setLast7DaysCalories(groupedCalories);

        const weeklySpending = entries.reduce((sum, entry) => sum + entry.price, 0);
        setWeeklySpending(weeklySpending);

        const allEntriesResponse = await axios.get(
          `http://localhost:8080/api/food-entries/history`,
          {
            ...config,
            params: { range: 'all' }
          }
        );

        const totalCalories = allEntriesResponse.data.entries.reduce(
          (sum, entry) => sum + entry.calories,
          0
        );

        const activeDays = new Set(
          allEntriesResponse.data.entries.map(entry => entry.dateTime.split('T')[0])
        ).size;

        setAverageDailyCalories(activeDays > 0 ? totalCalories / activeDays : 0);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          console.error('Error fetching dashboard data:', error);
        }
      }
    };

    fetchDashboardData();
  }, [userId, navigate]);




  const calculateLast7DaysCalories = (entries) => {
    const dateMap = {};

    entries.forEach((entry) => {
      const date = entry.dateTime.split('T')[0];
      dateMap[date] = (dateMap[date] || 0) + entry.calories;
    });

    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dateString = date.toISOString().split('T')[0];
      const calories = dateMap[dateString] || 0;
      const status =
        calories > CALORIES_LIMIT
          ? 'danger'
          : calories >= CALORIES_LIMIT * 0.95
          ? 'warning'
          : 'safe';

      return { date: dateString, calories, status };
    }).reverse();
  };

  const updateStatsAfterDeletion = async (deletedEntry) => {

    setDailyCalories((prev) => prev - deletedEntry.calories);
    setMonthlyExpenditure((prev) => prev - deletedEntry.price);
    setWeeklySpending((prev) => prev - deletedEntry.price);
  
    try {
      const token = localStorage.getItem('jwtToken');

      const today = new Date();
      const currentYear = today.getFullYear();
      const currentWeek = Math.ceil(
        (today.getDate() - today.getDay() + 7) / 7
      );
  
      const weeklyResponse = await axios.get(
        `http://localhost:8080/api/food-entries/history`,
        {
          params: { range: 'week', year: currentYear, week: currentWeek },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  

      const entries = weeklyResponse.data.entries;
      const updatedLast7DaysCalories = calculateLast7DaysCalories(entries);
      setLast7DaysCalories(updatedLast7DaysCalories);

      const allEntriesResponse = await axios.get(
        `http://localhost:8080/api/food-entries/history`,
        {
          params: { range: 'all' },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const totalCalories = allEntriesResponse.data.entries.reduce(
        (sum, entry) => sum + entry.calories,
        0
      );
  
      const activeDays = new Set();
      allEntriesResponse.data.entries.forEach((entry) => {
        const date = entry.dateTime.split('T')[0];
        activeDays.add(date);
      });
  
      const newAverageCalories = activeDays.size > 0 ? totalCalories / activeDays.size : 0;
      setAverageDailyCalories(newAverageCalories);
    } catch (error) {
      console.error('Error fetching updated data after deletion:', error);
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
                    {dailyCalories} / 2500
                  </h2>
                  {dailyCaloriesExceeded && (
                    <p className="text-danger">You've exceeded your daily calorie limit!</p>
                  )}
                </div>
                <DailyProgress calories={dailyCalories} maxCalories={CALORIES_LIMIT} />
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
                <MonthlyProgress spending={monthlyExpenditure} maxSpending={SPENDING_LIMIT} />
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

          <div className="col-12 mt-4">
            <div className="card h-100 border-0 shadow-sm card-hover">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">Last 7 Days Calories</h5>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Calories</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {last7DaysCalories.map(({ date, calories, status }) => (
                        <tr key={date}>
                          <td>{date}</td>
                          <td>{calories}</td>
                          <td>
                            <span
                              className={`badge ${
                                status === 'danger'
                                  ? 'bg-danger'
                                  : status === 'warning'
                                  ? 'bg-warning text-dark'
                                  : 'bg-success'
                              }`}
                            >
                              {status === 'danger'
                                ? 'Exceeded'
                                : status === 'warning'
                                ? 'Warning'
                                : 'Safe'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
