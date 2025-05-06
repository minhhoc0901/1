// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import '../../styles/itineraryCSS/ItineraryDetail.css';

// const ItineraryDetail = () => {
//   const { id } = useParams();
//   const [tour, setTour] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchTour = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/tours/${id}`);
//         if (!response.ok) {
//           throw new Error('Không thể tải thông tin tour');
//         }
//         const data = await response.json();
//         setTour(data.tour);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchTour();
//   }, [id]);

//   if (loading) {
//     return <div className="loading-container">Đang tải thông tin...</div>;
//   }

//   if (error) {
//     return <div className="error-container">Lỗi: {error}</div>;
//   }

//   if (!tour) {
//     return <div className="error-container">Không tìm thấy thông tin tour</div>;
//   }

//   return (
//     <div className="tour-detail-container">
//       <h1>{tour.destination}</h1>
//       <div className="tour-schedule">
//         <h2>Lịch trình</h2>
//         {tour.schedule.map((day, index) => (
//           <div key={index} className="schedule-day">
//             <h3>{day.day}</h3>
//             <h4>{day.title}</h4>
//             <ul>
//               {day.activities.map((activity, actIndex) => {
//                 // Kiểm tra nếu hoạt động chứa tên địa điểm, thêm liên kết
//                 const locationMatch = activity.match(/Tham quan (.+)/i);
//                 const locationName = locationMatch ? locationMatch[1] : null;

//                 return (
//                   <li key={actIndex}>
//                     {locationName ? (
//                       <Link to={`/locations/${locationName.trim()}`}>
//                         {activity}
//                       </Link>
//                     ) : (
//                       activity
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ItineraryDetail;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/itineraryCSS/Itinerary.css';
import img1 from '../../assets/uploads/locations/1/1-exp-3.jpg';
import img2 from '../../assets/uploads/locations/2/2-exp-3.jpg';
import img3 from '../../assets/uploads/locations/3/3-exp-2.jpg';
import img4 from '../../assets/uploads/locations/4/4-arch.jpg';
import img5 from '../../assets/uploads/locations/5/5-exp-3.jpg';
import img6 from '../../assets/uploads/locations/6/4.jpg';

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

  if (loading) return (
    <div className="container mx-auto p-4">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải danh sách tour...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mx-auto p-4">
      <div className="error-container">
        <h2>Đã xảy ra lỗi</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="refresh-button">
          Thử lại
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="tours-heading">Các Tour du lịch Phú Yên</h1>
      <div className="Tour-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.length > 0 ? (
          tours.map(tour => (
            <TourCard key={tour.id} tour={tour} />
          ))
        ) : (
          <div className="no-tours-message">
            <p>Không có tour nào hiện tại. Vui lòng quay lại sau.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const imageMap = {
  "/assets/uploads/locations/1/1-exp-3.jpg": img1,
  "/assets/uploads/locations/2/2-exp-3.jpg": img2,
  "/assets/uploads/locations/3/3-exp-2.jpg": img3,
  "/assets/uploads/locations/4/4-arch.jpg": img4,
  "/assets/uploads/locations/5/5-exp-3.jpg": img5,
  "/assets/uploads/locations/6/4.jpg": img6,
};

const TourCard = ({ tour }) => {
  // Tạo danh sách các địa điểm trong tour
  const locationNames = tour.locations ? tour.locations.map(loc => loc.name).join(', ') : '';
  
  return (
    <div className="Tour-card">
      <div className="card-img">
        <img 
          src={imageMap[tour.image] || img1} 
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
        
        {locationNames && (
          <div className="info-row locations">
            <span>📍</span>
            <span className="location-list">{locationNames}</span>
          </div>
        )}
        
        <div className="price-action">
          <div className="price-section">
            {/* Có thể thêm thông tin giá nếu có */}
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