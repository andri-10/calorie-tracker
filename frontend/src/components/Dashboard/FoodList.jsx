import React, { useState, useEffect } from 'react';

const FoodList = ({ updateStatsAfterDeletion }) => { 
  const [foodEntries, setFoodEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodEntries = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight

        const timezoneOffset = today.getTimezoneOffset(); 
        today.setMinutes(today.getMinutes() - timezoneOffset);

        const dateParam = today.toISOString().split('.')[0]; 
        const token = localStorage.getItem('jwtToken');
        
        const response = await fetch(`http://localhost:8080/api/food-entries/daily?date=${dateParam}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch food entries');
        }

        const data = await response.json();
        setFoodEntries(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodEntries();
  }, []); 

  const deleteFoodEntry = async (foodEntryId, calories, price) => {
    try {
      const token = localStorage.getItem('jwtToken');

      const response = await fetch(`http://localhost:8080/api/food-entries/${foodEntryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete food entry');
      }

      // Update the stats in the parent component after deletion
      updateStatsAfterDeletion({ calories, price });

      // Remove the deleted entry from the local state
      setFoodEntries(foodEntries.filter(entry => entry.id !== foodEntryId));

    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Check if there are no food entries
  if (foodEntries.length === 0) {
    return (
      <div className="card border-0 shadow-sm animate-fade-in">
        <div className="card-body">
          <h5 className="card-title text-primary fw-bold mb-4">Today's Entries</h5>
          <p>No entries for today</p>
        </div>
      </div>
    );
  }

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
                  <td>{entry.formattedTime}</td>
                  <td>{entry.foodName}</td>
                  <td>{entry.calories}</td>
                  <td>€{entry.price}</td>
                  <td>
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteFoodEntry(entry.id, entry.calories, entry.price)} 
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
