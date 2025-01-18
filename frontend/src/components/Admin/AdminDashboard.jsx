import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, clearToken } from '../../utils/authUtils';
import Navbar from '../Dashboard/Navbar';
import AddFoodEntryModal from './AddFoodEntryModal';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEntries: 0,
    activeToday: 0,
    lastWeekEntries: 0,
    weekBeforeEntries: 0,
    averageCaloriesAllUsers: 0,
    usersOverBudget: []
  });
  const [users, setUsers] = useState([]);
  const [selectedUserEntries, setSelectedUserEntries] = useState([]);
  const [showEntriesModal, setShowEntriesModal] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const [userAverageCalories, setUserAverageCalories] = useState(0);
  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [userJoinDate, setUserJoinDate] = useState(null);


  const toggleAccordion = (entryId) => {
    setExpandedEntry(prev => prev === entryId ? null : entryId);
  };
  

  useEffect(() => {
    const token = getToken();
    if (!token) {
      clearToken();
      navigate('/login');
    }

    fetchStats();
    fetchUsers();

    const intervalId = setInterval(() => {
      fetchStats();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:8080/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:8080/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleViewEntries = async (userId, userName) => {
    try {
      setSelectedUserId(userId);
      const token = getToken();
      
      
      const userResponse = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setSelectedUserName(userName);
        setUserJoinDate(userData.createdAt); 
      }
  
      const entriesResponse = await fetch(`http://localhost:8080/api/admin/users/${userId}/entries`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (entriesResponse.ok) {
        const data = await entriesResponse.json();
        setSelectedUserEntries(data);
  
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
  
        const recentEntries = data.filter(entry => {
          const entryDate = new Date(entry.dateTime);
          return entryDate >= lastWeek && entryDate <= today;
        });
  
        const totalCalories = recentEntries.reduce((sum, entry) => sum + entry.calories, 0);
        
        const averageCalories = recentEntries.length > 0 ? totalCalories / recentEntries.length : 0;
  
        setUserAverageCalories(averageCalories);
        setShowEntriesModal(true);
      }
    } catch (error) {
      console.error('Error fetching user entries:', error);
    }
  };
  

  const handleUpdateEntry = async (entryId, updatedData) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:8080/api/admin/entries/${entryId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        setEditingEntry(null);
        const updatedEntry = await response.json();
        setSelectedUserEntries(entries =>
          entries.map(entry =>
            entry.id === entryId ? updatedEntry : entry
          )
        );

        await fetchStats();
      }
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const token = getToken();
        const response = await fetch(`http://localhost:8080/api/admin/entries/${entryId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          setSelectedUserEntries(entries => entries.filter(entry => entry.id !== entryId));

          await fetchStats();
        }
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  const handleSaveEdit = async (entry) => {
    const updatedData = {
      foodName: entry.foodName,
      calories: entry.calories,
      price: entry.price,
      mealType: entry.mealType,
      description: entry.description
    };
    await handleUpdateEntry(entry.id, updatedData);
  };

  return (
    <div className="min-vh-100 p-0">
      <Navbar />
      <div className="container py-1 mt-4">
        <div className="text-center mb-4">
          <h1 className="display-4 text-primary">CalorieTracker Admin Dashboard</h1>
          <p className="lead text-muted">System Analytics and Management</p>
        </div>

        <div className="row mb-4">
          <div className="col-lg-4 mb-2">
            <div className="card text-center shadow-sm">
              <div className="card-body ">
                <h3 className="card-title text-primary">{stats.totalUsers}</h3>
                <p className="card-text">Total Users</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-2">
            <div className="card text-center shadow-sm">
              <div className="card-body ">
                <h3 className="card-title text-primary">{stats.averageCaloriesAllUsers.toFixed(0)}</h3>
                <p className="card-text">Avg. Calories/User (Last 7 Days)</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-2">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-primary">{stats.activeToday}</h3>
                <p className="card-text">Active Today</p>
              </div>
            </div>
          </div>
        </div>
      
        <div className="row mb-4">
          <div>
            <div className="card text-center shadow-sm">
              <div className="card-body ">
                <p>Entries this week: <span className='text-primary fw-bold'>{stats.lastWeekEntries}</span></p>
                <p>Entries last week: <span className='text-primary fw-bold'>{stats.weekBeforeEntries}</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-xl-6 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Users Over Monthly Budget</h5>
                {stats.usersOverBudget.length > 0 ? (
                  <ul className="list-group">
                    {stats.usersOverBudget.map(user => (
                      <li key={user.id} className="list-group-item d-flex justify-content-between">
                        <span>{user.name}</span>
                        <span className="text-danger">${user.totalSpent}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="alert alert-info">No Users Over Budget</div>
                )}
              </div>
            </div>
          </div>

          <div className="col-xl-6 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">User Management</h5>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <button
                            onClick={() => handleViewEntries(user.id, user.name)}
                            className="btn btn-primary btn-sm"
                          >
                            View Entries
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {showEntriesModal && (
  <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
    <div className="modal-dialog modal-lg" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Entries for {selectedUserName}</h5>
          <div>
            <button
              className="btn btn-primary me-2"
              onClick={() => setShowAddEntryModal(true)}
            >
              Add Entry
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowEntriesModal(false)}
            >
              Close
            </button>
          </div>
        </div>
        <div className="modal-body">
          <h6>Average calories for this user last week: {userAverageCalories.toFixed(2)} kcal</h6>
          <h6>Joined on: {userJoinDate ? new Date(userJoinDate).toLocaleDateString() : 'N/A'}</h6> {/* Display Join Date */}
          <table className="table table-striped" id="modalTable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Food</th>
                <th>Calories</th>
                <th>Price</th>
                <th>Meal Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedUserEntries.map(entry => (
                <React.Fragment key={entry.id}>
                  <tr
                    className="clickable-row"
                    onClick={() => toggleAccordion(entry.id)}
                  >
                    {editingEntry?.id === entry.id ? (
                      <>
                        <td>{new Date(entry.dateTime).toLocaleDateString()}</td>
                        <td>
                          <input
                            type="text"
                            value={editingEntry.foodName}
                            onChange={e => setEditingEntry({
                              ...editingEntry,
                              foodName: e.target.value
                            })}
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={editingEntry.calories}
                            onChange={e => setEditingEntry({
                              ...editingEntry,
                              calories: parseInt(e.target.value)
                            })}
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            value={editingEntry.price}
                            onChange={e => setEditingEntry({
                              ...editingEntry,
                              price: parseFloat(e.target.value)
                            })}
                            className="form-control"
                          />
                        </td>
                        <td>
                          <select
                            value={editingEntry.mealType}
                            onChange={e => setEditingEntry({
                              ...editingEntry,
                              mealType: e.target.value
                            })}
                            className="form-control"
                          >
                            <option value="BREAKFAST">Breakfast</option>
                            <option value="LUNCH">Lunch</option>
                            <option value="DINNER">Dinner</option>
                            <option value="SNACK">Snack</option>
                          </select>
                        </td>
                        <td>
                          <button
                            onClick={() => handleSaveEdit(editingEntry)}
                            className="btn btn-success btn-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingEntry(null)}
                            className="btn btn-secondary btn-sm ms-2"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{new Date(entry.dateTime).toLocaleDateString()}</td>
                        <td>{entry.foodName}</td>
                        <td>{entry.calories}</td>
                        <td>${entry.price.toFixed(2)}</td>
                        <td>{entry.mealType}</td>
                        <td>
                          <div className="button-holder">
                            <button
                              onClick={() => setEditingEntry(entry)}
                              className="btn btn-warning btn-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                  {expandedEntry === entry.id && (
                    <tr>
                      <td colSpan="6" className="bg-light">
                        <strong>Description: </strong>
                        {editingEntry?.id === entry.id ? (
                          <textarea
                            value={editingEntry.description}
                            onChange={e => setEditingEntry({
                              ...editingEntry,
                              description: e.target.value
                            })}
                            className="form-control"
                            rows="3"
                          />
                        ) : (
                          entry.description || 'No description provided.'
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)}


        {showAddEntryModal && (
          <AddFoodEntryModal
            userId={selectedUserId}
            onClose={() => setShowAddEntryModal(false)}
            onSuccess={() => {
              handleViewEntries(selectedUserId, selectedUserName);
              fetchStats();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
