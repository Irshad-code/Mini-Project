import { useState, useEffect } from "react";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import { useEmployee } from "../../hooks/useEmployee";
import FormField from "../../../../components/ui/FormField";
import Button from "../../../../components/ui/Button";
import { masterService } from "../../../../services/api/master.service";
import { Grid } from "@mui/material"; // Import Grid from MUI

export default function BasicInfo() {
  const { employee, isEditing, handleEdit, handleSave, handleCancel } =
    useEmployee();
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    college: "",
    department: "",
    designation: "",
    highestQualification: "",
    areaOfSpecialization: "",
    isKtuPhdGuide: false,
    publicationCount: "",
    projectCount: "",
    religion: "",
    caste: "",
    joiningDate: "",
    totalTeachingExperience: "",
    totalIndustryExperience: "",
    briefDescription: "",
    websiteUrl: "",
    ...employee, // Spread employee data if it exists
  });
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    const fetchDepartmentsAndColleges = async () => {
      try {
        const [departmentsData, collegesData] = await Promise.all([
          masterService.getDepartments(),
          masterService.getColleges(),
        ]);

        setDepartments(departmentsData);
        setColleges(collegesData);
      } catch (error) {
        console.error("Error fetching master data:", error);
      }
    };

    fetchDepartmentsAndColleges();
  }, []);

  useEffect(() => {
    if (!isEditing && employee) {
      setFormData(employee);
      setErrors({});
      setIsDirty(false);
    }
  }, [isEditing, employee]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = "Must be at least 18 years old";
      }
    }

    if (!formData.gender?.trim()) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.college?.trim()) {
      newErrors.college = "College is required";
    }

    if (!formData.department?.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.designation?.trim()) {
      newErrors.designation = "Designation is required";
    }

    if (!formData.highestQualification?.trim()) {
      newErrors.highestQualification = "Highest qualification is required";
    }

    if (!formData.totalTeachingExperience?.toString()?.trim()) {
      newErrors.totalTeachingExperience =
        "Total teaching experience is required";
    } else {
      const years = Number(formData.totalTeachingExperience);
      if (isNaN(years) || years < 0) {
        newErrors.totalTeachingExperience =
          "Please enter a valid number of years";
      }
    }

    if (!formData.totalIndustryExperience?.toString()?.trim()) {
      newErrors.totalIndustryExperience =
        "Total industry experience is required";
    } else {
      const years = Number(formData.totalIndustryExperience);
      if (isNaN(years) || years < 0) {
        newErrors.totalIndustryExperience =
          "Please enter a valid number of years";
      }
    }

    if (!formData.areaOfSpecialization?.trim()) {
      newErrors.areaOfSpecialization = "Area of specialization is required";
    }

    if (formData.isKtuPhdGuide === undefined || formData.isKtuPhdGuide === "") {
      newErrors.isKtuPhdGuide = "KTU PhD Guide status is required";
    }

    if (!formData.publicationCount?.toString()?.trim()) {
      newErrors.publicationCount = "Publication count is required";
    } else {
      const count = Number(formData.publicationCount);
      if (isNaN(count) || count < 0) {
        newErrors.publicationCount = "Please enter a valid number";
      }
    }

    if (!formData.projectCount?.toString()?.trim()) {
      newErrors.projectCount = "Project count is required";
    } else {
      const count = Number(formData.projectCount);
      if (isNaN(count) || count < 0) {
        newErrors.projectCount = "Please enter a valid number";
      }
    }

    if (!formData.religion?.trim()) {
      newErrors.religion = "Religion is required";
    }

    if (!formData.caste?.trim()) {
      newErrors.caste = "Caste is required";
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate = "Joining date is required";
    }

    if (!formData.briefDescription?.trim()) {
      newErrors.briefDescription = "Brief description is required";
    } else if (formData.briefDescription.length > 250) {
      newErrors.briefDescription =
        "Brief description should not exceed 250 characters";
    }

    if (formData.websiteUrl?.trim()) {
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(formData.websiteUrl)) {
        newErrors.websiteUrl =
          "Please enter a valid URL starting with http:// or https://";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Basic Information
        </h3>
        {!isEditing ? (
          <Button
            variant="ghost"
            onClick={handleEdit}
            icon={<FiEdit2 className="w-4 h-4" />}
          >
            Edit Information
          </Button>
        ) : null}
      </div>

      <div className="space-y-6">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              error={errors.fullName}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={!isEditing}
              error={errors.dateOfBirth}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormField
              label="Gender"
              name="gender"
              type="select"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditing}
              options={[
                { value: "", label: "Select gender" },
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormField
              label="College"
              name="college"
              type="select"
              value={formData.college}
              onChange={handleChange}
              disabled={!isEditing}
              options={[
                { value: "", label: "Select college" },
                ...(colleges?.map((college) => ({
                  value: college.collegeId,
                  label: college.collegeName,
                })) || []),
              ]}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormField
              label="Department"
              name="department"
              type="select"
              value={formData.department}
              onChange={handleChange}
              disabled={!isEditing}
              options={[
                { value: "", label: "Select department" },
                ...(departments?.map((dept) => ({
                  value: dept.departmentId,
                  label: dept.departmentName,
                })) || []),
              ]}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormField
              label="Designation"
              name="designation"
              type="select"
              value={formData.designation}
              onChange={handleChange}
              disabled={!isEditing}
              options={[
                { value: "", label: "Select designation" },
                { value: "Professor", label: "Professor" },
                { value: "Associate Professor", label: "Associate Professor" },
                { value: "Assistant Professor", label: "Assistant Professor" },
                { value: "Head of Department", label: "Head of Department" },
                { value: "Programmer", label: "Programmer" },
                { value: "Lab Assistant", label: "Lab Assistant" },
                { value: "Technical Assistant", label: "Technical Assistant" },
                {
                  value: "System Administrator",
                  label: "System Administrator",
                },
                { value: "Research Associate", label: "Research Associate" },
                { value: "Teaching Assistant", label: "Teaching Assistant" },
              ]}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormField
              label="Highest Qualification"
              name="highestQualification"
              type="select"
              value={formData.highestQualification}
              onChange={handleChange}
              disabled={!isEditing}
              options={[
                { value: "", label: "Select qualification" },
                { value: "PhD", label: "PhD" },
                { value: "MTech", label: "M.Tech" },
                { value: "BTech", label: "B.Tech" },
                { value: "MCA", label: "MCA" },
                { value: "MSc", label: "M.Sc" },
                { value: "BSc", label: "B.Sc" },
                { value: "Diploma", label: "Diploma" },
                { value: "MBA", label: "MBA" },
              ]}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormField
              label="Total Teaching Experience (Years)"
              name="totalTeachingExperience"
              type="number"
              value={formData.totalTeachingExperience}
              onChange={handleChange}
              disabled={!isEditing}
              error={errors.totalTeachingExperience}
              min="0"
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormField
              label="Total Industry Experience (Years)"
              name="totalIndustryExperience"
              type="number"
              value={formData.totalIndustryExperience}
              onChange={handleChange}
              disabled={!isEditing}
              error={errors.totalIndustryExperience}
              min="0"
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormField
              label="Area of Specialization"
              name="areaOfSpecialization"
              value={formData.areaOfSpecialization}
              onChange={handleChange}
              disabled={!isEditing}
              error={errors.areaOfSpecialization}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormField
              label="KTU Approved PhD Guide"
              name="isKtuPhdGuide"
              type="select"
              value={formData.isKtuPhdGuide}
              onChange={handleChange}
              disabled={!isEditing}
              options={[
                { value: "", label: "Select option" },
                { value: false, label: "No" },
                { value: true, label: "Yes" },
              ]}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormField
              label="Total Publications"
              name="publicationCount"
              type="number"
              value={formData.publicationCount}
              onChange={handleChange}
              disabled={!isEditing}
              error={errors.publicationCount}
              min="0"
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormField
              label="Total Projects"
              name="projectCount"
              type="number"
              value={formData.projectCount}
              onChange={handleChange}
              disabled={!isEditing}
              error={errors.projectCount}
              min="0"
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormField
              label="Religion"
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              disabled={!isEditing}
              error={errors.religion}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormField
              label="Caste"
              name="caste"
              value={formData.caste}
              onChange={handleChange}
              disabled={!isEditing}
              error={errors.caste}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormField
              label="Joining Date in current institution"
              name="joiningDate"
              type="date"
              value={formData.joiningDate}
              onChange={handleChange}
              disabled={!isEditing}
              error={errors.joiningDate}
              required
              fullWidth
            />
          </Grid>
        </Grid>

        <div className="mt-6">
          <FormField
            label="Brief Description about yourself"
            name="briefDescription"
            type="textarea"
            value={formData.briefDescription}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.briefDescription}
            placeholder="Brief description about your experience, research and project interests (max 250 characters)"
            rows={3}
            required
            fullWidth
          />
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-3 pt-6 border-t border-[var(--color-border-primary)]">
          <Button
            variant="secondary"
            onClick={handleCancel}
            icon={<FiX className="w-4 h-4" />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={<FiSave className="w-4 h-4" />}
            disabled={!isDirty}
          >
            Save Changes
          </Button>
        </div>
      )}
    </form>
  );
}
