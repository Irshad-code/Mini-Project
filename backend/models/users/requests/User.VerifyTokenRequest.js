const Yup = require("yup");
// Define a schema for token validation
const VerifyTokenRequest = yup.object({
  token: Yup.string()
    .matches(
      /^[0-9a-fA-F]+$/,
      "Invalid token format. Token must be a hex string."
    )
    .required("Token is required"),
});
