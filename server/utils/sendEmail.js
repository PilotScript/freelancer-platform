const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a test transporter for development
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER || 'your_mailtrap_username',
      pass: process.env.SMTP_PASSWORD || 'your_mailtrap_password'
    }
  });

  // Define email options
  const message = {
    from: `${process.env.FROM_NAME || 'FreelancerHub'} <${process.env.FROM_EMAIL || 'noreply@freelancerhub.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // Send email
  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
