import React from 'react';

const DailyProgress = ({ calories, maxCalories }) => {
  const percentage = (calories / maxCalories) * 100;
  const progressColor =
    percentage > 100 ? 'danger' : percentage > 95 ? 'warning' : 'primary';

  return (
    <div className="animate-slide-in">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="fw-medium">Daily Progress</span>
        <span className={`badge bg-${progressColor}`}>
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="progress" style={{ height: '10px' }}>
        <div
          className={`progress-bar bg-${progressColor}`}
          role="progressbar"
          aria-valuenow={Math.min(percentage, 100)}
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: `${Math.min(percentage, 100)}%` }}
          title={`${percentage.toFixed(1)}% of daily calories consumed`}
        ></div>
      </div>
    </div>
  );
};

export default DailyProgress;
