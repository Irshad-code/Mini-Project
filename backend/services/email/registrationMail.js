const { sendMail } = require("./emailService");

const sendRegistrationEmail = async (
  toEmail,
  participantName,
  verificationLink
) => {
  const subject = "Welcome to GEC TECH LABS";
  const html = `
  <html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
    
    /* General Styles */
    body {
      font-family: 'Poppins', sans-serif;
      background-color: #f4f4f4;
      color: #000000;
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: none;
      width: 100% !important;
      height: 100% !important;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 0;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }

    .email-header {
      text-align: center;
      padding: 20px 0;
      background-color: #1976D2;
      color: #ffffff;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }

    .email-header h1 {
      margin: 0;
      font-size: 22px;
    }

    .email-body {
      padding: 20px;
      font-size: 16px;
      line-height: 1.6;
      color: #000000;
    }

    .email-body2  {
        text-align: center;
    }

    .email-body h2 {
      margin-top: 0;
      color: #000000;
    }

    .email-body2 p {
      margin: 0 0 15px;
      color: #666666;
    }

    .email-body p {
      margin: 0 0 15px;
      color: #000000;
    }

    .email-body a {
      color: #1976D2;
      text-decoration: none;
    }

    .email-body .button-container {
      text-align: center;
      margin: 20px 0;
    }

    .email-body a.button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #1976D2;
      color: #ffffff;
      border-radius: 5px;
      text-decoration: none;
    }

    .email-footer {
      text-align: center;
      padding: 20px;
      background-color: #f4f4f4;
      color: #666666;
      font-size: 14px;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    .email-footer p {
      margin: 0;
      color: #666666;
    }

    .email-footer a {
      color: #1E88E5;
      text-decoration: none;
    }

    .divider {
      border-top: 1px solid #1976D2;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <table role="presentation" class="email-container">
    <tr>
      <td>
        <div class="email-header">
          <h1>Welcome to GEC TECH LABS/h1>
        </div>
        <div class="email-body">
          <h2>Dear ${participantName},</h2>
          <p>Thank you for signing up for the <strong> Program</strong>!</p>
          <p>Please verify your email by clicking the link below:</p>
          <div class="button-container">
            <a href="${verificationLink}" class="button">Verify your Email</a>
          </div>
          <p>If the button doesn't work, copy and paste the following URL into your browser:</p>
          <p style="color: #1E88E5;">${verificationLink}</p>
          <div class="divider"></div>

          <div class="email-body2">
          <p style="color: #666666;">If you did not request this, please ignore this email. No changes will be made to your account.</p>
          <p style="color: #666666;">For your security, the link will expire in 1 hour.</p>
        </div>
          <div class="divider"></div>
          <p>We are excited to have you join us!</p>
          <p>We are looking forward to your active engagement and valuable contributions to the community!</p>
          <p>Best regards,</p>
          <p style="color: #1976D2;"><strong>Udyama 1.0 Team</strong></p>
        </div>
        <div class="email-footer">
          <p>If you have any questions, feel free to <a href="mailto:support@oncampus.com">contact us</a> anytime.</p>
          <p>&copy; GEC TECH LABS. All Rights Reserved.</p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>

`;

  return sendMail(toEmail, subject, html);
};

module.exports = { sendRegistrationEmail };
