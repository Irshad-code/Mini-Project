import { useState, useEffect } from "react";
import FormField from "../../../../components/ui/FormField";
import Toast from "../../../../components/ui/Toast";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import Button from "../../../../components/ui/Button";
import { useUser } from "../../../../contexts/UserContext";
import { useContactDetails } from "../../hooks/useContactDetails";

export default function ContactDetails() {
  const { user } = useUser();
  const {
    data,
    isLoading,
    error,
    isEditing,
    handleEdit,
    handleSave,
    handleCancel,
  } = useContactDetails(user?.userId);

  const [formData, setFormData] = useState({
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
  });
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    if (data) {
      setFormData(data);
      setIsDirty(false);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setIsDirty(true);

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.contactEmail?.trim()) {
      newErrors.contactEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Invalid email format";
    }

    if (!formData.contactNumber?.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number must be 10 digits";
    }

    if (!formData.address?.addressLine1?.trim()) {
      newErrors["address.addressLine1"] = "Address Line 1 is required";
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
      newErrors["address.pincode"] = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.address.pincode)) {
      newErrors["address.pincode"] = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await handleSave(formData);
      if (result.success) {
        setToastMessage("Contact details saved successfully!");
        setToastType("success");
        setShowToast(true);
        setIsDirty(false);
      } else {
        setToastMessage(result.error || "Failed to save contact details");
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
        <>
          {!data && !isEditing ? (
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
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                  Contact Details
                </h3>
                {!isEditing ? (
                  <Button
                    variant="ghost"
                    onClick={handleEdit}
                    icon={<FiEdit2 className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-6">
                <FormField
                  label="Contact Email"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  error={errors.contactEmail}
                  required
                  placeholder="Enter your contact email"
                />

                <FormField
                  label="Contact Number"
                  name="contactNumber"
                  type="tel"
                  value={formData.contactNumber || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  error={errors.contactNumber}
                  required
                  placeholder="Enter your contact number"
                />

                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium mb-4">
                    Address Information
                  </h4>
                  <div className="space-y-6">
                    <FormField
                      label="Address Line 1"
                      name="address.addressLine1"
                      type="text"
                      value={formData.address?.addressLine1 || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      error={errors["address.addressLine1"]}
                      required
                      placeholder="Enter your address line 1"
                    />

                    <FormField
                      label="Address Line 2"
                      name="address.addressLine2"
                      type="text"
                      value={formData.address?.addressLine2 || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      error={errors["address.addressLine2"]}
                      placeholder="Enter your address line 2 (optional)"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="City"
                        name="address.city"
                        type="text"
                        value={formData.address?.city || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        error={errors["address.city"]}
                        required
                        placeholder="Enter your city"
                      />

                      <FormField
                        label="State"
                        name="address.state"
                        type="text"
                        value={formData.address?.state || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        error={errors["address.state"]}
                        required
                        placeholder="Enter your state"
                      />

                      <FormField
                        label="Country"
                        name="address.country"
                        type="text"
                        value={formData.address?.country || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        error={errors["address.country"]}
                        required
                        placeholder="Enter your country"
                      />

                      <FormField
                        label="Pincode"
                        name="address.pincode"
                        type="text"
                        value={formData.address?.pincode || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        error={errors["address.pincode"]}
                        required
                        placeholder="Enter your pincode"
                      />
                    </div>
                  </div>
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
          )}
        </>
      )}
    </div>
  );
}
