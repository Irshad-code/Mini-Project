// requests.js
const Yup = require("yup");
// Validation schema for resend verification email request
const ResendVerificationRequest = Yup.object()
  .shape({
    email: Yup.string()
      .email("Please provide a valid email")
      .required("Email is required")
      .trim()
      .transform((value) => value.toLowerCase()), // Convert email to lowercase
  })
  .noUnknown(true); // Remove unknown fields

module.exports = { ResendVerificationRequest };
