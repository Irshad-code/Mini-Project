const Yup = require("yup");

const classRecordSchema = Yup.object().shape({
  series1Marks: Yup.number().required("Series 1 marks are required"),
  series2Marks: Yup.number().required("Series 2 marks are required"),
  attendanceDates: Yup.array().of(Yup.string()).default([]), // Ensures it's an array of strings
  internalMarks: Yup.number().required("Internal marks is required"),
});

// Define the request schema for the validation of requests
const MyClassesStudentRequest = Yup.object()
  .shape({
    // id: Yup.string().required(),
    name: Yup.string().required("Name is required"),
    rollNumber: Yup.number().required("Roll number is required"),
    semester: Yup.string().required("Semester is required"),
    branch: Yup.string().required("Branch is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    classRecords: Yup.object(),
    classRecords: classRecordSchema.required("Class records are required") // Ensure classRecords is an object
  })
  .noUnknown(true); // This strips any unknown keys from the request

module.exports = {
  MyClassesStudentRequest,
};
