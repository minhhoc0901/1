import React from 'react';

const TourNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: 'overview', label: 'Tổng quan' },
    { key: 'schedule', label: 'Lịch trình' },
    { key: 'info', label: 'Thông tin' },
    { key: 'reviews', label: 'Đánh giá' },
  ];

  return (
    <div className="tour-navigation">
      <div className="nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'active' : ''}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TourNavigation;