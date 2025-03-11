const Yup = require("yup");

// Define the request schema for the validation of requests
const MyClassesStudentRequest = Yup.object()
  .shape({
    //  id: Yup.string().required(),
    name: Yup.string().required(),
    rollNumber: Yup.number().required(),
    semester: Yup.string().required(),
    branch: Yup.string().required(),
    email: Yup.string().required(),
    phone: Yup.string().required(),
    classId: Yup.string().required(),
  })
  .noUnknown(true); // This strips any unknown keys from the request


module.exports = { 
  MyClassesStudentRequest,  
 };
    