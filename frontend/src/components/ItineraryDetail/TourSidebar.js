

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const TourSidebar = ({ tour }) => {
  const getMapCenter = () => {
    if (!tour.locations || tour.locations.length === 0) {
      return [13.0935, 109.3228];
    }
    const sumLat = tour.locations.reduce((sum, loc) => sum + parseFloat(loc.latitude || 0), 0);
    const sumLng = tour.locations.reduce((sum, loc) => sum + parseFloat(loc.longitude || 0), 0);
    return [sumLat / tour.locations.length, sumLng / tour.locations.length];
  };

  const mapCenter = getMapCenter();

  // Create polyline coordinates from locations
  const polylinePoints = tour.locations?.map(loc => [
    parseFloat(loc.latitude),
    parseFloat(loc.longitude)
  ]) || [];

  const customIcon = (index) => L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: #007bff; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">${index + 1}</div>`,
  });

  return (
    <div className="tour-sidebar">
      <div className="booking-card">
        {/* <div className="contact-info">
          <p><strong>Liên hệ đặt tour:</strong></p>
          <p>☎️ Hotline: 0123.456.789</p>
          <p>📧 Email: booking@example.com</p>
        </div> */}

        {tour.locations && tour.locations.length > 0 && (
          <div className="tour-map">
            <h3>Bản đồ tour</h3>
            <MapContainer 
              center={mapCenter} 
              zoom={10} 
              style={{ height: '400px', width: '100%', borderRadius: '8px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {tour.locations.map((loc, index) => (
                <Marker
                  key={index}
                  position={[parseFloat(loc.latitude), parseFloat(loc.longitude)]}
                  icon={customIcon(index)}
                >
                  <Popup>
                    <div style={{ padding: '5px' }}>
                      <strong>{loc.name || `Điểm ${index + 1}`}</strong>
                      {loc.description && <p>{loc.description}</p>}
                    </div>
                  </Popup>
                </Marker>
              ))}
              <Polyline 
                positions={polylinePoints}
                color="#007bff"
                weight={3}
                opacity={0.7}
              />
            </MapContainer>
            <div className="map-legend" style={{ marginTop: '10px', fontSize: '14px' }}>
              <p>🚩 Tổng cộng: {tour.locations.length} điểm dừng</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourSidebar;