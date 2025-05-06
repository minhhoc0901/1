const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Lấy danh sách tất cả người dùng (chỉ admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Đã xảy ra lỗi khi lấy danh sách người dùng',
      error: error.message
    });
  }
};

// Lấy thông tin một người dùng (admin hoặc chính người dùng đó)
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Kiểm tra quyền: chỉ admin hoặc chính người dùng đó mới xem được
    if (req.user.role !== 'admin' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Bạn không có quyền truy cập thông tin này'
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy thông tin người dùng'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Đã xảy ra lỗi khi lấy thông tin người dùng',
      error: error.message
    });
  }
};

// Cập nhật thông tin người dùng (admin hoặc chính người dùng đó)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Kiểm tra quyền: chỉ admin hoặc chính người dùng đó mới cập nhật được
    if (req.user.role !== 'admin' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Bạn không có quyền cập nhật thông tin này'
      });
    }
    
    // Kiểm tra người dùng tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy thông tin người dùng'
      });
    }
    
    // Chỉ admin mới có thể thay đổi role
    const updateData = { ...req.body };
    if (req.user.role !== 'admin') {
      delete updateData.role;
    }
    
    // Cập nhật thông tin
    const updated = await User.updateUser(userId, updateData);
    
    if (updated) {
      const updatedUser = await User.findById(userId);
      
      res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin thành công',
        data: updatedUser
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Cập nhật thông tin thất bại'
      });
    }
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng',
      error: error.message
    });
  }
};

// Xóa người dùng (chỉ admin)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Kiểm tra người dùng tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy thông tin người dùng'
      });
    }
    
    // Không thể tự xóa tài khoản của mình
    if (req.user.id === parseInt(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Không thể xóa tài khoản của chính mình'
      });
    }
    
    // Xóa người dùng
    const deleted = await User.deleteUser(userId);
    
    if (deleted) {
      res.status(200).json({
        success: true,
        message: 'Xóa người dùng thành công'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Xóa người dùng thất bại'
      });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Đã xảy ra lỗi khi xóa người dùng',
      error: error.message
    });
  }
};

// Controller đổi mật khẩu
exports.changePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin'
      });
    }

    // Kiểm tra quyền
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thay đổi mật khẩu này'
      });
    }

    // Kiểm tra user tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Xác thực mật khẩu hiện tại
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    // Hash mật khẩu mới và cập nhật
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Cập nhật mật khẩu mới
    const updated = await User.updateUser(userId, { password: newPassword });

    if (updated) {
      res.status(200).json({
        success: true,
        message: 'Đổi mật khẩu thành công'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Không thể đổi mật khẩu'
      });
    }
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đổi mật khẩu',
      error: error.message
    });
  }
};

// Cập nhật role của người dùng
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role không hợp lệ'
      });
    }

    const updated = await User.updateUser(id, { role });

    if (updated) {
      res.status(200).json({
        success: true,
        message: 'Cập nhật role thành công'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Cập nhật role thất bại'
      });
    }
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi cập nhật role',
      error: error.message
    });
  }
};