import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import FormField from "../../../../components/ui/FormField";
import Button from "../../../../components/ui/Button";
import { Grid } from "@mui/material";
import { useUser } from "../../../../contexts/UserContext";
import { useContactDetails } from "../../hooks/useContactDetails";
import { useBaseForm, BaseFormLayout } from "../common/BaseForm";

export default function ContactDetails() {
  const { user } = useUser();
  const contactDetailsHook = useContactDetails(user?.userId);

  const initialData = {
    contactEmail: "",
    contactNumber: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
  };

  const validateForm = (formData) => {
    const newErrors = {};

    // Contact Information Validation
    if (!formData.contactEmail?.trim()) {
      newErrors.contactEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    if (!formData.contactNumber?.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid 10-digit contact number";
    }

    // Address Validation
    if (!formData.address?.addressLine1?.trim()) {
      newErrors["address.addressLine1"] = "Address line 1 is required";
    }

    if (!formData.address?.city?.trim()) {
      newErrors["address.city"] = "City is required";
    }

    if (!formData.address?.state?.trim()) {
      newErrors["address.state"] = "State is required";
    }

    if (!formData.address?.country?.trim()) {
      newErrors["address.country"] = "Country is required";
    }

    if (!formData.address?.pincode?.trim()) {
      newErrors["address.pincode"] = "PIN code is required";
    } else if (!/^\d{6}$/.test(formData.address.pincode)) {
      newErrors["address.pincode"] = "Please enter a valid 6-digit PIN code";
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
  } = useBaseForm(initialData, contactDetailsHook, validateForm);

  const handleNestedChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      handleChange({
        target: {
          name: "address",
          value: { ...formData.address, [field]: value },
        },
      });
    } else {
      handleChange(e);
    }
  };

  const renderForm = () => (
    <div className="space-y-6">
      <Grid container spacing={3}>
        {/* Contact Information */}
        <Grid item xs={12} sm={6}>
          <FormField
            label="Contact Email"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            error={errors.contactEmail}
            disabled={!isEditing}
            required
            placeholder="Enter your contact email"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            label="Contact Number"
            name="contactNumber"
            type="tel"
            value={formData.contactNumber}
            onChange={handleChange}
            error={errors.contactNumber}
            disabled={!isEditing}
            required
            placeholder="Enter your 10-digit contact number"
            fullWidth
          />
        </Grid>

        {/* Address Fields */}
        <Grid item xs={12}>
          <FormField
            label="Address Line 1"
            name="address.addressLine1"
            value={formData.address?.addressLine1}
            onChange={handleNestedChange}
            error={errors["address.addressLine1"]}
            disabled={!isEditing}
            required
            placeholder="Enter your street address"
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <FormField
            label="Address Line 2"
            name="address.addressLine2"
            value={formData.address?.addressLine2}
            onChange={handleNestedChange}
            error={errors["address.addressLine2"]}
            disabled={!isEditing}
            placeholder="Enter apartment, suite, unit, etc. (optional)"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            label="City"
            name="address.city"
            value={formData.address?.city}
            onChange={handleNestedChange}
            error={errors["address.city"]}
            disabled={!isEditing}
            required
            placeholder="Enter your city"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            label="State"
            name="address.state"
            value={formData.address?.state}
            onChange={handleNestedChange}
            error={errors["address.state"]}
            disabled={!isEditing}
            required
            placeholder="Enter your state"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            label="Country"
            name="address.country"
            value={formData.address?.country}
            onChange={handleNestedChange}
            error={errors["address.country"]}
            disabled={!isEditing}
            required
            placeholder="Enter your country"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            label="PIN Code"
            name="address.pincode"
            value={formData.address?.pincode}
            onChange={handleNestedChange}
            error={errors["address.pincode"]}
            disabled={!isEditing}
            required
            placeholder="Enter your 6-digit PIN code"
            fullWidth
          />
        </Grid>
      </Grid>
    </div>
  );

  if (!contactDetailsHook.data && !isEditing) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <p className="text-gray-500">
          No contact details found. Please add your contact information.
        </p>
        <Button
          variant="primary"
          onClick={handleEdit}
          icon={<FiEdit2 className="w-4 h-4" />}
        >
          Add Information
        </Button>
      </div>
    );
  }

  return (
    <BaseFormLayout
      title="Contact Details"
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
      data={contactDetailsHook.data}
    >
      {renderForm()}
    </BaseFormLayout>
  );
}
