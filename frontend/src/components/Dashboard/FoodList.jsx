import React, { useState } from 'react';

const FoodList = () => {
  const [foodEntries, setFoodEntries] = useState([
    { id: 1, name: 'Breakfast', calories: 450, price: 5.99, time: '08:30' },
    { id: 2, name: 'Lunch', calories: 650, price: 8.99, time: '12:30' },
  ]);

  const handleDelete = (id) => {
    setFoodEntries(entries => entries.filter(entry => entry.id !== id));
  };

  return (
    <div className="card border-0 shadow-sm animate-fade-in">
      <div className="card-body">
        <h5 className="card-title text-primary fw-bold mb-4">Today's Entries</h5>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Time</th>
                <th>Food</th>
                <th>Calories</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foodEntries.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.time}</td>
                  <td>{entry.name}</td>
                  <td>{entry.calories}</td>
                  <td>€{entry.price}</td>
                  <td>
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(entry.id)}
                    >
                      Delete 
                    </button>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FoodList;