const Yup = require("yup");

const ResetPasswordRequest = Yup.object({
  token: Yup.string()
    .matches(/^[a-f0-9]{64}$/, "Invalid token format") // Assuming a 64-character hex token
    .required("Token is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("New password is required"),
});

module.exports = { ResetPasswordRequest };
