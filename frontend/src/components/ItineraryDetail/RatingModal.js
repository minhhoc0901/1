import React from 'react';

const RatingModal = ({
  show,
  onClose,
  rating,
  setRating,
  reviewText,
  setReviewText,
  onSubmit,
}) => {
  if (!show) return null;

  return (
    <div className="rating-modal-overlay">
      <div className="rating-modal">
        <div className="rating-modal-header">
          <h3>Đánh giá tour</h3>
          <button className="close-modal" onClick={onClose}>
            <i className="bi bi-x" />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="star-rating">
            <p>Đánh giá của bạn: <span className="required">*</span></p>
            <div className="stars">
              {[1, 2, 3, 4, 5].map(star => (
                <i
                  key={star}
                  className={`bi ${rating >= star ? 'bi-star-fill' : 'bi-star'}`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            {rating === 0 && <span className="rating-error">Vui lòng chọn đánh giá</span>}
          </div>
          <div className="review-input">
            <label htmlFor="review">Nhận xét của bạn:</label>
            <textarea
              id="review"
              rows="4"
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về tour này..."
              disabled={rating === 0}
            />
            {rating === 0 && (
              <p className="comment-disabled-note">Vui lòng đánh giá sao trước khi viết nhận xét</p>
            )}
          </div>
          <button
            type="submit"
            className="submit-rating"
            disabled={rating === 0}
          >
            Gửi đánh giá
          </button>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;