const nodemailer = require('nodemailer');
const { infoLogger, errorLogger } = require('./logger');

const sendMail = async (toEmail, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
        ssl: true,
        debug: true,
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
      from: 'your_email@gmail.com',
      to: toEmail,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    infoLogger.info('Email sent: ' + info.response);
    return true;
  } catch (error) {
    errorLogger.error('Error sending email:', error);
    return false;
  }
};

module.exports = sendMail;