import React from 'react';
const MonthlyProgress = ({ spending, maxSpending }) => {
  const percentage = (spending / maxSpending) * 100;
  const progressColor =
    percentage > 100 ? 'danger' : percentage > 95 ? 'warning' : 'success';
  return (
    <div className="animate-slide-in">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="fw-medium">Budget Progress</span>
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
          title={`${percentage.toFixed(1)}% of monthly budget spent`}
        ></div>
      </div>
    </div>
  );
};
export default MonthlyProgress;