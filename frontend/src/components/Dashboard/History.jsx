import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './styles/History.css';
import { getToken } from '../../utils/authUtils';

const History = () => {
  const navigate = useNavigate();
  const getISOWeek = (date) => {
    const tempDate = new Date(date);
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
    const week1 = new Date(tempDate.getFullYear(), 0, 4);
    return Math.round(((tempDate - week1) / 86400000 + week1.getDay() + 6) / 7);
  };

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');
  const [totalCalories, setTotalCalories] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(getISOWeek(new Date()));
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDateRangeActive, setIsDateRangeActive] = useState(false);
  const [dateRangeError, setDateRangeError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const fetchWithAuth = async (url) => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return null;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      navigate('/login');
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return response.json();
  };

  useEffect(() => {
    if (dateRange !== 'all') {
      fetchEntries();
    } else if (isDateRangeActive) {
      fetchEntries();
    } else {
      fetchAllEntries();
    }
  }, [dateRange, selectedYear, selectedMonth, selectedWeek, isDateRangeActive]);

  useEffect(() => {
    if (entries.length > 0) {
      const filtered = entries.filter(entry =>
        entry.foodName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEntries(filtered);
    }
  }, [searchTerm, entries]);

  const validateDateRange = () => {
    if (!startDate || !endDate) {
      setDateRangeError('Please select both start and end dates');
      return false;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      setDateRangeError('End date must be after start date');
      return false;
    }
    
    setDateRangeError('');
    return true;
  };

  const handleDateRangeSearch = (e) => {
    e.preventDefault();
    if (validateDateRange()) {
      setIsDateRangeActive(true);
      fetchEntries();
    }
  };

  const clearDateRange = () => {
    setStartDate('');
    setEndDate('');
    setIsDateRangeActive(false);
    setDateRangeError('');
    fetchAllEntries();
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const fetchAllEntries = async () => {
    try {
      setLoading(true);
      const url = `http://localhost:8080/api/food-entries/history?range=all`;
      const data = await fetchWithAuth(url);

      if (data) {
        setEntries(data.entries || []);
        setFilteredEntries(data.entries || []);
        setTotalCalories(data.totalCalories || 0);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntries = async () => {
    try {
      setLoading(true);
      let url = `http://localhost:8080/api/food-entries/history?range=all`;

      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }

      if (dateRange === 'week') {
        url += `&year=${selectedYear}&week=${selectedWeek}`;
      } else if (dateRange === 'month') {
        url += `&year=${selectedYear}&month=${selectedMonth}`;
      } else if (dateRange === 'all' && isDateRangeActive && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }

      const data = await fetchWithAuth(url);

      if (data) {
        setEntries(data.entries || []);
        setFilteredEntries(data.entries || []);
        setTotalCalories(data.totalCalories || 0);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString, format = 'full') => {
    const date = new Date(dateString);
    
    switch (format) {
      case 'monthYear':
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        });
      
      case 'dayAndWeekday':
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      
      case 'dayOfMonth':
        return date.getDate();
        
      default:
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
    }
  };

  const groupByDate = (entries) => {
    return entries.reduce((groups, entry) => {
      const date = dateRange === 'month' 
        ? formatDate(entry.dateTime, 'dayAndWeekday')
        : formatDate(entry.dateTime);
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
      return groups;
    }, {});
  };

  const toggleAccordion = (entryId) => {
    setExpandedEntry(prev => prev === entryId ? null : entryId);
  };

  const renderDateInput = (value, onChange, label) => (
    <div className="col-md-4">
      <label className="form-label">{label}:</label>
      <div className="date-input-container">
        <input
          type="date"
          className="form-control"
          value={value}
          onChange={onChange}
          max={today}
        />
      </div>
    </div>
  );

  const groupedEntries = groupByDate(filteredEntries);
  const currentMonthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' });

  return (
    <div className="min-vh-100 bg-light p-0">
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
            onClick={() => {
              setDateRange('all');
              clearDateRange();
            }}
          >
            All Time
          </button>
        </div>

        {dateRange === 'month' && (
          <h4 className="text-center mb-3">{currentMonthName} {selectedYear}</h4>
        )}

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="search-container">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search food..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={clearSearch}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {dateRange === 'all' && (
              <div className="mb-4">
              <p className = "fw-bold">Search your entries by range:</p>
                <form onSubmit={handleDateRangeSearch} className="row g-3 align-items-end">
                  {renderDateInput(startDate, (e) => setStartDate(e.target.value), 'From')}
                  {renderDateInput(endDate, (e) => setEndDate(e.target.value), 'To')}
                  <div className="col-md-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary me-2 mb-3"
                    >
                      Search
                    </button>
                    {isDateRangeActive && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary mb-3"
                        onClick={clearDateRange}
                      >
                        Clear Range
                      </button>
                    )}
                  </div>
                  {dateRangeError && (
                    <div className="col-12">
                      <div className="alert alert-danger" role="alert">
                        {dateRangeError}
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}

            {filteredEntries.length > 0 ? (
              <div className="entries-container">
                {Object.entries(groupedEntries).map(([date, entries]) => {
  
                  const dailyTotalCalories = entries.reduce((total, entry) => total + entry.calories, 0);
                  const totalRowColor = dailyTotalCalories > 2500 ? "rgb(255 238 240)" : "";
                  return (
                    <div key={date} className="card shadow-sm mb-3 history-entry">
                      <div className={`card-header ${dailyTotalCalories > 2500 ? 'bg-danger text-white' : ''}`}>
                        <h5 className="mb-0">{date}</h5>
                        <h5 className="mb-0">{dailyTotalCalories} kcal</h5>
                      </div>
                      <div className="card-body">
                        <table className="table table-hover mb-0">
                          <thead>
                            <tr>
                              <th>Time</th>
                              <th>Food Item</th>
                              <th>Meal Type</th>
                              <th>Calories (kcal)</th>
                              <th>Price (€)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {entries.map((entry) => (
                              <React.Fragment key={entry.id}>
                                <tr
                                  className="clickable-row"
                                  onClick={() => toggleAccordion(entry.id)}
                                >
                                  <td>{new Date(entry.dateTime).toLocaleTimeString('en-US', { 
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}</td>
                                  <td>{entry.foodName}</td>
                                  <td>{entry.mealType}</td>
                                  <td>{entry.calories}</td>
                                  <td>{entry.price.toFixed(2)}</td>
                                </tr>
                                {expandedEntry === entry.id && (
                                  <tr>
                                    <td colSpan="5" className="bg-light">
                                      <strong>Description:</strong> {entry.description || 'No description provided.'}
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                            <tr>
                              <td colSpan="3" className="text-end fw-bold" style={{backgroundColor: `${totalRowColor}`}}>Daily Total:</td>
                              <td className="fw-bold" style={{backgroundColor: `${totalRowColor}`}}>{dailyTotalCalories}</td>
                              <td className="fw-bold" style={{backgroundColor: `${totalRowColor}`}}>
                                {entries.reduce((total, entry) => total + entry.price, 0).toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}

                {dateRange !== 'day' && (
                  <div className="mt-3 mb-4 text-center">
                    <strong>Total Calories: 
                    <span className="text-dark"> {totalCalories} kcal</span></strong>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
  <p>
    {searchTerm
      ? 'No food items found matching your search.'
      : dateRange === 'all' && !isDateRangeActive
      ? 'Please select a date range to view entries.'
      : isDateRangeActive
      ? `No entries found between ${new Date(startDate).toLocaleDateString()} and ${new Date(endDate).toLocaleDateString()}.`
      : 'No entries found for this time period.'}
  </p>
</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default History;