
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/itineraryCSS/Itinerary.css';

const ItineraryModule = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tours');
        if (!response.ok) throw new Error('Failed to fetch tours');
        const data = await response.json();
        setTours(data.tours);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="Tour-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map(tour => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
};

const TourCard = ({ tour }) => {
  return (
    <div className="Tour-card">
      <div className="card-img">
        <img 
          src={`http://localhost:5000${tour.image}`}
          alt={tour.destination} 
        />
      </div>
      
      <div className="card-body">
        <h2 className="card-title">{tour.destination}</h2>
        
        <div className="info-row">
          <span>🚌</span>
          <span>Xuất phát từ {tour.departure_from}</span>
        </div>
        
        <div className="info-row">
          <span>🕒</span>
          <span>{tour.duration}</span>
        </div>
        
        <div className="price-action">
          <div className="price-section">
           
          </div>
          <Link to={`/Itinerary/${tour.id}`} className="btn-book">
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItineraryModule;
