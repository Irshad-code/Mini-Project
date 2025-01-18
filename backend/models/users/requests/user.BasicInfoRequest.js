const Yup = require("yup");
// Define the request schema for login
const BasicInfoRequest = Yup.object()
  .shape({
    fullName: Yup.string().required("Full name is required").trim(),
    dateOfBirth: Yup.date().required("Date of birth is required").trim(),
    gender: Yup.string().required("Gender is required").trim(),
    college: Yup.string().required("College is required").trim(),
    department: Yup.string().required("Department is required").trim(),
    designation: Yup.string().required("Designation is required").trim(),
    highestQualification: Yup.string()
      .required("Highest qualification is required")
      .trim(),
    totalTeachingExperience: Yup.number().required(
      "Total teaching experience is required"
    ),
    totalIndustryExperience: Yup.number().required(
      "Total industry experience is required"
    ),
    areaOfSpecialization: Yup.string()
      .required("Area of specialization is required")
      .trim(),
    isKtuPhdGuide: Yup.boolean().required("isKtuPhdGuide is required").trim(),
    publicationCount: Yup.number().required("Publication count is required"),
    projectCount: Yup.number().required("Project count is required"),
    religion: Yup.string().required("Religion is required").trim(),
    caste: Yup.string().required("Caste is required").trim(),
    joiningDate: Yup.date().required("Joining date is required").trim(),
    briefDescription: Yup.string()
      .max(250, "Brief description should not exceed 250 characters")
      .required("Brief description is required")
      .trim(),
  })
  .noUnknown(true); // Remove unknown fields
module.exports = { BasicInfoRequest };
