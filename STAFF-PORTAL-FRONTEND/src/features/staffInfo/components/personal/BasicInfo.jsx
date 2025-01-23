import { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useBasicInfo } from "../../hooks/useBasicInfo";
import FormField from "../../../../components/ui/FormField";
import Button from "../../../../components/ui/Button";
import { masterService } from "../../../../services/api/master.service";
import { Grid } from "@mui/material";
import { useUser } from "../../../../contexts/UserContext";
import { useBaseForm, BaseFormLayout } from "../common/BaseForm";
import Select from "../../../../components/ui/Select";

const DESIGNATIONS = [
  { value: "PROFESSOR", label: "PROFESSOR" },
  { value: "ASSOCIATE_PROFESSOR", label: "ASSOCIATE PROFESSOR" },
  { value: "ASSISTANT_PROFESSOR", label: "ASSISTANT PROFESSOR" },
  { value: "HOD", label: "HEAD OF DEPARTMENT" },
  { value: "DEAN", label: "DEAN" },
  { value: "PRINCIPAL", label: "PRINCIPAL" },
  { value: "LECTURER", label: "LECTURER" },
  { value: "LAB_INSTRUCTOR", label: "LAB INSTRUCTOR" },
  { value: "TECHNICAL_STAFF", label: "TECHNICAL STAFF" },
  { value: "PROGRAMMER", label: "PROGRAMMER" },
  { value: "SYSTEM_ADMINISTRATOR", label: "SYSTEM ADMINISTRATOR" },
  { value: "RESEARCH_ASSOCIATE", label: "RESEARCH ASSOCIATE" },
  { value: "TEACHING_ASSISTANT", label: "TEACHING ASSISTANT" },
  { value: "WORKSHOP_SUPERINTENDENT", label: "WORKSHOP SUPERINTENDENT" },
  { value: "LIBRARIAN", label: "LIBRARIAN" },
  { value: "OTHER", label: "OTHER" },
];

const RELIGIONS = [
  { value: "HINDU", label: "HINDU" },
  { value: "ISLAM", label: "ISLAM" },
  { value: "CHRISTIAN", label: "CHRISTIAN" },
  { value: "SIKH", label: "SIKH" },
  { value: "BUDDHIST", label: "BUDDHIST" },
  { value: "JAIN", label: "JAIN" },
  { value: "OTHER", label: "OTHER" },
];

const BLOOD_GROUPS = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
];

const QUALIFICATIONS = [
  { value: "PHD", label: "PHD" },
  { value: "MTECH", label: "MTECH" },
  { value: "MCA", label: "MCA" },
  { value: "MBA", label: "MBA" },
  { value: "BTECH", label: "BTECH" },
  { value: "BCA", label: "BCA" },
  { value: "DIPLOMA", label: "DIPLOMA" },
  { value: "ITITI", label: "ITITI" },
  { value: "PLUSTWO", label: "PLUS TWO" },
  { value: "DEGREE", label: "DEGREE" },
  { value: "OTHER", label: "OTHER" },
];

export default function BasicInfo() {
  const { user } = useUser();
  const basicInfoHook = useBasicInfo(user?.userId);

  const [departments, setDepartments] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [isMasterDataLoading, setIsMasterDataLoading] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const initialData = {
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
    bloodGroup: "",
    joiningDate: "",
    dateofJoiningService: "",
    totalTeachingExperience: "",
    totalIndustryExperience: "",
    websiteUrl: "",
    googleScholarUrl: "",
    webofscienceUrl: "",
    scopusUrl: "",
    briefDescription: "",
  };

  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.dateOfBirth?.trim()) {
      newErrors.dateOfBirth = "Date of birth is required";
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
    } else if (!DESIGNATIONS.some((d) => d.value === formData.designation)) {
      newErrors.designation = "Invalid designation selected";
    }

    if (!formData.highestQualification?.trim()) {
      newErrors.highestQualification = "Highest qualification is required";
    } else if (
      !QUALIFICATIONS.some((q) => q.value === formData.highestQualification)
    ) {
      newErrors.highestQualification = "Invalid qualification selected";
    }

    if (!formData.areaOfSpecialization?.trim()) {
      newErrors.areaOfSpecialization = "Area of specialization is required";
    }

    if (!formData.religion?.trim()) {
      newErrors.religion = "Religion is required";
    } else if (!RELIGIONS.some((r) => r.value === formData.religion)) {
      newErrors.religion = "Invalid religion selected";
    }

    if (!formData.caste?.trim()) {
      newErrors.caste = "Caste is required";
    }

    if (!formData.bloodGroup?.trim()) {
      newErrors.bloodGroup = "Blood group is required";
    } else if (!BLOOD_GROUPS.some((bg) => bg.value === formData.bloodGroup)) {
      newErrors.bloodGroup = "Invalid blood group selected";
    }

    if (!formData.joiningDate?.trim()) {
      newErrors.joiningDate = "Joining date is required";
    }

    if (!formData.dateofJoiningService?.trim()) {
      newErrors.dateofJoiningService = "Date of joining service is required";
    }

    if (formData.totalTeachingExperience === undefined || formData.totalTeachingExperience === "") {
      newErrors.totalTeachingExperience = "Total teaching experience is required";
    } else if (isNaN(formData.totalTeachingExperience) || Number(formData.totalTeachingExperience) < 0) {
      newErrors.totalTeachingExperience = "Please enter a valid teaching experience";
    }

    if (formData.totalIndustryExperience === undefined || formData.totalIndustryExperience === "") {
      newErrors.totalIndustryExperience = "Total industry experience is required";
    } else if (isNaN(formData.totalIndustryExperience) || Number(formData.totalIndustryExperience) < 0) {
      newErrors.totalIndustryExperience = "Please enter a valid industry experience";
    }

    if (formData.publicationCount === undefined || formData.publicationCount === "") {
      newErrors.publicationCount = "Publication count is required";
    } else if (isNaN(formData.publicationCount) || Number(formData.publicationCount) < 0) {
      newErrors.publicationCount = "Please enter a valid publication count";
    }

    if (formData.projectCount === undefined || formData.projectCount === "") {
      newErrors.projectCount = "Project count is required";
    } else if (isNaN(formData.projectCount) || Number(formData.projectCount) < 0) {
      newErrors.projectCount = "Please enter a valid project count";
    }

    if (!formData.briefDescription?.trim()) {
      newErrors.briefDescription = "Brief description is required";
    }

    const urlFields = ["websiteUrl", "googleScholarUrl", "webofscienceUrl", "scopusUrl"];
    urlFields.forEach((field) => {
      if (formData[field]?.trim()) {
        try {
          new URL(formData[field]);
        } catch (e) {
          newErrors[field] = "Please enter a valid URL";
        }
      }
    });

    return newErrors;
  };

  const {
    formData,
    setFormData,
    errors,
    isDirty,
    showToast,
    setShowToast,
    toastMessage,
    toastType,
    handleChange: baseHandleChange,
    handleSubmit: baseHandleSubmit,
    isLoading,
    error,
    isEditing,
    handleEdit: baseHandleEdit,
    handleCancel,
  } = useBaseForm(initialData, basicInfoHook, validateForm);

  const fetchMasterData = async () => {
    try {
      setIsMasterDataLoading(true);
      const [departmentsData, collegesData] = await Promise.all([
        masterService.getDepartments(),
        masterService.getColleges(),
      ]);

      if (Array.isArray(departmentsData?.data)) {
        setDepartments(departmentsData.data);
      } else if (Array.isArray(departmentsData)) {
        setDepartments(departmentsData);
      }

      if (Array.isArray(collegesData?.data)) {
        setColleges(collegesData.data);
      } else if (Array.isArray(collegesData)) {
        setColleges(collegesData);
      }
    } catch (error) {
      console.error("Error fetching master data:", error);
    } finally {
      setIsMasterDataLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    if (colleges.length && departments.length && basicInfoHook.data) {
      const college = colleges.find(
        (c) =>
          c._id === basicInfoHook.data.college?.collegeId ||
          c.collegeId === basicInfoHook.data.college?.collegeId ||
          c.name === basicInfoHook.data.college?.collegeName ||
          c.collegeName === basicInfoHook.data.college?.collegeName
      );
      const department = departments.find(
        (d) =>
          d._id === basicInfoHook.data.department?.departmentId ||
          d.departmentId === basicInfoHook.data.department?.departmentId ||
          d.name === basicInfoHook.data.department?.departmentName ||
          d.departmentName === basicInfoHook.data.department?.departmentName
      );

      setSelectedCollege(college);
      setSelectedDepartment(department);
    }
  }, [colleges, departments, basicInfoHook.data]);

  useEffect(() => {
    if (basicInfoHook.data) {
      const formattedData = {
        ...basicInfoHook.data,
        college:
          selectedCollege?._id ||
          selectedCollege?.collegeId ||
          basicInfoHook.data.college?.collegeId ||
          "",
        department:
          selectedDepartment?._id ||
          selectedDepartment?.departmentId ||
          basicInfoHook.data.department?.departmentId ||
          "",
        dateOfBirth: basicInfoHook.data.dateOfBirth
          ? new Date(basicInfoHook.data.dateOfBirth).toISOString().split("T")[0]
          : "",
        joiningDate: basicInfoHook.data.joiningDate
          ? new Date(basicInfoHook.data.joiningDate).toISOString().split("T")[0]
          : "",
        dateofJoiningService: basicInfoHook.data.dateofJoiningService
          ? new Date(basicInfoHook.data.dateofJoiningService)
              .toISOString()
              .split("T")[0]
          : "",
      };
      setFormData(formattedData);
    }
  }, [basicInfoHook.data, selectedCollege, selectedDepartment]);

  const handleEdit = async () => {
    if (!colleges.length || !departments.length) {
      await fetchMasterData();
    }
    baseHandleEdit();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "college") {
      const college = colleges.find(
        (c) => c._id === value || c.collegeId === value
      );
      setSelectedCollege(college);
    } else if (name === "department") {
      const department = departments.find(
        (d) => d._id === value || d.departmentId === value
      );
      setSelectedDepartment(department);
    }

    baseHandleChange(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      college: {
        collegeId: selectedCollege?._id || selectedCollege?.collegeId,
        collegeName: selectedCollege?.name || selectedCollege?.collegeName,
      },
      department: {
        departmentId:
          selectedDepartment?._id || selectedDepartment?.departmentId,
        departmentName:
          selectedDepartment?.name || selectedDepartment?.departmentName,
      },
      dateOfBirth: formData.dateOfBirth
        ? new Date(formData.dateOfBirth).toISOString()
        : null,
      joiningDate: formData.joiningDate
        ? new Date(formData.joiningDate).toISOString()
        : null,
      dateofJoiningService: formData.dateofJoiningService
        ? new Date(formData.dateofJoiningService).toISOString()
        : null,
    };

    await baseHandleSubmit(e, formattedData);
  };

  const renderForm = () => (
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
            error={errors.gender}
            options={[
              { value: "", label: "Select gender" },
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" },
            ]}
            required
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormField
            label="College"
            name="college"
            type={isEditing ? "select" : "text"}
            value={
              isEditing
                ? formData.college
                : selectedCollege?.name ||
                  selectedCollege?.collegeName ||
                  basicInfoHook.data?.college?.collegeName ||
                  ""
            }
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.college}
            options={
              isEditing
                ? [
                    { value: "", label: "Select college" },
                    ...(colleges || []).map((college) => ({
                      value: college._id || college.collegeId,
                      label: college.name || college.collegeName,
                    })),
                  ]
                : []
            }
            required
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormField
            label="Department"
            name="department"
            type={isEditing ? "select" : "text"}
            value={
              isEditing
                ? formData.department
                : selectedDepartment?.name ||
                  selectedDepartment?.departmentName ||
                  basicInfoHook.data?.department?.departmentName ||
                  ""
            }
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.department}
            options={
              isEditing
                ? [
                    { value: "", label: "Select department" },
                    ...(departments || []).map((dept) => ({
                      value: dept._id || dept.departmentId,
                      label: dept.name || dept.departmentName,
                    })),
                  ]
                : []
            }
            required
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Select
            label="Designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            error={errors.designation}
            disabled={!isEditing}
            required
            options={DESIGNATIONS}
            placeholder="Select your designation"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Select
            label="Highest Qualification"
            name="highestQualification"
            value={formData.highestQualification}
            onChange={handleChange}
            error={errors.highestQualification}
            disabled={!isEditing}
            required
            options={QUALIFICATIONS}
            placeholder="Select your highest qualification"
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
            label="KTU PhD Guide"
            name="isKtuPhdGuide"
            type="select"
            value={formData.isKtuPhdGuide.toString()}
            onChange={handleChange}
            disabled={!isEditing}
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ]}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            label="Total Teaching Experience (Years)"
            name="totalTeachingExperience"
            type="number"
            min="0"
            value={formData.totalTeachingExperience}
            onChange={handleChange}
            error={errors.totalTeachingExperience}
            disabled={!isEditing}
            required
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            label="Total Industry Experience (Years)"
            name="totalIndustryExperience"
            type="number"
            min="0"
            value={formData.totalIndustryExperience}
            onChange={handleChange}
            error={errors.totalIndustryExperience}
            disabled={!isEditing}
            required
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            label="Publication Count"
            name="publicationCount"
            type="number"
            min="0"
            value={formData.publicationCount}
            onChange={handleChange}
            error={errors.publicationCount}
            disabled={!isEditing}
            required
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            label="Project Count"
            name="projectCount"
            type="number"
            min="0"
            value={formData.projectCount}
            onChange={handleChange}
            error={errors.projectCount}
            disabled={!isEditing}
            required
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Select
            label="Religion"
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            error={errors.religion}
            disabled={!isEditing}
            required
            options={RELIGIONS}
            placeholder="Select your religion"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            label="Caste"
            name="caste"
            value={formData.caste}
            onChange={handleChange}
            error={errors.caste}
            disabled={!isEditing}
            required
            placeholder="Enter your caste"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Select
            label="Blood Group"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            error={errors.bloodGroup}
            disabled={!isEditing}
            required
            options={BLOOD_GROUPS}
            placeholder="Select your blood group"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormField
            label="Joining Date in current isntitute"
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

        <Grid item xs={12} md={6}>
          <FormField
            label="Date of Joining Service"
            name="dateofJoiningService"
            type="date"
            value={formData.dateofJoiningService}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.dateofJoiningService}
            required
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormField
            label="Website URL"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleChange}
            error={errors.websiteUrl}
            disabled={!isEditing}
            placeholder="Enter your website URL"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormField
            label="Google Scholar URL"
            name="googleScholarUrl"
            value={formData.googleScholarUrl}
            onChange={handleChange}
            error={errors.googleScholarUrl}
            disabled={!isEditing}
            placeholder="Enter your Google Scholar URL"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormField
            label="Web of Science URL"
            name="webofscienceUrl"
            value={formData.webofscienceUrl}
            onChange={handleChange}
            error={errors.webofscienceUrl}
            disabled={!isEditing}
            placeholder="Enter your Web of Science URL"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormField
            label="Scopus URL"
            name="scopusUrl"
            value={formData.scopusUrl}
            onChange={handleChange}
            error={errors.scopusUrl}
            disabled={!isEditing}
            placeholder="Enter your Scopus URL"
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <FormField
            label="Brief Description"
            name="briefDescription"
            type="textarea"
            value={formData.briefDescription}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.briefDescription}
            required
            fullWidth
          />
        </Grid>
      </Grid>
    </div>
  );

  return (
    <BaseFormLayout
      title="Basic Information"
      isEditing={isEditing}
      isDirty={isDirty}
      handleEdit={handleEdit}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      showToast={showToast}
      toastMessage={toastMessage}
      toastType={toastType}
      setShowToast={setShowToast}
      isLoading={isLoading}
      error={error}
      data={basicInfoHook.data}
      isMasterDataLoading={isMasterDataLoading}
    >
      {renderForm()}
    </BaseFormLayout>
  );
}
