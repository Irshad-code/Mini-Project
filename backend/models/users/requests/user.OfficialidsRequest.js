const Yup = require("yup");

// Define the request schema for Basic Info
const OfficialidsRequest = Yup.object()
  .shape({
    PAN: Yup.string()
      .nullable()
      .trim()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),

    AadharCard: Yup.string().nullable().trim(),
    PEN: Yup.string().nullable().trim(),
    KTUId: Yup.string().nullable().trim(),
  })
  .noUnknown(true); // Remove unknown fields

module.exports = { OfficialidsRequest };
