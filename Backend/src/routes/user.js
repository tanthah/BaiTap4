import express from "express";
import { verifyToken, isUser } from "../middleware/authMiddleware.js";
import { generalLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// Protected user routes
router.get("/profile", verifyToken, isUser, generalLimiter, (req, res) => {
  res.json({
    status: true,
    message: "Thông tin người dùng",
    user: req.user
  });
});

router.put("/profile", verifyToken, isUser, generalLimiter, (req, res) => {
  // Logic cập nhật profile
  res.json({
    status: true,
    message: "Cập nhật thành công"
  });
});

export default router;