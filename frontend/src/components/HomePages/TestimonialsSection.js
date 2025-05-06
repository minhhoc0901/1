import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../styles/HomePageCSS/TestimonialsSection.css';

// Import ảnh đại diện cho khách du lịch
import avatar1 from '../../assets/images/avatar-1.jpg'; 
import avatar2 from '../../assets/images/avatar-2.jpg';
import avatar3 from '../../assets/images/avatar-3.jpg';
import avatar4 from '../../assets/images/avatar-4.jpg';

const TestimonialsSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isManualChange, setIsManualChange] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const autoPlayRef = useRef(null);
    const testimonials = [
        {
            id: 1,
            author: "Nguyễn Thanh Hà",
            position: "Blogger Du lịch",
            avatar: avatar1,
            rating: 5,
            content: "Phú Yên là một địa điểm du lịch tuyệt vời với những bãi biển hoang sơ, đặc biệt là Bãi Xép - nơi tôi đã có những bức ảnh đẹp nhất trong chuyến đi. Ẩm thực địa phương phong phú, hải sản tươi ngon và giá cả phải chăng.",
            date: "Tháng 3, 2023"
        },
        {
            id: 2,
            author: "Trần Minh Đức",
            position: "Nhiếp ảnh gia",
            avatar: avatar2,
            rating: 5,
            content: "Gành Đá Đĩa là một kỳ quan thiên nhiên độc đáo mà bất kỳ ai đến Phú Yên đều phải ghé thăm. Những khối đá xếp chồng lên nhau tạo nên một khung cảnh ngoạn mục, đặc biệt khi hoàng hôn. Tôi đã có những tấm hình tuyệt vời tại đây!",
            date: "Tháng 5, 2023"
        },
        {
            id: 3,
            author: "Lê Thị Phương",
            position: "Doanh nhân",
            avatar: avatar3,
            rating: 4,
            content: "Chuyến đi Phú Yên là một quyết định tuyệt vời cho kỳ nghỉ ngắn ngày của gia đình tôi. Con tôi thích thú với biển Bãi Xép và những hoạt động thú vị tại đây. Mọi người đều rất thân thiện và nhiệt tình giúp đỡ du khách.",
            date: "Tháng 2, 2023"
        },
        {
            id: 4,
            author: "Hoàng Văn Nam",
            position: "Kỹ sư phần mềm",
            avatar: avatar4,
            rating: 5,
            content: "Mũi Điện với ngọn hải đăng cổ là điểm đến không thể bỏ qua khi đến Phú Yên. Được đón bình minh đầu tiên trên đất liền tại đây là một trải nghiệm tuyệt vời. Nhà nghỉ ở đây sạch sẽ, giá cả hợp lý và dịch vụ rất tốt.",
            date: "Tháng 7, 2023"
        }
    ];

    // Định nghĩa changeSlide bằng useCallback TRƯỚC khi sử dụng trong useEffect
    const changeSlide = useCallback((index) => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        setActiveIndex(index);
        
        // Reset animation after transition completes
        setTimeout(() => {
            setIsAnimating(false);
        }, 700);
    }, [isAnimating]);

    // Thiết lập auto play
    useEffect(() => {
        const playNext = () => {
            if (!isManualChange) {
                changeSlide((activeIndex + 1) % testimonials.length);
            }
            setIsManualChange(false);
        };

        autoPlayRef.current = setTimeout(playNext, 5000);

        return () => {
            if (autoPlayRef.current) {
                clearTimeout(autoPlayRef.current);
            }
        };
    }, [activeIndex, isManualChange, testimonials.length, changeSlide]);

    // Xử lý chuyển đổi slide
    const handleNext = () => {
        changeSlide((activeIndex + 1) % testimonials.length);
        setIsManualChange(true);
        if (autoPlayRef.current) {
            clearTimeout(autoPlayRef.current);
        }
    };

    const handlePrev = () => {
        changeSlide((activeIndex - 1 + testimonials.length) % testimonials.length);
        setIsManualChange(true);
        if (autoPlayRef.current) {
            clearTimeout(autoPlayRef.current);
        }
    };

    const handleDotClick = (index) => {
        changeSlide(index);
        setIsManualChange(true);
        if (autoPlayRef.current) {
            clearTimeout(autoPlayRef.current);
        }
    };

    // Render dấu sao đánh giá
    const renderStars = (rating) => {
        return (
            <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                    <i 
                        key={i} 
                        className={`bi ${i < rating ? 'bi-star-fill' : 'bi-star'}`}
                    ></i>
                ))}
            </div>
        );
    };

    return (
        <section className="testimonials-section">
            <div className="testimonial-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
            </div>
            
            <div className="container">
                <div className="testimonial-header text-center">
                    <span className="testimonial-subheading">Trải nghiệm</span>
                    <h2 className="testimonial-heading">Khách hàng nói gì về chúng tôi</h2>
                    <p className="testimonial-desc">
                        Hãy xem những đánh giá chân thực từ khách du lịch đã trải nghiệm vẻ đẹp và dịch vụ tại Phú Yên
                    </p>
                </div>
                
                <div className="testimonials-wrapper">
                    <div className="testimonial-quote-icon">
                        <i className="bi bi-quote"></i>
                    </div>
                    
                    <div className="testimonials-slider">
                        {testimonials.map((item, index) => (
                            <div 
                                key={item.id}
                                className={`testimonial-item ${index === activeIndex ? 'active' : ''}`}
                            >
                                <div className="testimonial-content">
                                    <p className="testimonial-text">{item.content}</p>
                                    <div className="testimonial-meta">
                                        {renderStars(item.rating)}
                                        <div className="testimonial-date">{item.date}</div>
                                    </div>
                                </div>
                                
                                <div className="testimonial-author">
                                    <div className="author-avatar">
                                        <img src={item.avatar} alt={item.author} />
                                    </div>
                                    <div className="author-info">
                                        <h4 className="author-name">{item.author}</h4>
                                        <p className="author-position">{item.position}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="testimonial-controls">
                        <button className="testimonial-arrow prev" onClick={handlePrev} aria-label="Previous">
                            <i className="bi bi-arrow-left"></i>
                        </button>
                        <div className="testimonial-dots">
                            {testimonials.map((_, index) => (
                                <button 
                                    key={index}
                                    className={`testimonial-dot ${index === activeIndex ? 'active' : ''}`}
                                    onClick={() => handleDotClick(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                ></button>
                            ))}
                        </div>
                        <button className="testimonial-arrow next" onClick={handleNext} aria-label="Next">
                            <i className="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </div>
                
                <div className="testimonial-stats">
                    <div className="stat-item">
                        <div className="stat-number">4.9<span className="stat-symbol">+</span></div>
                        <div className="stat-label">Đánh giá trung bình</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">150<span className="stat-symbol">+</span></div>
                        <div className="stat-label">Khách hàng hài lòng</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">30<span className="stat-symbol">+</span></div>
                        <div className="stat-label">Điểm đến nổi tiếng</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;