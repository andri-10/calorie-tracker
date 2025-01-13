import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalEntries: 0,
        activeToday: 0
    });
    const [users, setUsers] = useState([]);
    const [selectedUserEntries, setSelectedUserEntries] = useState([]);
    const [showEntriesModal, setShowEntriesModal] = useState(false);
    const [selectedUserName, setSelectedUserName] = useState('');

    useEffect(() => {
        fetchStats();
        fetchUsers();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setSelectedUserEntries(data);
                setSelectedUserName(userName);
                setShowEntriesModal(true);
            }
        } catch (error) {
            console.error('Error fetching user entries:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    setUsers(users.filter(user => user.id !== userId));
                    fetchStats();
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>CalorieTracker Admin</h1>
                <p>Manage users and their calorie entries</p>
            </div>

            <div className="admin-stats">
                <div className="stat-card">
                    <h3>{stats.totalUsers}</h3>
                    <p>Total Users</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.totalEntries}</h3>
                    <p>Total Entries</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.activeToday}</h3>
                    <p>Active Today</p>
                </div>
            </div>

            <div className="admin-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Last Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{new Date(user.lastActive).toLocaleDateString()}</td>
                                <td className="admin-actions">
                                    <button
                                        className="btn-primary"
                                        onClick={() => handleViewEntries(user.id, user.name)}
                                    >
                                        View Entries
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showEntriesModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Entries for {selectedUserName}</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowEntriesModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="entries-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Food</th>
                                        <th>Calories</th>
                                        <th>Meal Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedUserEntries.map(entry => (
                                        <tr key={entry.id}>
                                            <td>{new Date(entry.date).toLocaleDateString()}</td>
                                            <td>{entry.food}</td>
                                            <td>{entry.calories}</td>
                                            <td>{entry.mealType}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;