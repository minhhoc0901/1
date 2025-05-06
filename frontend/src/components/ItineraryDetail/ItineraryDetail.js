
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TourHeader from './TourHeader';
import TourNavigation from './TourNavigation';
import TourContent from './TourContent';
import '../../styles/itineraryCSS/ItineraryDetail.css';

const ItineraryDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([
    { id: 1, user: "Nguyễn Văn A", rating: 5, comment: "Tour rất tuyệt vời, phong cảnh đẹp, dịch vụ chu đáo!", date: "15/04/2025" },
    { id: 2, user: "Trần Thị B", rating: 4, comment: "Tôi rất hài lòng với chuyến đi này, chỉ tiếc là thời gian hơi ngắn.", date: "02/04/2025" },
  ]);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tours/${id}`);
        if (!response.ok) throw new Error('Không thể tải thông tin tour');
        const data = await response.json();
        const fetchedTour = data.tour;

        // Bổ sung dữ liệu nếu thiếu
        const days = parseInt(fetchedTour.duration.split(' ')[0]) || 1;
        const destinationParts = fetchedTour.destination.split('|').map(part => part.trim());

        fetchedTour.description = fetchedTour.description || 
          `Tour khám phá vẻ đẹp của ${fetchedTour.destination}. Hành trình ${fetchedTour.duration} xuất phát từ ${fetchedTour.departure_from}.`;
        fetchedTour.highlights = fetchedTour.highlights?.length > 0 ? fetchedTour.highlights : [
          `Khám phá vùng đất ${destinationParts[0]}`,
          `Tham quan ${destinationParts[1] || 'các thắng cảnh nổi tiếng'}`,
          `Trải nghiệm văn hóa và ẩm thực địa phương`,
        ];
        
        // Nếu schedule không có locations, thêm các địa điểm từ tour.locations vào
        if (fetchedTour.schedule?.length > 0) {
          fetchedTour.schedule.forEach((day, index) => {
            if (!day.locations || day.locations.length === 0) {
              const dayLocations = fetchedTour.locations?.filter(
                loc => fetchedTour.schedule[index]?.locations?.some(
                  dayLoc => dayLoc.id === loc.id
                )
              );
              day.locations = dayLocations || [];
            }
          });
        } else {
          fetchedTour.schedule = Array.from({ length: days }, (_, i) => ({
            day: `Ngày ${i + 1}`,
            title: `NGÀY ${i + 1}: ${destinationParts[i] || 'KHÁM PHÁ ĐỊA PHƯƠNG'}`,
            activities: [
              "06:00: Dùng bữa sáng tại khách sạn",
              "08:00: Khởi hành tham quan các điểm du lịch",
              "12:00: Dùng bữa trưa tại nhà hàng địa phương",
              "14:00: Tiếp tục hành trình khám phá",
              "18:00: Dùng bữa tối, nghỉ ngơi tại khách sạn",
            ],
            locations: fetchedTour.locations?.filter((_, locationIndex) => locationIndex % days === i) || []
          }));
        }
        
        fetchedTour.includes = fetchedTour.includes?.length > 0 ? fetchedTour.includes : [
          "Xe du lịch đời mới máy lạnh",
          "Khách sạn tiêu chuẩn 3 sao (2 người/phòng)",
          "Các bữa ăn theo chương trình",
          "Hướng dẫn viên nhiệt tình, kinh nghiệm",
          "Vé tham quan các điểm theo lịch trình",
          "Bảo hiểm du lịch",
        ];
        fetchedTour.excludes = fetchedTour.excludes?.length > 0 ? fetchedTour.excludes : [
          "Chi phí cá nhân, đồ uống",
          "Các chi phí không được đề cập trong mục bao gồm",
          "Tiền tip cho hướng dẫn viên và tài xế",
        ];

        setTour(fetchedTour);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;

    const newReview = {
      id: reviews.length + 1,
      user: "Khách hàng",
      rating,
      comment: reviewText,
      date: new Date().toLocaleDateString('vi-VN'),
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setReviewText('');
    setShowRatingModal(false);
    alert('Cảm ơn bạn đã đánh giá!');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin tour...</p>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="error-container">
        <h2>Không tìm thấy thông tin tour</h2>
        <p>Tour với ID {id} không tồn tại hoặc đã bị xóa.</p>
        <Link to="/Itinerary" className="back-button">Quay lại danh sách tour</Link>
      </div>
    );
  }

  return (
    <div className="tour-detail-container">
      <TourHeader tour={tour} />
      <TourNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <TourContent
        tour={tour}
        activeTab={activeTab}
        reviews={reviews}
        showRatingModal={showRatingModal}
        setShowRatingModal={setShowRatingModal}
        rating={rating}
        setRating={setRating}
        reviewText={reviewText}
        setReviewText={setReviewText}
        handleRatingSubmit={handleRatingSubmit}
      />
    </div>
  );
};

export default ItineraryDetail;