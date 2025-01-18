const Yup = require("yup");

// Define the request schema for updating only username and image
const UpdateRequest = Yup.object()
  .shape({
    username: Yup.string()
      .trim() // Removes extra spaces
      .nullable() // Accepts null or empty string
      .matches(
        /^[a-zA-Z0-9]+(?:\s[a-zA-Z0-9]+)*$/,
        "Username must be alphanumeric and can contain spaces between words"
      )
      .optional(), // Makes the field optional (can be empty or null)

    image: Yup.mixed().optional(), // Optional if the user wants to update the image
    phoneNumber: Yup.number().nullable().optional(),
  })
  .noUnknown(true); // This will strip any unknown fields from the request body

module.exports = { UpdateRequest };
