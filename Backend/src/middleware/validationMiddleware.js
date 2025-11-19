import { body, validationResult } from "express-validator";

// Middleware xử lý lỗi validation
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: false, 
      message: "Dữ liệu không hợp lệ", 
      errors: errors.array() 
    });
  }
  next();
};

// Validation cho register
export const validateRegister = [
  body("name")
    .trim()
    .notEmpty().withMessage("Tên không được để trống")
    .isLength({ min: 2, max: 50 }).withMessage("Tên phải từ 2-50 ký tự"),
  
  body("email")
    .trim()
    .notEmpty().withMessage("Email không được để trống")
    .isEmail().withMessage("Email không hợp lệ")
    .normalizeEmail(),
  
  body("password")
    .notEmpty().withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6 }).withMessage("Mật khẩu phải có ít nhất 6 ký tự")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage("Mật khẩu phải có chữ hoa, chữ thường và số"),
  
  handleValidationErrors
];

// Validation cho login
export const validateLogin = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email không được để trống")
    .isEmail().withMessage("Email không hợp lệ")
    .normalizeEmail(),
  
  body("password")
    .notEmpty().withMessage("Mật khẩu không được để trống"),
  
  handleValidationErrors
];

// Validation cho forgot password
export const validateForgotPassword = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email không được để trống")
    .isEmail().withMessage("Email không hợp lệ")
    .normalizeEmail(),
  
  handleValidationErrors
];

// Validation cho reset password
export const validateResetPassword = [
  body("password")
    .notEmpty().withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6 }).withMessage("Mật khẩu phải có ít nhất 6 ký tự")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage("Mật khẩu phải có chữ hoa, chữ thường và số"),
  
  handleValidationErrors
];