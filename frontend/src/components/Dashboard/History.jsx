import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './styles/History.css';

const History = () => {
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
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [expandedEntry, setExpandedEntry] = useState(null); // For managing expanded entry

  useEffect(() => {
    fetchEntries();
  }, [dateRange, selectedYear, selectedMonth, selectedWeek, selectedDay]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwtToken');
      let url = `http://localhost:8080/api/food-entries/history?range=${dateRange}`;

      if (dateRange === 'day') {
        url += `&year=${selectedYear}&month=${selectedMonth}&day=${selectedDay}`;
      } else if (dateRange === 'week') {
        url += `&year=${selectedYear}&week=${selectedWeek}`;
      } else if (dateRange === 'month') {
        url += `&year=${selectedYear}&month=${selectedMonth}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
        setTotalCalories(data.totalCalories || 0);
      } else {
        console.error('Failed to fetch data:', response.statusText);
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
      day: 'numeric',
    });
  };

  const groupByDate = (entries) => {
    return entries.reduce((groups, entry) => {
      const date = formatDate(entry.dateTime);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
      return groups;
    }, {});
  };

  const groupedEntries = groupByDate(entries);

  const toggleAccordion = (entryId) => {
    setExpandedEntry((prev) => (prev === entryId ? null : entryId));
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container mt-4 animate-fade-in">
        <h2 className="text-center mb-4">Food History</h2>

        {/* Date Range Filters */}
        <div className="filters mb-4 text-center">
          <button
            className={`btn ${dateRange === 'day' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setDateRange('day')}
          >
            Today
          </button>
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
        ) : entries.length > 0 ? (
          <div>
            {Object.entries(groupedEntries).map(([date, entries]) => (
              <div key={date} className="card shadow-sm mb-3 animate-slide-in">
                <div className="card-header">
                  <h5 className="mb-0">{date}</h5>
                </div>
                <div className="card-body">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Food Item</th>
                        <th>Meal Type</th>
                        <th>Calories</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry) => (
                        <React.Fragment key={entry.id}>
                          <tr
                            className="clickable-row"
                            onClick={() => toggleAccordion(entry.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <td>{entry.foodName}</td>
                            <td>{entry.mealType}</td>
                            <td>{entry.calories} cal</td>
                            <td>€{entry.price.toFixed(2)}</td>
                          </tr>
                          {expandedEntry === entry.id && (
                            <tr>
                              <td colSpan="4" className="bg-light">
                                <strong>Description:</strong> {entry.description || 'No description provided.'}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-2">
                    <strong>Total Calories for {date}: </strong>
                    {entries.reduce((total, entry) => total + entry.calories, 0)} cal
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-3 text-center">
              <strong>Total Calories Across All Entries: </strong> {totalCalories} cal
            </div>
          </div>
        ) : (
          <div className="text-center mt-3">
            <p>No entries found for this time period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
