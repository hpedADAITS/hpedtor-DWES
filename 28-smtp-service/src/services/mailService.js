const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport(config.smtp);

async function sendEmail(to, subject, text, html = null) {
  try {
    const result = await transporter.sendMail({
      from: process.env.MAIL_FROM || 'noreply@example.com',
      to,
      subject,
      text,
      html
    });
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = { sendEmail };
