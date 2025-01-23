import { useState, useEffect } from "react";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import FormField from "../../../../components/ui/FormField";
import Button from "../../../../components/ui/Button";
import Toast from "../../../../components/ui/Toast";
import { useUser } from "../../../../contexts/UserContext";
import { useOfficialIds } from "../../hooks/useOfficialIds";

export default function OfficialIds() {
  const { user } = useUser();
  const {
    data,
    isLoading,
    error,
    isEditing,
    handleEdit,
    handleSave,
    handleCancel,
  } = useOfficialIds(user?.userId);

  const [formData, setFormData] = useState({
    PAN: "",
    AadharCard: "",
    PEN: "",
    KTUId: "",
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.PAN?.trim()) {
      newErrors.PAN = "PAN number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.PAN)) {
      newErrors.PAN = "Invalid PAN number format";
    }

    if (!formData.AadharCard?.trim()) {
      newErrors.AadharCard = "Aadhar number is required";
    } else if (!/^\d{12}$/.test(formData.AadharCard)) {
      newErrors.AadharCard = "Aadhar number must be 12 digits";
    }

    if (!formData.PEN?.trim()) {
      newErrors.PEN = "PEN number is required";
    }

    if (!formData.KTUId?.trim()) {
      newErrors.KTUId = "KTU ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await handleSave(formData);
      if (result.success) {
        setIsDirty(false);
        setToastMessage(
          data
            ? "Official IDs updated successfully!"
            : "Official IDs created successfully!"
        );
        setToastType("success");
        setShowToast(true);
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: result.error,
        }));
        setToastMessage(result.error || "Failed to save official IDs");
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
      ) : !data && !isEditing ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Official IDs Found
            </h3>
            <p className="text-gray-500 mb-4">
              Please add your official identification details to complete your profile.
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
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Official ID Numbers
            </h3>
            {!isEditing ? (
              <Button
                variant="ghost"
                onClick={handleEdit}
                icon={<FiEdit2 className="w-4 h-4" />}
              >
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  icon={<FiX className="w-4 h-4" />}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  icon={<FiSave className="w-4 h-4" />}
                  disabled={!isDirty}
                >
                  {data ? "Save Changes" : "Create"}
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <FormField
              label="PEN Number"
              name="PEN"
              value={formData.PEN}
              onChange={handleChange}
              error={errors.PEN}
              disabled={!isEditing}
              required
              placeholder="Enter your PEN number"
            />
            <FormField
              label="KTU ID"
              name="KTUId"
              value={formData.KTUId}
              onChange={handleChange}
              error={errors.KTUId}
              disabled={!isEditing}
              required
              placeholder="Enter your KTU ID"
            />
            <FormField
              label="PAN Card Number"
              name="PAN"
              value={formData.PAN}
              onChange={handleChange}
              error={errors.PAN}
              disabled={!isEditing}
              required
              placeholder="ABCDE1234F"
            />
            <FormField
              label="Aadhar Number"
              name="AadharCard"
              value={formData.AadharCard}
              onChange={handleChange}
              error={errors.AadharCard}
              disabled={!isEditing}
              required
              placeholder="123456789012"
            />
          </div>
        </form>
      )}
    </div>
  );
}
