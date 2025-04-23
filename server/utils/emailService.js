const nodemailer = require('nodemailer');

const sendCredentialsEmail = async (email, regNo, password) => {
  try {
    // Configure your email transport here
    const transporter = nodemailer.createTransport({
      // Add your email service configuration
      // Example for Gmail:
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Account Credentials',
      text: `
        Hello,
        
        Your account has been created. Here are your login credentials:
        
        Registration Number (Username): ${regNo}
        Password: ${password}
        
        Please change your password after your first login.
        
        Best regards,
        Your Application Team
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't throw the error, just log it
  }
};

module.exports = sendCredentialsEmail;