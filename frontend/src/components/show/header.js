import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/show/header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobileMenuOpen]);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    return (
        <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    {/* Logo */}
                    <Link to="/" className="navbar-brand">
                        <div className="logo-wrapper">
                            <div className="logo-icon">
                                <i className="bi bi-airplane-engines"></i>
                            </div>
                            <div className="brand-text">
                                <span className="brand-name">PHÚ YÊN</span>
                                {/* <span className="brand-tagline">Xứ sở hoa vàng cỏ xanh</span> */}
                            </div>
                        </div>
                    </Link>

                    {/* Mobile Toggle Button */}
                    <button 
                        className={`navbar-toggler ${mobileMenuOpen ? 'active' : ''}`}
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    {/* Main Navigation */}
                    <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">
                                    <i className="bi bi-house-door"></i>
                                    <span>Trang chủ</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/locations" className="nav-link">
                                    <i className="bi bi-geo-alt"></i>
                                    <span>Điểm đến</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/plan" className="nav-link">
                                    <i className="bi bi-calendar3"></i>
                                    <span>Lập kế hoạch</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/about" className="nav-link">
                                    <i className="bi bi-info-circle"></i>
                                    <span>Giới thiệu</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/contact" className="nav-link">
                                    <i className="bi bi-chat-dots"></i>
                                    <span>Liên hệ</span>
                                </Link>
                            </li>
                        </ul>

                        {/* User Actions */}
                        <div className="nav-actions">
                            <button className="search-btn" aria-label="Search">
                                <i className="bi bi-search"></i>
                            </button>

                            {isAuthenticated ? (
                                <div className="dropdown user-menu">
                                    <button 
                                        className={`user-menu-btn dropdown-toggle ${user.role === 'admin' ? 'admin-role' : ''}`}
                                        type="button" 
                                        data-bs-toggle="dropdown"
                                    >
                                        <i className="bi bi-person-circle"></i>
                                        <span>
                                            {user.username}
                                            {user.role === 'admin' && (
                                                <span className="admin-badge">
                                                    <i className="bi bi-shield-fill"></i>
                                                    Admin
                                                </span>
                                            )}
                                        </span>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link to="/profile" className="dropdown-item">
                                                <i className="bi bi-person"></i>
                                                Tài khoản
                                            </Link>
                                        </li>
                                        {user.role === 'admin' && (
                                            <li>
                                                <Link to="/admin" className="dropdown-item text-primary">
                                                    <i className="bi bi-shield-lock"></i>
                                                    Quản lý Admin
                                                </Link>
                                            </li>
                                        )}
                                        <li><hr className="dropdown-divider"/></li>
                                        <li>
                                            <button onClick={handleLogout} className="dropdown-item text-danger">
                                                <i className="bi bi-box-arrow-right"></i>
                                                Đăng xuất
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                <Link to="/login" className="btn login-btn">
                                    <i className="bi bi-person-circle"></i>
                                    <span>Đăng nhập</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Overlay */}
                    {mobileMenuOpen && (
                        <div 
                            className="overlay active" 
                            onClick={() => setMobileMenuOpen(false)}
                        ></div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;