import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FoodList = ({ updateStatsAfterDeletion }) => { 
  const navigate = useNavigate();
  const [foodEntries, setFoodEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => {
    const tokenData = localStorage.getItem('jwtToken');
    if (!tokenData) {
      navigate('/login');
      return null;
    }

    try {
      const { value, timestamp, expiresIn } = JSON.parse(tokenData);
      const now = new Date().getTime();
      
      if (now - timestamp > expiresIn) {
        localStorage.removeItem('jwtToken');
        navigate('/login');
        return null;
      }
      
      return value;
    } catch (error) {
      localStorage.removeItem('jwtToken');
      navigate('/login');
      return null;
    }
  };

  useEffect(() => {
    const fetchFoodEntries = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const timezoneOffset = today.getTimezoneOffset(); 
        today.setMinutes(today.getMinutes() - timezoneOffset);
        const dateParam = today.toISOString().split('.')[0]; 

        const response = await fetch(
          `http://localhost:8080/api/food-entries/daily?date=${dateParam}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem('jwtToken');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch food entries');
        }

        const data = await response.json();
        setFoodEntries(data);
      } catch (error) {
        setError(error.message);
        if (error.response?.status === 401) {
          localStorage.removeItem('jwtToken');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFoodEntries();
  }, [navigate]); 

  const deleteFoodEntry = async (foodEntryId, calories, price) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/food-entries/${foodEntryId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem('jwtToken');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to delete food entry');
      }

      // Update the stats in the parent component after deletion
      updateStatsAfterDeletion({ calories, price });

      // Remove the deleted entry from the local state
      setFoodEntries(foodEntries.filter(entry => entry.id !== foodEntryId));
    } catch (error) {
      setError(error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem('jwtToken');
        navigate('/login');
      }
    }
  };

  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="card-title text-primary fw-bold mb-4">Today's Entries</h5>
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="card-title text-primary fw-bold mb-4">Today's Entries</h5>
          <div className="alert alert-danger">Error: {error}</div>
        </div>
      </div>
    );
  }

  // Check if there are no food entries
  if (foodEntries.length === 0) {
    return (
      <div className="card border-0 shadow-sm animate-fade-in">
        <div className="card-body">
          <h5 className="card-title text-primary fw-bold mb-4">Today's Entries</h5>
          <p className="text-muted">No entries for today</p>
        </div>
      </div>
    );
  }


  return (
    <div className="card border-0 shadow-sm animate-fade-in">
      <div className="card-body">
        <h5 className="card-title text-primary fw-bold mb-4">Today's Entries</h5>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Time</th>
                <th>Food</th>
                <th>Calories</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foodEntries.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.formattedTime}</td>
                  <td>{entry.foodName}</td>
                  <td>{entry.calories}</td>
                  <td>€{entry.price}</td>
                  <td>
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteFoodEntry(entry.id, entry.calories, entry.price)} 
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FoodList;
