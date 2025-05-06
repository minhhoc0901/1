import PropTypes from "prop-types";

const Sidebar = ({ location, scrollToSection }) => (
  <div className="content-right w-full md:w-1/4">
    <h3 className="text-xl font-semibold mb-4">Trong bài viết này</h3>
    <ul className="list-disc pl-5 mb-4">
    
      <li onClick={() => scrollToSection("intro")} className="cursor-pointer text-blue-500 hover:underline">
        Giới Thiệu
      </li>
      <li onClick={() => scrollToSection("highlight")} className="cursor-pointer text-blue-500 hover:underline">
        Vì Sao Bạn Nên Ghé Thăm?
      </li>
      <li onClick={() => scrollToSection("timing")} className="cursor-pointer text-blue-500 hover:underline">
        Thời Điểm Lý Tưởng
      </li>
      <li onClick={() => scrollToSection("weather")} className="cursor-pointer text-blue-500 hover:underline">
        Thời Tiết Hiện Tại
      </li>
      <li onClick={() => scrollToSection("travel")} className="cursor-pointer text-blue-500 hover:underline">
        Hành Trình Đến Địa Điểm
      </li>
      <li onClick={() => scrollToSection("map")} className="cursor-pointer text-blue-500 hover:underline">
        Bản Đồ Địa Điểm
      </li>
      <li onClick={() => scrollToSection("gallery")} className="cursor-pointer text-blue-500 hover:underline">
        Trải Nghiệm Tại Địa Điểm
      </li>
      <li onClick={() => scrollToSection("food")} className="cursor-pointer text-blue-500 hover:underline">
        Ẩm Thực Đặc Sắc
      </li>
      <li onClick={() => scrollToSection("tips")} className="cursor-pointer text-blue-500 hover:underline">
        Lưu Ý Khi Tham Quan
      </li>
      <li onClick={() => scrollToSection("photo-upload")} className="cursor-pointer text-blue-500 hover:underline">
        Chia Sẻ Hình Ảnh Của Bạn
      </li>
      <li onClick={() => scrollToSection("comments")} className="cursor-pointer text-blue-500 hover:underline">
        Bình Luận
      </li>
    </ul>

    <h3 className="text-xl font-semibold mb-4">Gần Địa Điểm</h3>
    <ul className="list-disc pl-5 mb-4">
      {location.nearby.map((place, index) => (
        <li key={index}>{place}</li>
      ))}
    </ul>

    <h3 className="text-xl font-semibold mb-4">Top Khách Sạn</h3>
    <ul className="list-disc pl-5">
      <li>Sala Tuy Hòa Beach Resort</li>
      <li>Stella Beach Resort</li>
      <li>CenDeluxe Hotel</li>
      <li>Hồng Ngọc Hotel Phú Yên</li>
    </ul>
    
  </div>
);

Sidebar.propTypes = {
  location: PropTypes.shape({
    nearby: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  scrollToSection: PropTypes.func.isRequired,
};

export default Sidebar;