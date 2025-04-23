const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // Configure your email service here
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendCredentialsEmail = async (email, regNo, password) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Student Portal Credentials',
      html: `
        <h1>Welcome to the Student Portal</h1>
        <p>Your account has been created by the administrator.</p>
        <p>Here are your login credentials:</p>
        <p><strong>Registration Number:</strong> ${regNo}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please change your password after your first login.</p>
        <p>Best regards,<br>Admin Team</p>
      `
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendCredentialsEmail };