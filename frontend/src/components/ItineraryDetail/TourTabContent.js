

import React from 'react';

const DEFAULT_NOTES = [
  "Quý khách vui lòng mang theo giấy tờ tùy thân (CMND/CCCD).",
  "Lịch trình có thể thay đổi tùy theo điều kiện thời tiết và tình hình thực tế.",
  "Trẻ em dưới 2 tuổi miễn phí, từ 2-5 tuổi tính 50% giá tour, từ 6 tuổi trở lên tính như người lớn.",
  "Quý khách nên mang theo thuốc đau bụng, cảm sốt, thuốc chống say xe.",
];

const TourTabContent = ({ tour, activeTab, reviews }) => {
  if (activeTab === 'overview') {
    return (
      <div className="tab-content">
      <div className="tour-description">
        <h2>Giới thiệu tour</h2>
        <p>{tour.description}</p>
      </div>
      <div className="tour-highlights">
        <h2>Điểm nổi bật</h2>
        <ul>
        {tour.highlights.map((highlight, index) => (
          <li key={index}>{highlight}</li>
        ))}
        </ul>
      </div>
      {tour.locations && tour.locations.length > 0 && (
        <div className="tour-locations">
        <h2>Điểm đến trong hành trình</h2>
        <div className="locations-grid">
          {tour.locations.map((location, index) => (
          <div className="location-item" key={index}>
            <h3>
            <a href={`/locations/${location.id}`} className="location-link">
              {location.name}
            </a>
            </h3>
            {/* <p>{location.type}</p> */}
            <p className="location-description">{location.description?.slice(0, 100)}...</p>
          </div>
          ))}
        </div>
        </div>
      )}
      </div>
    );
  }

  if (activeTab === 'schedule') {
    return (
      <div className="tab-content">
      <h2>Lịch trình tour</h2>
      <div className="schedule-container">
        {tour.schedule.map((day, index) => (
        <div className="schedule-day" key={index}>
          <div className="day-header">
          <h3>{day.day}</h3>
          <h4>{day.title}</h4>
          </div>
          <div className="day-activities">
          <ul>
            {day.activities.map((activity, actIndex) => (
            <li key={actIndex}>{activity}</li>
            ))}
          </ul>
          </div>
          {/* Hiển thị các địa điểm trong ngày */}
          {day.locations && day.locations.length > 0 && (
          <div className="day-locations">
            <h4>Điểm đến trong ngày:</h4>
            <div className="locations-list">
            {day.locations.map((location, locIndex) => (
              <div className="day-location-item" key={locIndex}>
              <a
                href={`/locations/${location.id}`}
                className="location-name"
              >
                {location.name}
              </a>
              {location.type && <span className="location-type">({location.type})</span>}
              </div>
            ))}
            </div>
          </div>
          )}
        </div>
        ))}
      </div>
      </div>
    );
  }

  if (activeTab === 'info') {
    return (
      <div className="tab-content">
        {/* <div className="tour-includes">
          <h2>Giá tour bao gồm</h2>
          <ul>
            {tour.includes.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="tour-excludes">
          <h2>Giá tour không bao gồm</h2>
          <ul>
            {tour.excludes.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div> */}
        <div className="tour-notes">
          <h2>Lưu ý</h2>
          <ul>
            {(tour.notes && tour.notes.length > 0 ? tour.notes : DEFAULT_NOTES).map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (activeTab === 'reviews') {
    return (
      <div className="tab-content">
        <div className="reviews-header">
          <h2>Đánh giá từ khách hàng</h2>
          <button className="add-review-btn">
            <i className="bi bi-plus-circle"></i> Viết đánh giá
          </button>
        </div>
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map(review => (
              <div className="review-item" key={review.id}>
                <div className="review-header">
                  <div className="review-user">
                    <strong>{review.user}</strong>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="review-comment">{review.comment}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reviews">
            <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá tour này!</p>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default TourTabContent;