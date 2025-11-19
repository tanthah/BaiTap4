import rateLimit from "express-rate-limit";

// Rate limit cho authentication endpoints (nghiêm ngặt hơn)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Tối đa 5 requests
  message: {
    status: false,
    message: "Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit cho các API thông thường
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Tối đa 100 requests
  message: {
    status: false,
    message: "Quá nhiều yêu cầu, vui lòng thử lại sau"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit đặc biệt cho forgot password (rất nghiêm ngặt)
export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 3, // Tối đa 3 requests
  message: {
    status: false,
    message: "Quá nhiều yêu cầu khôi phục mật khẩu, vui lòng thử lại sau 1 giờ"
  },
  standardHeaders: true,
  legacyHeaders: false,
});