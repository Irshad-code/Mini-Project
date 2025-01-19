import { useState, useEffect } from "react";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import { useBasicInfo } from "../../hooks/useBasicInfo";
import FormField from "../../../../components/ui/FormField";
import Button from "../../../../components/ui/Button";
import { masterService } from "../../../../services/api/master.service";
import { Grid } from "@mui/material";
import { useUser } from "../../../../contexts/UserContext";
import Toast from "../../../../components/ui/Toast";

export default function BasicInfo() {
  const { user } = useUser();
  const {
    data,
    isLoading,
    error,
    isEditing,
    handleEdit,
    handleSave,
    handleCancel,
  } = useBasicInfo(user?.userId);

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
  });
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [departments, setDepartments] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [isMasterDataLoading, setIsMasterDataLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        ...formData,
        ...data,
        // Ensure dates are in correct format
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString().split("T")[0]
          : "",
        joiningDate: data.joiningDate
          ? new Date(data.joiningDate).toISOString().split("T")[0]
          : "",
        dateofJoiningService: data.dateofJoiningService
          ? new Date(data.dateofJoiningService).toISOString().split("T")[0]
          : "",
      });
      setIsDirty(false);
    }
  }, [data]);

  const fetchMasterData = async () => {
    try {
      setIsMasterDataLoading(true);
      console.log('Fetching master data...');
      
      const [departmentsData, collegesData] = await Promise.all([
        masterService.getDepartments(),
        masterService.getColleges(),
      ]);

      console.log('API Response:', {
        departments: departmentsData,
        colleges: collegesData
      });

      if (Array.isArray(departmentsData?.data)) {
        console.log('Setting departments:', departmentsData.data);
        setDepartments(departmentsData.data);
      } else if (Array.isArray(departmentsData)) {
        console.log('Setting departments directly:', departmentsData);
        setDepartments(departmentsData);
      } else {
        console.error('Invalid departments data:', departmentsData);
        setDepartments([]);
      }

      if (Array.isArray(collegesData?.data)) {
        console.log('Setting colleges:', collegesData.data);
        setColleges(collegesData.data);
      } else if (Array.isArray(collegesData)) {
        console.log('Setting colleges directly:', collegesData);
        setColleges(collegesData);
      } else {
        console.error('Invalid colleges data:', collegesData);
        setColleges([]);
      }
    } catch (error) {
      console.error("Error fetching master data:", error);
      setToastMessage("Failed to load colleges and departments");
      setToastType("error");
      setShowToast(true);
      setDepartments([]);
      setColleges([]);
    } finally {
      setIsMasterDataLoading(false);
    }
  };

  useEffect(() => {
    console.log('Current colleges:', colleges);
    console.log('Current departments:', departments);
  }, [colleges, departments]);

  const handleEditClick = async () => {
    await fetchMasterData();
    handleEdit();
  };

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
    if (!formData.dateofJoiningService) {
      newErrors.dateofJoiningService = "Date of joining service is required";
    }
    if (!formData.bloodGroup?.trim()) {
      newErrors.bloodGroup = "Blood group is required";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await handleSave(formData);
      if (result.success) {
        setIsDirty(false);
        setToastMessage("Information updated successfully!");
        setToastType("success");
        setShowToast(true);
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: result.error,
        }));
        setToastMessage(result.error || "Failed to update information");
        setToastType("error");
        setShowToast(true);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <Toast
        show={showToast}
        type={toastType}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />
      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Basic Information
            </h3>
            {!data && !isEditing ? (
              <Button
                variant="primary"
                onClick={handleEditClick}
                icon={<FiEdit2 className="w-4 h-4" />}
                disabled={isMasterDataLoading}
              >
                {isMasterDataLoading ? "Loading..." : "Add Information"}
              </Button>
            ) : !isEditing ? (
              <Button
                variant="ghost"
                onClick={handleEditClick}
                icon={<FiEdit2 className="w-4 h-4" />}
                disabled={isMasterDataLoading}
              >
                {isMasterDataLoading ? "Loading..." : "Edit"}
              </Button>
            ) : null}
          </div>

          {!data && !isEditing ? (
            <div className="text-center py-8 text-gray-500">
              No basic information added yet. Click "Add Information" to get
              started.
            </div>
          ) : (
            <>
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
                        { key: "select-gender", value: "", label: "Select gender" },
                        { key: "male", value: "Male", label: "Male" },
                        { key: "female", value: "Female", label: "Female" },
                        { key: "other", value: "Other", label: "Other" },
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
                      value={formData.college || ""}
                      onChange={handleChange}
                      disabled={!isEditing || isMasterDataLoading}
                      error={errors.college}
                      options={[
                        { value: "", label: "Select college" },
                        ...(colleges || []).map((college) => {
                          console.log('Mapping college:', college);
                          return {
                            value: college._id || college.id || college.collegeId,
                            label: college.name || college.collegeName,
                          };
                        }),
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
                      value={formData.department || ""}
                      onChange={handleChange}
                      disabled={!isEditing || isMasterDataLoading}
                      error={errors.department}
                      options={[
                        { value: "", label: "Select department" },
                        ...(departments || []).map((dept) => {
                          console.log('Mapping department:', dept);
                          return {
                            value: dept._id || dept.id || dept.departmentId,
                            label: dept.name || dept.departmentName,
                          };
                        }),
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
                      error={errors.designation}
                      options={[
                        { key: "select-designation", value: "", label: "Select designation" },
                        { key: "professor", value: "Professor", label: "Professor" },
                        { key: "associate-professor", value: "Associate Professor", label: "Associate Professor" },
                        { key: "assistant-professor", value: "Assistant Professor", label: "Assistant Professor" },
                        { key: "head-of-department", value: "Head of Department", label: "Head of Department" },
                        { key: "programmer", value: "Programmer", label: "Programmer" },
                        { key: "lab-assistant", value: "Lab Assistant", label: "Lab Assistant" },
                        { key: "technical-assistant", value: "Technical Assistant", label: "Technical Assistant" },
                        { key: "system-administrator", value: "System Administrator", label: "System Administrator" },
                        { key: "research-associate", value: "Research Associate", label: "Research Associate" },
                        { key: "teaching-assistant", value: "Teaching Assistant", label: "Teaching Assistant" },
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
                        { key: "select-qualification", value: "", label: "Select qualification" },
                        { key: "phd", value: "PhD", label: "PhD" },
                        { key: "mtech", value: "MTech", label: "M.Tech" },
                        { key: "btech", value: "BTech", label: "B.Tech" },
                        { key: "mca", value: "MCA", label: "MCA" },
                        { key: "msc", value: "MSc", label: "M.Sc" },
                        { key: "bsc", value: "BSc", label: "B.Sc" },
                        { key: "diploma", value: "Diploma", label: "Diploma" },
                        { key: "mba", value: "MBA", label: "MBA" },
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
                        { key: "select-ktu-phd-guide", value: "", label: "Select option" },
                        { key: "no", value: false, label: "No" },
                        { key: "yes", value: true, label: "Yes" },
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
                      label="Blood Group"
                      name="bloodGroup"
                      type="select"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      disabled={!isEditing}
                      error={errors.bloodGroup}
                      options={[
                        { key: "select-blood-group", value: "", label: "Select blood group" },
                        { key: "a-positive", value: "A+", label: "A+" },
                        { key: "a-negative", value: "A-", label: "A-" },
                        { key: "b-positive", value: "B+", label: "B+" },
                        { key: "b-negative", value: "B-", label: "B-" },
                        { key: "ab-positive", value: "AB+", label: "AB+" },
                        { key: "ab-negative", value: "AB-", label: "AB-" },
                        { key: "o-positive", value: "O+", label: "O+" },
                        { key: "o-negative", value: "O-", label: "O-" },
                      ]}
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
                  <Grid item xs={12} md={6}>
                    <FormField
                      label="Joining date in Service"
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
                      label="Website Url"
                      name="websiteUrl"
                      type="url"
                      value={formData.websiteUrl}
                      onChange={handleChange}
                      disabled={!isEditing}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      label="Google Scholar Url"
                      name="googleScholarUrl"
                      type="url"
                      value={formData.googleScholarUrl}
                      onChange={handleChange}
                      disabled={!isEditing}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      label="Webofscience Url"
                      name="webofscienceUrl"
                      type="url"
                      value={formData.webofscienceUrl}
                      onChange={handleChange}
                      disabled={!isEditing}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormField
                      label="Scopus Url"
                      name="scopusUrl"
                      type="url"
                      value={formData.scopusUrl}
                      onChange={handleChange}
                      disabled={!isEditing}
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
            </>
          )}

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
      )}
    </div>
  );
}
