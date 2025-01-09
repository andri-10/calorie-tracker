import React, { useState } from 'react';
import Navbar from './Navbar';

const AddFoodEntry = () => {
  const [foodEntry, setFoodEntry] = useState({
    name: '',
    calories: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add API call here
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="text-primary fw-bold mb-4">Add Food Entry</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Food Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={foodEntry.name}
                      onChange={(e) => setFoodEntry({...foodEntry, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Calories</label>
                    <input
                      type="number"
                      className="form-control"
                      value={foodEntry.calories}
                      onChange={(e) => setFoodEntry({...foodEntry, calories: e.target.value})}
                      required
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
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={foodEntry.date}
                        onChange={(e) => setFoodEntry({...foodEntry, date: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={foodEntry.time}
                        onChange={(e) => setFoodEntry({...foodEntry, time: e.target.value})}
                        required
                      />
                    </div>
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