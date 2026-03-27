// utils/mailer.js
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or use your provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Aara Infraa" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
