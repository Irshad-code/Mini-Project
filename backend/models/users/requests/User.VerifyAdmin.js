const Yup = require("yup");

// Define the request schema for updating only username and image
const UpdateVerificationRequest = Yup.object()
  .shape({
    verify: Yup.boolean()
    .required("Verify field required")
  })
  .noUnknown(true); // This will strip any unknown fields from the request body

module.exports = { UpdateVerificationRequest };
