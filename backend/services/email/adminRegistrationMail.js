const { sendMail } = require("./emailService");

const sendadminRegistrationEmail = async (
  email,
  participantName,
  password,
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
          font-family: 'Poppins','Trebuchet MS';
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
        .email-body h2 {
          color: #000000;
        }
        .email-body p {
          color: #000000;
          margin: 0 0 15px;
        }
        .email-body a {
          color: #1976D2;
          text-decoration: none;
        }
        .email-body a.button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #1976D2;
          color: #ffffff;
          border-radius: 5px;
          text-decoration: none;
        }
        .email-body .button-container {
          text-align: center;
          margin: 20px 0;
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
      </style>
    </head>
    <body>
      <table role="presentation" class="email-container">
        <tr>
          <td>
            <div class="email-header">
              <h1>Welcome to GEC Tech LABS</h1>
            </div>
            <div class="email-body">
              <h2>Dear ${participantName},</h2>
              <p>We are delighted to inform you that you have been successfully registered for the <strong>Program</strong>.</p>
              <p>Please note that your registered email is ${email} and your temporary password is ${password}.</p>
              <p>Please verify your email address by clicking the link below:</p>
              <div class="button-container">
                <a href="${verificationLink}" class="button">Verify your Email</a>
              <div style="border-top: 1px solid #1976D2; margin: 20px 0;"></div>
                <p style="color: #666666;">If the button doesn't work, copy and paste the URL below into your browser:</p>
                <p style="color: #1E88E5;">${verificationLink}</p>
              </div>
              <div style="border-top: 1px solid #1976D2; margin: 20px 0;"></div>
              <p>We look forward to your active participation and contribution to the community!</p>
              <br />
              <p>Best regards,</p>
              <p style="color: #1976D2;"><strong>GEC Tech Labs Team</strong></p>
            </div>
            <div class="email-footer">
              <p>If you have any questions, feel free to <a href="mailto:support@gectechlabs.com">contact us</a> anytime.</p>
              <p>&copy; 2024 GEC TECH LABS. All Rights Reserved.</p>
            </div>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

  return sendMail(email, subject, html);
};

module.exports = { sendadminRegistrationEmail };
