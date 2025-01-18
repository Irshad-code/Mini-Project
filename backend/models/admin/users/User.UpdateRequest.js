const Yup = require("yup");

// Define the request schema for updating user details
const UpdateRequest = Yup.object()
  .shape({
    username: Yup.string()
      .min(4, "Username must be at least 4 characters long")
      .matches(
        /^[a-zA-Z0-9]+(?:\s[a-zA-Z0-9]+)*$/,
        "Username must be alphanumeric and can contain spaces between words"
      )
      .trim()
      .optional(),
    email: Yup.string()
      .email("Please provide a valid email")
      .trim()
      .transform((value) => (value ? value.toLowerCase() : value)) // Convert email to lowercase if defined
      .optional(),
    role: Yup.string()
      .oneOf(["SUPER_USER", "REGULAR_USER", "ADMIN_USER"], "Invalid user role")
      .optional(),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .optional()
      .nullable(), // Optional phone number, can be null
  })
  .noUnknown(true); // Strip any unknown keys from the request

module.exports = { UpdateRequest };
