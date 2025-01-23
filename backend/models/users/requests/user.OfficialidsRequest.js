const Yup = require("yup");

// Define the request schema for Basic Info
const OfficialidsRequest = Yup.object()
  .shape({
    PAN: Yup.string()
      .nullable()
      .trim()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
      .required("PAN Card is required"),

    AadharCard: Yup.string()
      .nullable()
      .trim()
      .matches(/^\d{12}$/, "Aadhar number must be 12 digits")
      .required("Aadhar Card is required"),

    PEN: Yup.string()
      .nullable()
      .trim()
      .matches(/^[A-Z0-9]{1,20}$/, "Invalid PEN format")
      .required("PEN number is required"),

    KTUId: Yup.string()
      .nullable()
      .trim()
      .matches(
        /^[A-Z0-9-]+$/,
        "Invalid KTU ID format (alphanumeric with optional hyphen)"
      ),
  })
  .noUnknown(true); // Remove unknown fields

module.exports = { OfficialidsRequest };
