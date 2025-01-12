import React, { useState, useEffect } from 'react';

const FoodList = () => {
  const [foodEntries, setFoodEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodEntries = async () => {
      try {
        // Get today's date in the local timezone
        const today = new Date();

        // Adjust the date to local midnight (00:00:00) by setting hours, minutes, seconds, and milliseconds to 0
        today.setHours(0, 0, 0, 0); 

        // Get the offset in minutes for your local time zone
        const timezoneOffset = today.getTimezoneOffset(); 

        // Adjust the date to reflect the local time zone offset
        today.setMinutes(today.getMinutes() - timezoneOffset);

        // Convert the adjusted date to ISO string (without milliseconds)
        const dateParam = today.toISOString().split('.')[0];  // This will be in UTC format, but reflect the local timezone's midnight

        const token = localStorage.getItem('jwtToken');
        
        const response = await fetch(`http://localhost:8080/api/food-entries/daily?date=${dateParam}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const textResponse = await response.text();  // Get raw response as text

        if (!response.ok) {
          throw new Error('Failed to fetch food entries');
        }

        const data = JSON.parse(textResponse);  // Parse the response as JSON
        setFoodEntries(data);  // Update state with fetched data
      } catch (error) {
        setError(error.message);  // Set error message if something fails
      } finally {
        setLoading(false);  // Stop loading indicator
      }
    };

    fetchFoodEntries();  // Call the function when component mounts
  }, []);  // Empty dependency array means it runs only once on mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
                    <button className="btn btn-outline-danger btn-sm">
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