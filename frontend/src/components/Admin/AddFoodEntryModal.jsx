import React, { useState } from 'react';

const AddFoodEntryModal = ({ userId, onClose, onSuccess }) => {
  const [foodEntry, setFoodEntry] = useState({
    foodName: '',
    calories: '',
    price: '',
    mealType: '',
    description: ''
  });

  const [error, setError] = useState('');
  const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        body: JSON.stringify({
          ...foodEntry,
          calories: parseInt(foodEntry.calories),
          price: parseFloat(foodEntry.price),
          dateTime: new Date().toISOString()
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add food entry.');
      }
    } catch (error) {
      setError('An error occurred while submitting the food entry.');
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Food Entry</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Food Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={foodEntry.foodName}
                  onChange={(e) => setFoodEntry({...foodEntry, foodName: e.target.value})}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Meal Type</label>
                <select
                  className="form-select"
                  value={foodEntry.mealType}
                  onChange={(e) => setFoodEntry({...foodEntry, mealType: e.target.value})}
                  required
                >
                  <option value="" disabled>Select meal type</option>
                  {mealTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Calories</label>
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
                <label className="form-label">Price (€)</label>
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
                <label className="form-label">Description (Optional)</label>
                <textarea
                  className="form-control"
                  value={foodEntry.description}
                  onChange={(e) => setFoodEntry({...foodEntry, description: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFoodEntryModal;