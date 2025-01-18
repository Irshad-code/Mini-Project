const Yup = require("yup");

// Define the request schema for the list query
const SearchRequest = Yup.object()
  .shape({
    role: Yup.string()
      .oneOf(["ADMIN_USER", "REGULAR_USER"], "Invalid user role")
      .optional(),

    username: Yup.string()
      .nullable()
      // .min(4, "Username must be at least 4 characters long")
      .matches(
        /^[a-zA-Z0-9]*\s?[a-zA-Z0-9]*$/, // Allow empty string
        "Username must be alphanumeric and can contain spaces between words"
      )
      .optional(),

    email: Yup.string()
      .nullable()
      .trim()
      .optional()
      .transform((value) => value.toLowerCase()), // Convert email to lowercase

    page: Yup.number().min(1, "Page number must be at least 1").default(1), // Default page is 1
    limit: Yup.number()
      .min(1, "Limit must be at least 1")
      .max(100, "Limit cannot exceed 100") // Optional: Set a max limit for pagination
      .default(10), // Default limit is 10
  })
  .noUnknown(true); // This strips any unknown keys from the request

module.exports = { SearchRequest };
