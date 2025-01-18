const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const Mailjet = require("node-mailjet");
const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

require("dotenv").config();
// Gmail Transporter Configuration
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
};

// Brevo (Sendinblue) Transporter Configuration
const createBrevoTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: process.env.BREVO_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });
};

// SendGrid Mailer Configuration
const sendWithSendGrid = async (to, subject, html) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to,
    from: process.env.DEFAULT_FROM_EMAIL,
    subject,
    html,
  };
  return sgMail.send(msg);
};

// Mailjet Mailer Configuration
const sendWithMailjet = async (to, subject, html) => {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: process.env.DEFAULT_FROM_EMAIL,
          Name: "Your Name",
        },
        To: [
          {
            Email: to,
          },
        ],
        Subject: subject,
        HTMLPart: html,
      },
    ],
  });

  return request;
};

// Generic SendMail Function
const sendMail = async (to, subject, html) => {
  if (process.env.EMAIL_ENABLED === "true") {
    const service = process.env.EMAIL_SERVICE;
    if (service === "gmail") {
      const transporter = createGmailTransporter();
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        html,
      };
      return transporter.sendMail(mailOptions);
    } else if (service === "brevo") {
      const transporter = createBrevoTransporter();
      const mailOptions = {
        from: process.env.DEFAULT_FROM_EMAIL,
        to,
        subject,
        html,
      };
      return transporter.sendMail(mailOptions);
    } else if (service === "sendgrid") {
      return sendWithSendGrid(to, subject, html);
    } else if (service === "mailjet") {
      return sendWithMailjet(to, subject, html);
    } else {
      throw new Error("Invalid EMAIL_SERVICE provider");
    }
  }
};

module.exports = { sendMail };
