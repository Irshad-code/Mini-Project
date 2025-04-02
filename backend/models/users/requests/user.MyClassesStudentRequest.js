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
    // Class Records as an Object (Map) with Dynamic Keys
    classRecords: Yup.object().test(
      "is-valid-class-records",
      "Each classId must have valid series1Marks, series2Marks, attendance, and internalMarks",
      (value) => {
        if (!value || typeof value !== "object") return false;
        return Object.values(value).every((record) =>
          Yup.object({
            series1Marks: Yup.number().required(),
            series2Marks: Yup.number().required(),
            attendance: Yup.number().required(),
            internalMarks: Yup.number().required(),
          }).isValidSync(record)
        );
      }
    ),
  })
  .noUnknown(true); // This strips any unknown keys from the request


module.exports = { 
  MyClassesStudentRequest,  
 };
    