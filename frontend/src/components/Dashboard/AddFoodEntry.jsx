import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const AddFoodEntry = () => {
  const [foodEntry, setFoodEntry] = useState({
    foodName: '',
    calories: '',
    price: '',
    mealType: '',
    description: '',
    dateTime: new Date().toISOString().slice(0, 16)
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Get token when component mounts
    const storedToken = localStorage.getItem('jwtToken');
    setToken(storedToken);
    
    // Debug log - remove in production
    console.log('Token from localStorage:', storedToken);
  }, []);

  const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      // Get token again in case it was updated
      const currentToken = localStorage.getItem('jwtToken');
      
      // Debug log - remove in production
      console.log('Token at submission:', currentToken);

      if (!currentToken) {
        throw new Error('Not authenticated - No token found');
      }

      const response = await fetch('http://localhost:8080/api/food-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          foodName: foodEntry.foodName,
          calories: parseInt(foodEntry.calories),
          price: parseFloat(foodEntry.price),
          mealType: foodEntry.mealType,
          description: foodEntry.description,
          dateTime: new Date(foodEntry.dateTime).toISOString()
        })
      });

      // Debug log - remove in production
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.log('Error response:', errorData);
        throw new Error(`Failed to add food entry: ${errorData}`);
      }

      setSuccess(true);
      setFoodEntry({
        foodName: '',
        calories: '',
        price: '',
        mealType: '',
        description: '',
        dateTime: new Date().toISOString().slice(0, 16)
      });
    } catch (err) {
      setError(err.message);
      console.error('Submission error:', err);
    }
  };

  // If no token is found, show a message
  if (!token) {
    return (
      <div className="min-vh-100 bg-light">
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
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
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
                  {/* Rest of the form remains the same */}
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
                    <label className="form-label fw-medium">Date and Time</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={foodEntry.dateTime}
                      onChange={(e) => setFoodEntry({...foodEntry, dateTime: e.target.value})}
                      required
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