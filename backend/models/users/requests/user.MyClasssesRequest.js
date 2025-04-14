const Yup = require("yup");

// Define the request schema for the validation of requests
const MyClassRequest = Yup.object()
  .shape({
    //  id: Yup.string().required(),
    subject: Yup.string().required(),
    code: Yup.string().required(),
    semester: Yup.string().required(),
    type: Yup.string().required(),
    branch: Yup.string().when("type", {
      is: "ordinary",
      then: Yup.string().required("Branch is required for ordinary class"),
      otherwise: Yup.string().notRequired(),
    }),
    schedule: Yup.string().required(),
    currentClass: Yup.boolean().required(),
    // syllabus: Yup.string().required(), // Assuming this is a string path or URL
    //courseOutcome: Yup.string().required(),
    //studentList: Yup.array().of(Yup.string()).required(), // studentList is an array of strings
  })
  .noUnknown(true); // This strips any unknown keys from the request


module.exports = { 
  MyClassRequest,  
 }; 
    