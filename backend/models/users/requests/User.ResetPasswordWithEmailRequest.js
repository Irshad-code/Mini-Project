const Yup = require("yup");
// Define the request schema for login
const ResetPasswordRequestWithEmail = Yup.object()
  .shape({
    email: Yup.string()
      .email("Please provide a valid email")
      .required("Email is required")
      .trim()
      .transform((value) => value.toLowerCase()), // Convert email to lowercase
    password: Yup.string().required("Password is required").trim(),
  })
  .noUnknown(true); // Remove unknown fields
module.exports = { ResetPasswordRequestWithEmail };
