const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @route   POST /api/auth/register
// @desc    Đăng ký người dùng mới
router.post('/register', async (req, res) => {
  try {
    console.log('Register request body:', req.body);

    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Vui lòng nhập đầy đủ thông tin' 
      });
    }

    // Kiểm tra email đã tồn tại
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        message: 'Email đã được sử dụng' 
      });
    }

    // Tạo user mới
    const user = await User.create({
      name,
      email,
      password,
    });

    console.log('User created successfully:', user._id);

    // Tạo token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // Gửi email chào mừng (không bắt buộc)
    const message = `
      <h1>Chào mừng đến với ứng dụng của chúng tôi!</h1>
      <p>Xin chào ${name},</p>
      <p>Cảm ơn bạn đã đăng ký tài khoản.</p>
      <p>Email của bạn: ${email}</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Đăng ký thành công',
        message,
      });
      console.log('Welcome email sent successfully');
    } catch (emailError) {
      console.log('Lỗi gửi email (không ảnh hưởng đến đăng ký):', emailError.message);
      // Không return error, vẫn cho đăng ký thành công
    }

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: error.message || 'Lỗi server khi đăng ký'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Đăng nhập
router.post('/login', async (req, res) => {
  try {
    console.log('Login request body:', req.body);

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Vui lòng nhập đầy đủ thông tin' 
      });
    }

    // Kiểm tra user tồn tại
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login attempt with non-existent email:', email);
      return res.status(404).json({ 
        message: 'Email không tồn tại' 
      });
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Mật khẩu không đúng' 
      });
    }

    // Tạo token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    console.log('Login successful for user:', user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: error.message || 'Lỗi server khi đăng nhập'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Gửi email đặt lại mật khẩu
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('Forgot password request for:', email);

    if (!email) {
      return res.status(400).json({ 
        message: 'Vui lòng nhập email' 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        message: 'Không tìm thấy email này' 
      });
    }

    // Tạo reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 phút

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      <h1>Bạn đã yêu cầu đặt lại mật khẩu</h1>
      <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu:</p>
      <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
      <p>Link này sẽ hết hiệu lực sau 10 phút.</p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    `;

    try {
      console.log('Attempting to send reset email to:', user.email);
      
      await sendEmail({
        email: user.email,
        subject: 'Đặt lại mật khẩu',
        message,
      });

      console.log('Reset email sent successfully');
      
      res.status(200).json({ 
        success: true, 
        message: 'Email đã được gửi' 
      });
    } catch (error) {
      console.error('Error sending email:', error);
      
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({ 
        message: 'Không thể gửi email. Vui lòng kiểm tra cấu hình email.',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      message: error.message || 'Lỗi server'
    });
  }
});

// @route   POST /api/auth/reset-password/:resetToken
// @desc    Reset mật khẩu
router.post('/reset-password/:resetToken', async (req, res) => {
  try {
    const { password } = req.body;

    console.log('Reset password attempt with token');

    if (!password) {
      return res.status(400).json({ 
        message: 'Vui lòng nhập mật khẩu mới' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Mật khẩu phải có ít nhất 6 ký tự' 
      });
    }

    // Hash token từ params
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Token không hợp lệ hoặc đã hết hạn' 
      });
    }

    // Đặt mật khẩu mới
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.log('Password reset successfully for user:', user._id);

    res.status(200).json({ 
      success: true, 
      message: 'Mật khẩu đã được đặt lại thành công' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      message: error.message || 'Lỗi server khi đặt lại mật khẩu'
    });
  }
});

module.exports = router;