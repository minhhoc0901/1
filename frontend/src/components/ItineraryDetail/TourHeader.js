

import React from 'react';

const TourHeader = ({ tour }) => {
  const backgroundImage = tour.image ? `http://localhost:5000${tour.image}` : '/assets/uploads/locations/1/1-exp-3.jpg';

  return (
    <div 
      className="tour-header" 
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})` }}
    >
      <div className="tour-header-content">
        <h1>{tour.destination}</h1>
        <div className="tour-basic-info">
          <div className="info-item">
            <span className="icon">🚌</span>
            <span>Xuất phát từ {tour.departure_from}</span>
          </div>
          <div className="info-item">
            <span className="icon">🕒</span>
            <span>{tour.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourHeader;