const Yup = require("yup");

// Define the request schema for the validation of requests
const MyClassRequest = Yup.object()
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
    currentClass: Yup.boolean().required(),
    //studentList: Yup.array().of(Yup.string()).required(), // studentList is an array of strings
  })
  .noUnknown(true); // This strips any unknown keys from the request


module.exports = { 
  MyClassRequest,  
 }; 
    