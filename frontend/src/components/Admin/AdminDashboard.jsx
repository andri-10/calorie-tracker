import React, { useState, useEffect } from 'react';
import "./AdminDashboard.css";
import Navbar from '../Dashboard/Navbar';
const AdminDashboard = () => {
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

  useEffect(() => {
    fetchStats();
    fetchUsers();

    // Set an interval to update stats in real time
    const intervalId = setInterval(() => {
      fetchStats();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
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
      const response = await fetch('http://localhost:8080/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
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
      const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/entries`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedUserEntries(data); // Assuming 'data' contains the entries array
        setSelectedUserName(userName);
  
        // Get today's date and the date from 7 days ago
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
  
        // Filter entries for the last 7 days
        const recentEntries = data.filter(entry => {
          const entryDate = new Date(entry.dateTime);
          return entryDate >= lastWeek && entryDate <= today;
        });
  
        // Calculate the total calories for the filtered entries
        const totalCalories = recentEntries.reduce((sum, entry) => sum + entry.calories, 0);
        
        // Calculate the average calories for the last week
        const averageCalories = recentEntries.length > 0 ? totalCalories / recentEntries.length : 0;
  
        // Directly set the average calories for the user for the last week
        setUserAverageCalories(averageCalories);
  
        setShowEntriesModal(true);
      }
    } catch (error) {
      console.error('Error fetching user entries:', error);
    }
  };
  
  
  
  const handleUpdateEntry = async (entryId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/entries/${entryId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
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
        const response = await fetch(`http://localhost:8080/api/admin/entries/${entryId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        if (response.ok) {
          // Remove the entry from the local state
          setSelectedUserEntries(entries => entries.filter(entry => entry.id !== entryId));

          // Fetch updated stats to reflect the change
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

              </div>
              <div className="modal-body">
                <h6>Average calories for this user last week: {userAverageCalories.toFixed(2)} kcal</h6>
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
    </div>
  );
};

export default AdminDashboard;
