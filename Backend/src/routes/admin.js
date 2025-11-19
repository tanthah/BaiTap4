import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { generalLimiter } from "../middleware/rateLimitMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Admin only routes
router.get("/users", verifyToken, isAdmin, generalLimiter, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      status: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Lỗi server"
    });
  }
});

router.delete("/users/:id", verifyToken, isAdmin, generalLimiter, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({
      status: true,
      message: "Xóa người dùng thành công"
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Lỗi server"
    });
  }
});

export default router;