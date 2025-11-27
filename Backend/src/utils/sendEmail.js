const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Tạo transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Cấu hình email
  const mailOptions = {
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Gửi email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;