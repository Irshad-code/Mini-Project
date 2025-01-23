import { useFamily } from "../../hooks/useFamily";
import { useUser } from "../../../../contexts/UserContext";
import { useBaseForm, BaseFormLayout } from "../common/BaseForm";
import { Grid } from "@mui/material";
import FormField from "../../../../components/ui/FormField";
import Select from "../../../../components/ui/Select";

export default function Family() {
  const { user } = useUser();
  const familyHook = useFamily(user?.userId);

  const initialData = {
    fatherName: "",
    motherName: "",
    spouseName: "",
    marritalStatus: "",
    numberOfChildren: "",
  };

  const marriageStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
  ];

  const validateForm = (formData) => {
    const newErrors = {};

    // Required fields validation
    if (!formData.fatherName?.trim()) {
      newErrors.fatherName = "Father's name is required";
    }

    if (!formData.motherName?.trim()) {
      newErrors.motherName = "Mother's name is required";
    }

    // Validate spouse name only if married
    if (formData.marritalStatus === "married") {
      if (!formData.spouseName?.trim()) {
        newErrors.spouseName = "Spouse name is required when married";
      }
    }

    // Validate number of children only if married and a value is provided
    if (formData.marritalStatus === "married" && formData.numberOfChildren !== "" && formData.numberOfChildren !== null) {
      const numChildren = Number(formData.numberOfChildren);
      if (isNaN(numChildren) || numChildren < 0) {
        newErrors.numberOfChildren = "Number of children must be a non-negative number";
      }
    }

    return newErrors;
  };

  const {
    formData,
    errors,
    isDirty,
    showToast,
    setShowToast,
    toastMessage,
    toastType,
    handleChange,
    handleSubmit,
    isLoading,
    error,
    isEditing,
    handleEdit,
    handleCancel,
  } = useBaseForm(initialData, familyHook, validateForm);

  const handleMaritalStatusChange = (event) => {
    const newStatus = event.target.value;
    if (newStatus !== "married") {
      handleChange({ target: { name: "spouseName", value: "" } });
      handleChange({ target: { name: "numberOfChildren", value: "" } });
    }
    handleChange(event);
  };

  const renderForm = () => (
    <div className="space-y-6">
      <Grid container spacing={3}>
        {/* Parent Information */}
        <Grid item xs={12} sm={6}>
          <FormField
            label="Father's Name"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            error={errors.fatherName}
            disabled={!isEditing}
            required
            placeholder="Enter father's full name"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            label="Mother's Name"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            error={errors.motherName}
            disabled={!isEditing}
            required
            placeholder="Enter mother's full name"
            fullWidth
          />
        </Grid>

        {/* Marital Status */}
        <Grid item xs={12} sm={6}>
          <Select
            label="Marital Status"
            name="marritalStatus"
            value={formData.marritalStatus}
            onChange={handleMaritalStatusChange}
            error={errors.marritalStatus}
            disabled={!isEditing}
            options={marriageStatusOptions}
            placeholder="Select marital status"
            fullWidth
          />
        </Grid>

        {/* Spouse and Children Information - Only show if married */}
        {formData.marritalStatus === "married" && (
          <>
            <Grid item xs={12} sm={6}>
              <FormField
                label="Spouse Name"
                name="spouseName"
                value={formData.spouseName}
                onChange={handleChange}
                error={errors.spouseName}
                disabled={!isEditing}
                required
                placeholder="Enter spouse's full name"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormField
                label="Number of Children"
                name="numberOfChildren"
                type="number"
                value={formData.numberOfChildren}
                onChange={handleChange}
                error={errors.numberOfChildren}
                disabled={!isEditing}
                placeholder="Enter number of children"
                fullWidth
                min="0"
              />
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );

  return (
    <BaseFormLayout
      title="Family Details"
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
      data={familyHook.data}
    >
      {renderForm()}
    </BaseFormLayout>
  );
}
