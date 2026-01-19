const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  ignoreTLS: true
});

const mailOptions = {
  from: 'test@example.com',
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'This is a test message'
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error('Error sending email:', err);
    process.exit(1);
  } else {
    console.log('Email sent successfully:', info.response);
    process.exit(0);
  }
});
