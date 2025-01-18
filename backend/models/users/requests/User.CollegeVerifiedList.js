const Yup = require("yup");

// Define the request schema for the list query
const CollegeVerifiedList = Yup.object()
  .shape({ // Role is optional, but must be valid if provided
    page: Yup.number().min(1, "Page number must be at least 1").default(1), // Default page is 1
    limit: Yup.number()
      .min(1, "Limit must be at least 1")
      .max(100, "Limit cannot exceed 100") // Optional: Set a max limit for pagination
      .default(10), // Default limit is 10
    verified: Yup.boolean().optional().default(false)
  })
  .noUnknown(true); // This strips any unknown keys from the request

module.exports = { CollegeVerifiedList };
