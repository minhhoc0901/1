import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const AdminHeader = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="btn-toggle-sidebar" onClick={onToggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
            <li className="breadcrumb-item active">Quản lý người dùng</li>
          </ol>
        </nav>
      </div>
      <div className="header-right">
        <div className="dropdown">
          <button 
            className="btn btn-link dropdown-toggle admin-user-btn" 
            type="button" 
            data-bs-toggle="dropdown"
          >
            <i className="bi bi-person-circle me-2"></i>
            <span>{user.username}</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <Link to="/" className="dropdown-item">
                <i className="bi bi-house me-2"></i>
                Về trang chủ
              </Link>
            </li>
            <li><hr className="dropdown-divider"/></li>
            <li>
              <Link to="/logout" className="dropdown-item text-danger">
                <i className="bi bi-box-arrow-right me-2"></i>
                Đăng xuất
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;