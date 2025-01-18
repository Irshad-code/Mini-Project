const Yup = require("yup");

// Schema to validate the token is a valid hex string
const tokenValidationSchema = Yup.object({
  token: Yup.string()
    .matches(/^[0-9a-fA-F]+$/, "Invalid hex token")
    .required("Token is required"),
});

// Separate function to validate URL params (token)
const validateTokenParam = async (req, res, next) => {
  try {
    // Validate the token from req.params
    await tokenValidationSchema.validate(req.params, { stripUnknown: true });

    // If validation passes, proceed to the next middleware/controller
    next();
  } catch (error) {
    // Handle validation error, send a response
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.errors, // Provide detailed validation errors
    });
  }
};

module.exports = { validateTokenParam };
