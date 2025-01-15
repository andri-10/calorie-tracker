import React, { useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const AddFoodEntry = () => {
  const [foodEntry, setFoodEntry] = useState({
    foodName: '',
    calories: '',
    price: '',
    mealType: '',
    description: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];

  const getToken = () => {
    const tokenData = localStorage.getItem('jwtToken');
    if (!tokenData) {
      window.location.href = '/login';
      return null;
    }

    try {
      const { value, timestamp, expiresIn } = JSON.parse(tokenData);
      const now = new Date().getTime();

      if (now - timestamp > expiresIn) {
        localStorage.removeItem('jwtToken');
        window.location.href = '/login';
        return null;
      }

      return value;
    } catch (error) {
      localStorage.removeItem('jwtToken');
      window.location.href = '/login';
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const token = getToken();
    if (!token) return;

    try {
      const response = await axios.post(
        'http://localhost:8080/api/food-entries',
        {
          ...foodEntry,
          calories: parseInt(foodEntry.calories, 10),
          price: parseFloat(foodEntry.price),
          dateTime: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setFoodEntry({
          foodName: '',
          calories: '',
          price: '',
          mealType: '',
          description: '',
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred.');
    }
  };

  // Initial token check
  const token = getToken();
  if (!token) {
    return (
      <div className="min-vh-100 bg-light p-0">
        <Navbar />
        <div className="container py-4">
          <div className="alert alert-warning">
            You are not logged in. Please log in to add food entries.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light p-0">
      <Navbar />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 card-hover animate-fade-in">
                <h2 className="text-primary fw-bold mb-4">Add Food Entry</h2>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success" role="alert">
                    Food entry added successfully!
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Food Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={foodEntry.foodName}
                      onChange={(e) => setFoodEntry({...foodEntry, foodName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">Meal Type</label>
                    <select
                      className="form-select"
                      value={foodEntry.mealType}
                      onChange={(e) => setFoodEntry({...foodEntry, mealType: e.target.value})}
                      required
                    >
                      <option value="">Select meal type</option>
                      {mealTypes.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">Calories</label>
                    <input
                      type="number"
                      className="form-control"
                      value={foodEntry.calories}
                      onChange={(e) => setFoodEntry({...foodEntry, calories: e.target.value})}
                      required
                      min="0"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">Price (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={foodEntry.price}
                      onChange={(e) => setFoodEntry({...foodEntry, price: e.target.value})}
                      required
                      min="0"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">Description (Optional)</label>
                    <textarea
                      className="form-control"
                      value={foodEntry.description}
                      onChange={(e) => setFoodEntry({...foodEntry, description: e.target.value})}
                      rows="3"
                    />
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg">
                      Add Entry
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFoodEntry;