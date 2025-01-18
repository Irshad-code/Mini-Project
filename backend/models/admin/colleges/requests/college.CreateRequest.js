const Yup = require("yup");

// Define the request schema for login
const CreateRequest = Yup.object()
  .shape({
    collegeName: Yup.string().required("College name is required").trim(),
    district: Yup.string()
      .required("District is required")
      .trim()
      .transform((value) => value.toUpperCase()), // Convert to uppercase
    state: Yup.string()
      .required("State is required")
      .trim()
      .transform((value) => value.toUpperCase()), // Convert to uppercase
    country: Yup.string()
      .required("Country is required")
      .trim()
      .transform((value) => value.toUpperCase()), // Convert to uppercase
  })
  .noUnknown(true); // Remove unknown fields

module.exports = { CreateRequest };
