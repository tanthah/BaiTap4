const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Kiểm tra biến môi trường
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Email credentials are not configured in .env file');
  }

  // Tạo transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Cấu hình email
  const mailOptions = {
    from: `"BaiTap4" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Gửi email
  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent successfully:', info.messageId);
  return info;
};

module.exports = sendEmail;