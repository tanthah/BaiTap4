
//register service
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const registerService = async (data) => {
  const { name, email, password } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) return { status: false, message: "Email đã tồn tại" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return { status: true, message: "Đăng ký thành công" };
};



// Login service
export const loginService = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) return { status: false, message: "Email hoặc mật khẩu không đúng" };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { status: false, message: "Email hoặc mật khẩu không đúng" };

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    status: true,
    message: "Đăng nhập thành công",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};



//forgot password guiwr mail taoj token

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return { status: false, message: "Email không tồn tại" };

  const token = crypto.randomBytes(20).toString("hex");

  user.resetToken = token;
  user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 phút
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Khôi phục mật khẩu",
    html: `
      <p>Nhấn vào link để đặt lại mật khẩu:</p>
      <a href="${link}">${link}</a>
      <p>Link có hiệu lực 15 phút.</p>
    `,
  });

  return { status: true, message: "Kiểm tra email để đặt lại mật khẩu" };
};




//reset password service

export const resetPasswordService = async (token, password) => {
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user) return { status: false, message: "Token không hợp lệ hoặc đã hết hạn" };

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  return { status: true, message: "Đặt mật khẩu thành công" };
};
