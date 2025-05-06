import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/admin/LocationManagement.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LocationManagement = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Thêm axios interceptor để xử lý token
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          handleTokenExpired();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Kiểm tra token khi component mount
  useEffect(() => {
    if (!token) {
      navigate('/login', { state: { from: '/admin/locations' } });
    }
  }, [token, navigate]);

  const handleTokenExpired = () => {
    toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    logout();
    navigate('/login', { state: { from: '/admin/locations' } });
  };

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    latitude: '',
    longitude: '',
    subtitle: '',
    introduction: '',
    why_visit_architecture_title: '',
    why_visit_architecture_text: '',
    why_visit_culture: '',
    ticket_price: '',
    tip: '',
    bestTimes: [''],
    travelMethods: {
        fromTuyHoa: [''],
        fromElsewhere: ['']
    },
    experiences: [{ text: '', image: null }],
    cuisines: [{ text: '', image: null }],
    tips: [''],
    nearby: [''],
    images: {
        introduction: null,
        architecture: null
    }
  });

  // Thêm các hàm xử lý arrays
  const handleArrayChange = (name, index, value) => {
    setFormData(prev => ({
        ...prev,
        [name]: prev[name].map((item, i) => i === index ? value : item)
    }));
  };

  const handleAddArrayItem = (name) => {
    setFormData(prev => ({
        ...prev,
        [name]: [...prev[name], '']
    }));
  };

  const handleRemoveArrayItem = (name, index) => {
    setFormData(prev => ({
        ...prev,
        [name]: prev[name].filter((_, i) => i !== index)
    }));
  };

  // Hàm xử lý travel methods
  const handleTravelMethodChange = (type, index, value) => {
    setFormData(prev => ({
        ...prev,
        travelMethods: {
            ...prev.travelMethods,
            [type]: prev.travelMethods[type].map((item, i) => 
                i === index ? value : item
            )
        }
    }));
  };

  const handleAddTravelMethod = (type) => {
    setFormData(prev => ({
        ...prev,
        travelMethods: {
            ...prev.travelMethods,
            [type]: [...prev.travelMethods[type], '']
        }
    }));
  };

  const handleRemoveTravelMethod = (type, index) => {
    setFormData(prev => ({
        ...prev,
        travelMethods: {
            ...prev.travelMethods,
            [type]: prev.travelMethods[type].filter((_, i) => i !== index)
        }
    }));
  };

  // Fetch locations
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/locations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setLocations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch locations error:', error);
      setError('Không thể tải danh sách địa điểm');
      setLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Thêm các hàm xử lý submit form
  const handleAddLocation = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Thêm thông tin cơ bản
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          formDataToSend.append(key, 
            typeof formData[key] === 'object' 
              ? JSON.stringify(formData[key]) 
              : formData[key]
          );
        }
      });

      // Xử lý upload ảnh
      if (formData.images.introduction) {
        formDataToSend.append('introductionImage', formData.images.introduction);
      }
      if (formData.images.architecture) {
        formDataToSend.append('architectureImage', formData.images.architecture);  
      }

      const response = await axios.post(
        'http://localhost:5000/api/locations',
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Thêm địa điểm thành công');
        setShowAddModal(false);
        resetForm();
        await fetchLocations(); // Đợi fetch locations hoàn thành
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi thêm địa điểm');
    }
  };

  const handleEditLocation = async (e) => {
    e.preventDefault();
    try {
      const locationId = selectedLocation.id;
      const formDataToSend = new FormData();

      // Thêm thông tin cập nhật
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          formDataToSend.append(key, 
            typeof formData[key] === 'object' 
              ? JSON.stringify(formData[key]) 
              : formData[key]
          );
        }
      });

      const response = await axios.put(
        `http://localhost:5000/api/locations/${locationId}`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Cập nhật địa điểm thành công');
        setShowEditModal(false);
        await fetchLocations(); // Đợi fetch locations hoàn thành
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật địa điểm');
    }
  };

  const handleDeleteLocation = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa địa điểm này?')) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/locations/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          toast.success('Xóa địa điểm thành công');
          await fetchLocations(); // Đợi fetch locations hoàn thành
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi khi xóa địa điểm');
      }
    }
  };

  const resetForm = () => {
    setFormData({
        name: '',
        type: '',
        description: '',
        latitude: '',
        longitude: '',
        subtitle: '',
        introduction: '',
        why_visit_architecture_title: '',
        why_visit_architecture_text: '',
        why_visit_culture: '',
        ticket_price: '',
        tip: '',
        bestTimes: [''],
        travelMethods: {
            fromTuyHoa: [''],
            fromElsewhere: ['']
        },
        experiences: [{ text: '', image: null }],
        cuisines: [{ text: '', image: null }],
        tips: [''],
        nearby: [''],
        images: {
            introduction: null,
            architecture: null
        }
    });
};

  if (loading) return <div className="loading-state">Đang tải...</div>;
  if (error) return <div className="error-state">Lỗi: {error}</div>;

  return (
    <>
      <div className="location-management">
        <div className="header-wrapper">
          <h1 className="page-title">Quản lý địa điểm</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="add-button"
          >
            Thêm địa điểm mới
          </button>
        </div>

        <div className="table-container">
          <table className="location-table">
            <thead>
              <tr>
                <th>Tên địa điểm</th>
                <th>Loại</th>
                <th>Mô tả</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr key={location.id}>
                  <td>{location.title}</td>
                  <td>{location.type}</td>
                  <td>{location.description}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedLocation(location);
                        setFormData({
                          name: location.title,
                          type: location.type,
                          description: location.description,
                          latitude: location.coordinates?.latitude,
                          longitude: location.coordinates?.longitude,
                          subtitle: location.subtitle,
                          introduction: location.introduction?.text,
                          why_visit_architecture_title: location.whyVisit?.architecture?.title,
                          why_visit_architecture_text: location.whyVisit?.architecture?.text,
                          why_visit_culture: location.whyVisit?.culture,
                          ticket_price: location.travelInfo?.ticketPrice,
                          tip: location.travelInfo?.tip,
                          bestTimes: location.bestTimes || [''],
                          travelMethods: location.travelMethods || {
                              fromTuyHoa: [''],
                              fromElsewhere: ['']
                          },
                          experiences: location.experiences || [{ text: '', image: null }],
                          cuisines: location.cuisines || [{ text: '', image: null }],
                          tips: location.tips || [''],
                          nearby: location.nearby || [''],
                          images: {
                              introduction: null,
                              architecture: null
                          }
                        });
                        setShowEditModal(true);
                      }}
                      className="edit-button"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteLocation(location.id)}
                      className="delete-button"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Location Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Thêm địa điểm mới</h2>
              <form onSubmit={handleAddLocation}>
                <div className="form-group">
                  <label className="form-label">Tên địa điểm</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Loại địa điểm</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="">Chọn loại địa điểm</option>
                    <option value="natural">Thiên nhiên</option>
                    <option value="beach">Bãi biển</option>
                    <option value="cultural">Văn hóa</option>
                    <option value="historical">Di tích lịch sử</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Mô tả ngắn</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tọa độ</label>
                  <div className="coordinates-inputs">
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Vĩ độ"
                      step="any"
                      required
                    />
                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Kinh độ"
                      step="any"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phụ đề</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Giới thiệu</label>
                  <textarea
                    name="introduction"
                    value={formData.introduction}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kiến trúc - Tiêu đề</label>
                  <input
                    type="text"
                    name="why_visit_architecture_title"
                    value={formData.why_visit_architecture_title}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kiến trúc - Mô tả</label>
                  <textarea
                    name="why_visit_architecture_text"
                    value={formData.why_visit_architecture_text}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Văn hóa</label>
                  <textarea
                    name="why_visit_culture"
                    value={formData.why_visit_culture}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Giá vé tham quan</label>
                  <input
                    type="text"
                    name="ticket_price"
                    value={formData.ticket_price}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="VD: Miễn phí hoặc 50.000 VNĐ/người"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lưu ý khi tham quan</label>
                  <textarea
                    name="tip"
                    value={formData.tip}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="3"
                    placeholder="Các lưu ý cho du khách khi đến tham quan"
                  />
                </div>

                {/* Best Times */}
                <div className="form-group">
                  <label className="form-label">Thời điểm tốt nhất để tham quan</label>
                  {formData.bestTimes.map((time, index) => (
                      <div key={index} className="array-input">
                          <input
                              type="text"
                              value={time}
                              onChange={(e) => handleArrayChange('bestTimes', index, e.target.value)}
                              className="form-input"
                              placeholder="VD: Sáng sớm (5h-8h)"
                          />
                          <button 
                              type="button"
                              onClick={() => handleRemoveArrayItem('bestTimes', index)}
                              className="remove-button"
                          >
                              <i className="bi bi-trash"></i>
                          </button>
                      </div>
                  ))}
                  <button 
                      type="button"
                      onClick={() => handleAddArrayItem('bestTimes')}
                      className="add-button"
                  >
                      <i className="bi bi-plus"></i> Thêm thời điểm
                  </button>
                </div>

                {/* Travel Methods */}
                <div className="form-group">
                  <label className="form-label">Phương thức di chuyển từ Tuy Hòa</label>
                  {formData.travelMethods.fromTuyHoa.map((method, index) => (
                      <div key={index} className="array-input">
                          <input
                              type="text"
                              value={method}
                              onChange={(e) => handleTravelMethodChange('fromTuyHoa', index, e.target.value)}
                              className="form-input"
                              placeholder="VD: Xe máy (15 phút)"
                          />
                          <button 
                              type="button"
                              onClick={() => handleRemoveTravelMethod('fromTuyHoa', index)}
                              className="remove-button"
                          >
                              <i className="bi bi-trash"></i>
                          </button>
                      </div>
                  ))}
                  <button 
                      type="button"
                      onClick={() => handleAddTravelMethod('fromTuyHoa')}
                      className="add-button"
                  >
                      <i className="bi bi-plus"></i> Thêm phương thức
                  </button>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="cancel-button"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="submit-button"
                  >
                    Thêm
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Location Modal */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Chỉnh sửa địa điểm</h2>
              <form onSubmit={handleEditLocation}>
                <div className="form-group">
                  <label className="form-label">Tên địa điểm</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Loại địa điểm</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="">Chọn loại địa điểm</option>
                    <option value="natural">Thiên nhiên</option>
                    <option value="beach">Bãi biển</option>
                    <option value="cultural">Văn hóa</option>
                    <option value="historical">Di tích lịch sử</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Mô tả ngắn</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tọa độ</label>
                  <div className="coordinates-inputs">
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Vĩ độ"
                      step="any"
                      required
                    />
                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Kinh độ"
                      step="any"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phụ đề</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Giới thiệu</label>
                  <textarea
                    name="introduction"
                    value={formData.introduction}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kiến trúc - Tiêu đề</label>
                  <input
                    type="text"
                    name="why_visit_architecture_title"
                    value={formData.why_visit_architecture_title}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kiến trúc - Mô tả</label>
                  <textarea
                    name="why_visit_architecture_text"
                    value={formData.why_visit_architecture_text}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Văn hóa</label>
                  <textarea
                    name="why_visit_culture"
                    value={formData.why_visit_culture}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Giá vé tham quan</label>
                  <input
                    type="text"
                    name="ticket_price"
                    value={formData.ticket_price}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="VD: Miễn phí hoặc 50.000 VNĐ/người"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lưu ý khi tham quan</label>
                  <textarea
                    name="tip"
                    value={formData.tip}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="3"
                    placeholder="Các lưu ý cho du khách khi đến tham quan"
                  />
                </div>

                {/* Best Times */}
                <div className="form-group">
                  <label className="form-label">Thời điểm tốt nhất để tham quan</label>
                  {formData.bestTimes.map((time, index) => (
                      <div key={index} className="array-input">
                          <input
                              type="text"
                              value={time}
                              onChange={(e) => handleArrayChange('bestTimes', index, e.target.value)}
                              className="form-input"
                              placeholder="VD: Sáng sớm (5h-8h)"
                          />
                          <button 
                              type="button"
                              onClick={() => handleRemoveArrayItem('bestTimes', index)}
                              className="remove-button"
                          >
                              <i className="bi bi-trash"></i>
                          </button>
                      </div>
                  ))}
                  <button 
                      type="button"
                      onClick={() => handleAddArrayItem('bestTimes')}
                      className="add-button"
                  >
                      <i className="bi bi-plus"></i> Thêm thời điểm
                  </button>
                </div>

                {/* Travel Methods */}
                <div className="form-group">
                  <label className="form-label">Phương thức di chuyển từ Tuy Hòa</label>
                  {formData.travelMethods.fromTuyHoa.map((method, index) => (
                      <div key={index} className="array-input">
                          <input
                              type="text"
                              value={method}
                              onChange={(e) => handleTravelMethodChange('fromTuyHoa', index, e.target.value)}
                              className="form-input"
                              placeholder="VD: Xe máy (15 phút)"
                          />
                          <button 
                              type="button"
                              onClick={() => handleRemoveTravelMethod('fromTuyHoa', index)}
                              className="remove-button"
                          >
                              <i className="bi bi-trash"></i>
                          </button>
                      </div>
                  ))}
                  <button 
                      type="button"
                      onClick={() => handleAddTravelMethod('fromTuyHoa')}
                      className="add-button"
                  >
                      <i className="bi bi-plus"></i> Thêm phương thức
                  </button>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="cancel-button"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="submit-button"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default LocationManagement;