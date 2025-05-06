import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ isCollapsed }) => {
  return (
    <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <i className="bi bi-shield-lock"></i>
          <span className="brand-text">STAFF</span>
        </div>
      </div>
      
      <div className="sidebar-menu">
        <div className="menu-section">
          <div className="menu-section-title">QUẢN LÝ CHUNG</div>
          <ul className="nav flex-column">
            <li className="nav-item">
              <NavLink to="/admin" end className="nav-link">
                <i className="bi bi-speedometer2"></i>
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/users" className="nav-link">
                <i className="bi bi-people"></i>
                <span>Quản lý người dùng</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin/locations" className="nav-link">
                <i className="bi bi-people"></i>
                <span>Quản lý địa điểm</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;