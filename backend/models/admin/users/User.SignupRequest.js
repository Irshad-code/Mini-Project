const { deprecate } = require("mocha/lib/errors");
const Yup = require("yup");

// Define the request schema for signup
const SignupRequest = Yup.object()
  .shape({
    username: Yup.string()
      .min(4, "Username must be at least 4 characters long")
      .required("Username is required")
      .trim(),
    email: Yup.string()
      .email("Please provide a valid email")
      .required("Email is required")
      .trim()
      .transform((value) => value.toLowerCase()), // Convert email to lowercase
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required")
      .trim(),
    department: Yup.string().required("Department is required"),
  })
  .noUnknown(true); // This strips any unknown keys from the request

module.exports = { SignupRequest };
