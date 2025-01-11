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
    
    <div className="history-container animate-fade-in">
      
      <h2 className="text-center mb-4">Food History</h2>

      <div className="filters mb-4">
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
        <div className="history-entries animate-slide-in">
          {entries.map((entry, index) => (
            <div key={index} className="history-entry card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">{entry.food}</h5>
                    <p className="card-text text-muted">{formatDate(entry.date)}</p>
                  </div>
                  <div className="text-end">
                    <h6 className="mb-0">{entry.calories} calories</h6>
                    <p className="text-success mb-0">€{entry.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;