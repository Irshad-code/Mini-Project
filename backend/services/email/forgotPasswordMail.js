const { sendMail } = require("./emailService");

const sendForgotPasswordEmail = async (email, participantName, resetLink) => {
  const subject = "Reset Your Password";

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
        padding: 20px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
      }

      .email-header {
        text-align: center;
        padding: 20px;
        background-color: #1976D2;
        color: #ffffff;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }

      .email-header h1 {
        margin: 0;
        font-size: 24px;
      }

      .email-body {
        padding: 30px 20px;
        font-size: 16px;
        line-height: 1.6;
        color: #000000;
      }

      .email-body p {
        margin: 0 0 15px;
        color: #000000;
      }
      
      .email-body h2 {
          color: #000000;
      }

      .email-body a {
        color: #1976D2;
        text-decoration: none;
      }

      .email-body a.button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #1976D2;
        color: #ffffff;
        border-radius: 5px;
        text-decoration: none;
      }

      .email-footer {
        background-color: #f5f5f5;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #666666;
      }

      .email-footer p {
        margin: 0;
        color: #666666;
      }

      .email-footer a {
        color: #1E88E5;
        text-decoration: none;
      }
    </style>
  </head>

  <body>
    <table role="presentation" class="email-container">
      <tr>
        <td>
          <div class="email-header">
            <h1>Password Reset Request</h1>
          </div>

          <div class="email-body">
            <h2>Dear ${participantName},</h2>
            <p>We received a request to reset the password for your account. If you made this request, please click the button below to reset your password:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            <p>If you did not request this, you can safely ignore this email and no changes will be made to your account.</p>
            <p>For your security, the link will expire in 1 hour.</p>
            <div style="border-top: 1px solid #1976D2; margin: 20px 0;"></div>
            <p style="color: #555;">If you’re having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:</p>
            <p style="color: #1E88E5;">${resetLink}</p>
          </div>

          <div class="email-footer">
            <p>Thank you for using our service.</p>
            <p>Need help? Contact our support team at <a href="mailto:support@example.com">support@example.com</a>.</p>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;

  return sendMail(email, subject, html);
};

module.exports = { sendForgotPasswordEmail };
