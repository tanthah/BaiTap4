import express from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/authController.js";
import { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } from "../middleware/validationMiddleware.js";
import { authLimiter, forgotPasswordLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// Public routes với validation và rate limiting
router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.post("/forgot-password", forgotPasswordLimiter, validateForgotPassword, forgotPassword);
router.post("/reset-password/:token", authLimiter, validateResetPassword, resetPassword);

export default router;