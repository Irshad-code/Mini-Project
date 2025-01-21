const Yup = require("yup");

// Define the request schema for Basic Info
const BasicInfoRequest = Yup.object()
  .shape({
    fullName: Yup.string().required("Full name is required").trim(),
    dateOfBirth: Yup.date().required("Date of birth is required"), // Removed .trim()
    gender: Yup.string().required("Gender is required").trim(),
    college: Yup.string().required("College is required").trim(),
    department: Yup.string().required("Department is required").trim(),
    designation: Yup.string().required("Designation is required").trim(),
    highestQualification: Yup.string()
      .required("Highest qualification is required")
      .trim(),
    totalTeachingExperience: Yup.number().required(
      "Total teaching experience is required"
    ), // Removed .trim()
    totalIndustryExperience: Yup.number().required(
      "Total industry experience is required"
    ), // Removed .trim()
    areaOfSpecialization: Yup.string()
      .required("Area of specialization is required")
      .trim(),
    isKtuPhdGuide: Yup.boolean().required("isKtuPhdGuide is required"), // Removed .trim()
    publicationCount: Yup.number().required("Publication count is required"), // Removed .trim()
    projectCount: Yup.number().required("Project count is required"), // Removed .trim()
    religion: Yup.string()
      .required("Religion is required")
      .trim()
      .transform((value) => value.toUpperCase()), //want to convert to Capital
    caste: Yup.string()
      .required("Caste is required")
      .trim()
      .transform((value) => value.toUpperCase()),
    joiningDate: Yup.date().required("Joining date is required"), // Removed .trim()
    dateofJoiningService: Yup.date().required(
      "Date of joining service is required"
    ), // Removed .trim()
    bloodGroup: Yup.string().required("Blood group is required").trim(),
    websiteUrl: Yup.string().optional(),
    googleScholarUrl: Yup.string().optional(),
    webofscienceUrl: Yup.string().optional(),
    scopusUrl: Yup.string().optional(),
    briefDescription: Yup.string()
      .max(250, "Brief description should not exceed 250 characters")
      .required("Brief description is required")
      .trim(),
  })
  .noUnknown(true); // Remove unknown fields

module.exports = { BasicInfoRequest };
