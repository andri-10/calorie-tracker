import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEntries: 0,
    activeToday: 0,
    lastWeekEntries: 0,
    weekBeforeEntries: 0,
    averageCaloriesPerUser: 0,
    usersOverBudget: []
  });
  const [users, setUsers] = useState([]);
  const [selectedUserEntries, setSelectedUserEntries] = useState([]);
  const [showEntriesModal, setShowEntriesModal] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    checkAdminRights();
    fetchStats();
    fetchUsers();
  }, []);

  const checkAdminRights = () => {
    const tokenData = localStorage.getItem('jwtToken');
      
    if (!tokenData) {
      navigate('/404');
      return;
    }
  
    try {
      const { value, timestamp, expiresIn } = JSON.parse(tokenData);
      const now = new Date().getTime();
  
      if (now - timestamp > expiresIn) {
        localStorage.removeItem('jwtToken');
        navigate('/404');
        return;
      }
  
      const decodedToken = jwtDecode(value);
      if (decodedToken.role !== 'ADMIN') {
        navigate('/404');
      }
    } catch (error) {
      console.error('Error verifying admin access:', error);
      navigate('/404');
    }
  };


  const getAxiosConfig = () => {
    const tokenData = localStorage.getItem('jwtToken');
    if (!tokenData) return {};
    
    const { value } = JSON.parse(tokenData);
    return {
      headers: {
        'Authorization': `Bearer ${value}`,
      }
    };
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/admin/stats',
        getAxiosConfig()
      );
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/admin/users',
        getAxiosConfig()
      );
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  const handleViewEntries = async (userId, userName) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/users/${userId}/entries`,
        getAxiosConfig()
      );
      setSelectedUserEntries(response.data);
      setSelectedUserName(userName);
      setShowEntriesModal(true);
    } catch (error) {
      console.error('Error fetching user entries:', error);
    }
  };
  
  const handleUpdateEntry = async (entryId, updatedData) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/admin/entries/${entryId}`,
        updatedData,
        getAxiosConfig()
      );
      setEditingEntry(null);
      setSelectedUserEntries(entries =>
        entries.map(entry =>
          entry.id === entryId ? response.data : entry
        )
      );
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };
  
  const handleDeleteEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(
          `http://localhost:8080/api/admin/entries/${entryId}`,
          getAxiosConfig()
        );
        setSelectedUserEntries(entries => 
          entries.filter(entry => entry.id !== entryId)
        );
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
    <div className="container p-4">
      <div className="text-center mb-4">
        <h1 className="display-4 text-primary">CalorieTracker Admin Dashboard</h1>
        <p className="lead text-muted">System Analytics and Management</p>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-primary">{stats.totalUsers}</h3>
              <p className="card-text">Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-primary">{stats.averageCaloriesPerUser.toFixed(0)}</h3>
              <p className="card-text">Avg. Calories/User (Last 7 Days)</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-primary">{stats.activeToday}</h3>
              <p className="card-text">Active Today</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
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

        <div className="col-md-6">
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
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowEntriesModal(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <table className="table table-striped">
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
                      <tr key={entry.id}>
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
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Snack">Snack</option>
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
                              <button
                                onClick={() => setEditingEntry(entry)}
                                className="btn btn-warning btn-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteEntry(entry.id)}
                                className="btn btn-danger btn-sm ms-2"
                              >
                                Delete
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEntriesModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
