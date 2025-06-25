import React from 'react';

const RatingSummary = ({ rating = 0 }) => {
  const stars = Math.round(rating);

  return (
    <div className="rating-summary">
      <label className="rating-label">التقييم العام:</label>
      <div className="rating-stars">
        {Array.from({ length: 1 }, (_, i) => (
          <span key={i}>{i < stars ? '⭐' : '☆'}</span>
        ))}
        <span className="rating-value">({rating.toFixed(1)})</span>
      </div>
    </div>
  );
};

export default RatingSummary;
