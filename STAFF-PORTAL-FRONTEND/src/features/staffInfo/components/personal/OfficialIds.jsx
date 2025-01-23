import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import FormField from "../../../../components/ui/FormField";
import Button from "../../../../components/ui/Button";
import { Grid } from "@mui/material";
import { useUser } from "../../../../contexts/UserContext";
import { useOfficialIds } from "../../hooks/useOfficialIds";
import { useBaseForm, BaseFormLayout } from "../common/BaseForm";

export default function OfficialIds() {
  const { user } = useUser();
  const officialIdsHook = useOfficialIds(user?.userId);

  const initialData = {
    PAN: "",
    AadharCard: "",
    PEN: "",
    KTUId: "",
  };

  const validateForm = (formData) => {
    const newErrors = {};

    // Only validate if value is provided
    if (formData.PAN?.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.PAN)) {
      newErrors.PAN = "Invalid PAN number format";
    }

    if (formData.AadharCard?.trim() && !/^\d{12}$/.test(formData.AadharCard)) {
      newErrors.AadharCard = "Aadhar number must be 12 digits";
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
  } = useBaseForm(initialData, officialIdsHook, validateForm);

  const renderForm = () => (
    <div className="space-y-6">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormField
            label="PEN Number"
            name="PEN"
            value={formData.PEN}
            onChange={handleChange}
            error={errors.PEN}
            disabled={!isEditing}
            placeholder="Enter your PEN number"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            label="KTU ID"
            name="KTUId"
            value={formData.KTUId}
            onChange={handleChange}
            error={errors.KTUId}
            disabled={!isEditing}
            placeholder="Enter your KTU ID"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            label="PAN Number"
            name="PAN"
            value={formData.PAN}
            onChange={handleChange}
            error={errors.PAN}
            disabled={!isEditing}
            placeholder="Enter your PAN number (e.g., ABCDE1234F)"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            label="Aadhar Number"
            name="AadharCard"
            value={formData.AadharCard}
            onChange={handleChange}
            error={errors.AadharCard}
            disabled={!isEditing}
            placeholder="Enter your Aadhar number (12 digits)"
            fullWidth
          />
        </Grid>
      </Grid>
    </div>
  );

  if (!officialIdsHook.data && !isEditing) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Official IDs Found
          </h3>
          <p className="text-gray-500 mb-4">
            You can add your official identification details here.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleEdit}
          icon={<FiEdit2 className="w-4 h-4" />}
        >
          Add Official IDs
        </Button>
      </div>
    );
  }

  return (
    <BaseFormLayout
      title="Official ID Numbers"
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
      data={officialIdsHook.data}
    >
      {renderForm()}
    </BaseFormLayout>
  );
}
