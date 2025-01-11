import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './styles/History.css';

const History = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    fetchEntries();
  }, [dateRange]);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/food/history?range=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container mt-4 animate-fade-in">
        <h2 className="text-center mb-4">Food History</h2>

        <div className="filters mb-4 text-center">
          <button
            className={`btn ${dateRange === 'week' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
            onClick={() => setDateRange('week')}
          >
            This Week
          </button>
          <button
            className={`btn ${dateRange === 'month' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
            onClick={() => setDateRange('month')}
          >
            This Month
          </button>
          <button
            className={`btn ${dateRange === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setDateRange('all')}
          >
            All Time
          </button>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm animate-slide-in">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Food Item</th>
                    <th>Meal Type</th>
                    <th>Date</th>
                    <th>Calories</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.food}</td>
                      <td>{formatDate(entry.date)}</td>
                      <td>{entry.calories} cal</td>
                      <td>€{entry.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;