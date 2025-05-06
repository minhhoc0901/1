import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/HomePageCSS/DestinationsSection.css';

// Import ảnh - sử dụng các ảnh đã có trong dự án
import bg1 from '../../assets/images/background_PY_1.jpg';
import bg2 from '../../assets/images/background_BX_2.jpg';
import bg3 from '../../assets/images/background_GDD_3.jpg';
import bg4 from '../../assets/images/background_MD_4.jpg';

const DestinationsSection = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [activeCard, setActiveCard] = useState(null);
    const [animateOut, setAnimateOut] = useState(false);
    
    const destinations = [
        {
            id: 1,
            name: 'Gành Đá Đĩa',
            category: 'natural',
            location: 'An Ninh Đông, Tuy An',
            image: bg3,
            rating: 4.8,
            reviews: 245,
            featured: true,
            description: 'Kỳ quan thiên nhiên độc đáo với những khối đá xếp chồng lên nhau tạo thành hình lục giác.',
            tags: ['Di tích thiên nhiên', 'Check-in', 'Bình minh đẹp']
        },
        {
            id: 2,
            name: 'Bãi Xép',
            category: 'beach',
            location: 'An Chấn, Tuy An',
            image: bg2,
            rating: 4.7,
            reviews: 189,
            featured: true,
            description: 'Bãi biển hoang sơ tuyệt đẹp được yêu thích sau bộ phim "Tôi thấy hoa vàng trên cỏ xanh".',
            tags: ['Bãi biển', 'Hoàng hôn', 'Chụp ảnh đẹp']
        },
        {
            id: 3,
            name: 'Mũi Điện',
            category: 'natural',
            location: 'Hòa Hiệp, Đông Hòa',
            image: bg4,
            rating: 4.6,
            reviews: 210,
            featured: false,
            description: 'Ngọn hải đăng cổ nằm trên mũi đất đón ánh bình minh đầu tiên trên đất liền.',
            tags: ['Điểm tham quan', 'Hải đăng', 'Bình minh']
        },
        {
            id: 4,
            name: 'Đầm Ô Loan',
            category: 'natural',
            location: 'Tuy An',
            image: bg1,
            rating: 4.5,
            reviews: 178,
            featured: false,
            description: 'Đầm nước lợ với các loài hải sản đặc trưng và cảnh quan tuyệt đẹp vào sáng sớm.',
            tags: ['Danh lam thắng cảnh', 'Ẩm thực', 'Sò huyết']
        }
    ];
    
    const categories = [
        { id: 'all', name: 'Tất cả', icon: 'collection' },
        { id: 'natural', name: 'Thiên nhiên', icon: 'tree' },
        { id: 'beach', name: 'Bãi biển', icon: 'water' },
        { id: 'cultural', name: 'Văn hóa', icon: 'bank' }
    ];
    
    // Lọc các địa điểm theo category
    const filteredDestinations = activeTab === 'all' 
        ? destinations 
        : destinations.filter(item => item.category === activeTab);
    
    useEffect(() => {
        // Animation khi chuyển tab
        if (activeTab) {
            setAnimateOut(true);
            const timer = setTimeout(() => {
                setAnimateOut(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [activeTab]);

    // Render sao đánh giá
    const renderStars = (rating) => {
        return (
            <div className="stars-rating">
                {[...Array(5)].map((_, i) => (
                    <i 
                        key={i} 
                        className={`bi ${i < Math.floor(rating) ? 'bi-star-fill' : 
                                        i < rating ? 'bi-star-half' : 'bi-star'}`}
                    ></i>
                ))}
            </div>
        );
    };

    return (
        <section className="destinations-section">
            <div className="destinations-decor">
                <div className="decor-circle decor-circle-1"></div>
                <div className="decor-circle decor-circle-2"></div>
                <div className="decor-line"></div>
            </div>
            
            <div className="container">
                <div className="destinations-header">
                    <div className="destinations-header-content">
                        <div className="section-subtitle">Khám phá Phú Yên</div>
                        <h2 className="section-title">Điểm Đến <span className="highlight-text">Nổi Bật</span></h2>
                        <p className="section-desc">
                            Khám phá những địa điểm du lịch tuyệt vời nhất tại Phú Yên, từ bãi biển hoang sơ đến các di tích lịch sử văn hóa đặc sắc
                        </p>
                    </div>
                </div>

                <div className="destinations-tabs">
                    <div className="destinations-tabs-wrapper">
                        {categories.map(category => (
                            <button 
                                key={category.id}
                                className={`tab-button ${activeTab === category.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(category.id)}
                            >
                                <i className={`bi bi-${category.icon}`}></i>
                                <span>{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className={`destinations-grid ${animateOut ? 'fade-out' : 'fade-in'}`}>
                    {filteredDestinations.map(destination => (
                        <div 
                            className={`destination-card ${destination.featured ? 'featured' : ''} ${activeCard === destination.id ? 'active' : ''}`}
                            key={destination.id}
                            onMouseEnter={() => setActiveCard(destination.id)}
                            onMouseLeave={() => setActiveCard(null)}
                        >
                            <div className="destination-card-inner">
                                <div className="destination-thumb">
                                    <img src={destination.image} alt={destination.name} />
                                    <div className="destination-overlay"></div>
                                    <div className="destination-meta">
                                        <div className="destination-rating">
                                            {renderStars(destination.rating)}
                                            <span>{destination.rating.toFixed(1)}</span>
                                        </div>
                                        <div className="destination-reviews">
                                            <i className="bi bi-chat-square-text"></i>
                                            <span>{destination.reviews} đánh giá</span>
                                        </div>
                                    </div>
                                    {destination.featured && (
                                        <div className="destination-featured">
                                            <i className="bi bi-bookmark-star-fill"></i>
                                            <span>Nổi bật</span>
                                        </div>
                                    )}
                                    <div className="destination-actions">
                                        <Link to={`/locations/${destination.id}`} className="btn-circle">
                                            <i className="bi bi-eye-fill"></i>
                                        </Link>
                                        <button className="btn-circle btn-favorite">
                                            <i className="bi bi-heart"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="destination-content">
                                    <div className="destination-location">
                                        <i className="bi bi-geo-alt-fill"></i>
                                        <span>{destination.location}</span>
                                    </div>
                                    
                                    <h3 className="destination-title">
                                        <Link to={`/locations/${destination.id}`}>{destination.name}</Link>
                                    </h3>
                                    
                                    <p className="destination-desc">{destination.description}</p>
                                    
                                    <div className="destination-tags">
                                        {destination.tags.map((tag, index) => (
                                            <span key={index} className="destination-tag">{tag}</span>
                                        ))}
                                    </div>
                                    
                                    <div className="destination-footer">
                                        <Link to={`/locations/${destination.id}`} className="btn-explore">
                                            <span>Khám phá ngay</span>
                                            <svg viewBox="0 0 24 24" width="24" height="24">
                                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="destinations-more">
                    <Link to="/locations" className="btn-view-all">
                        <span>Xem tất cả điểm đến</span>
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default DestinationsSection;