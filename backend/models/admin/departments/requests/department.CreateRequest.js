const Yup = require("yup");

// Define the request schema for login
const CreateRequest = Yup.object()
  .shape({
    departmentName: Yup.string().required("department name is required").trim(),
  })
  .noUnknown(true); // Remove unknown fields

module.exports = { CreateRequest };
