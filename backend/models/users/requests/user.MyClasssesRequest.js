const Yup = require("yup");

// Define the request schema for the validation of requests
const CreateMyClassRequest = Yup.object()
  .shape({
  //  id: Yup.string().required(),
   subject: Yup.string().required(),
   code: Yup.string().required(),
   semester: Yup.string().required(),
   branch: Yup.string().required(),
   students: Yup.number().required().min(1),
   schedule: Yup.string().required(),
   syllabus: Yup.string().required(), // Assuming this is a string path or URL
   courseOutcome: Yup.string().required(),
  })
  .noUnknown(true); // This strips any unknown keys from the request

  const DeleteMyClassRequest = Yup.object()
    .shape({
      //  id: Yup.string().required(),
    })
    .noUnknown(true);

module.exports = { 
  CreateMyClassRequest,
  DeleteMyClassRequest
 };
