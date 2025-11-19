import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Xác thực JWT token
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ 
        status: false, 
        message: "Không tìm thấy token xác thực" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({ 
        status: false, 
        message: "Token không hợp lệ" 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      status: false, 
      message: "Token không hợp lệ hoặc đã hết hạn" 
    });
  }
};

// Kiểm tra quyền admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ 
      status: false, 
      message: "Bạn không có quyền truy cập" 
    });
  }
  next();
};

// Kiểm tra quyền user hoặc admin
export const isUser = (req, res, next) => {
  if (req.user.role !== "user" && req.user.role !== "admin") {
    return res.status(403).json({ 
      status: false, 
      message: "Bạn không có quyền truy cập" 
    });
  }
  next();
};