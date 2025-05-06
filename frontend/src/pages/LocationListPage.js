import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LocationCSS/LocationListPage.css';


function ApiLocationList() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Gọi API để lấy danh sách địa điểm
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/locations', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Không thể lấy dữ liệu địa điểm');
                }
                const data = await response.json();
                setLocations(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    if (loading) return <div className="location-list-page"><p>Đang tải dữ liệu...</p></div>;
    if (error) return <div className="location-list-page"><p>Lỗi: {error}</p></div>;

    return (
            <div className="location-list-page container mx-auto p-4">
              <h1>Khám Phá Các Địa Điểm Nổi Bật Tại Phú Yên</h1>
              <div className="location-grid">
                {locations.map((location) => (
                  <div key={location.id} className="location-card">
                    <Link to={`/locations/${location.id}`}>
                      <img
                        src={location.introduction.image ? `http://localhost:5000${location.introduction.image}` : 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={location.title}
                       
                      />
                    </Link>
                    <h2>{location.title}</h2>
                    <p>{location.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
        
    );
    
}


export default ApiLocationList;
