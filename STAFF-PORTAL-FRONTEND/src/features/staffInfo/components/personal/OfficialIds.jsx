import { useState, useEffect } from "react";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import FormField from "../../../../components/ui/FormField";
import Button from "../../../../components/ui/Button";
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
    panCardNumber: "",
    aadharNumber: "",
    penNumber: "",
    ktuId: "",
  });
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        ...formData,
        ...data,
      });
      setIsDirty(false);
    }
  }, [data]);

  const validateForm = () => {
    const newErrors = {};

    // PAN Card validation (Format: ABCDE1234F)
    if (!formData.panCardNumber?.trim()) {
      newErrors.panCardNumber = "PAN Card number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCardNumber)) {
      newErrors.panCardNumber =
        "Invalid PAN Card number format (e.g., ABCDE1234F)";
    }

    // Aadhar validation (12 digits)
    if (!formData.aadharNumber?.trim()) {
      newErrors.aadharNumber = "Aadhar number is required";
    } else if (!/^\d{12}$/.test(formData.aadharNumber)) {
      newErrors.aadharNumber = "Aadhar number must be 12 digits";
    }

    // PEN validation (alphanumeric, max 20 chars)
    if (!formData.penNumber?.trim()) {
      newErrors.penNumber = "PEN number is required";
    } else if (!/^[A-Z0-9]{1,20}$/.test(formData.penNumber)) {
      newErrors.penNumber =
        "Invalid PEN number format (max 20 alphanumeric characters)";
    }

    // KTU ID validation (alphanumeric, max 20 chars)
    if (!formData.ktuId?.trim()) {
      newErrors.ktuId = "KTU ID is required";
    } else if (!/^[A-Z0-9]{1,20}$/.test(formData.ktuId)) {
      newErrors.ktuId =
        "Invalid KTU ID format (max 20 alphanumeric characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Auto-format input values
    switch (name) {
      case "panCardNumber":
        formattedValue = value.toUpperCase();
        break;
      case "aadharNumber":
        formattedValue = value.replace(/\D/g, "").slice(0, 12);
        break;
      case "penNumber":
        formattedValue = value.toUpperCase();
        break;
      case "ktuId":
        formattedValue = value.toUpperCase();
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
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
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: result.error,
        }));
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
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
              Official ID Numbers
            </h3>
            {!data && !isEditing ? (
              <Button
                variant="primary"
                onClick={handleEdit}
                icon={<FiEdit2 className="w-4 h-4" />}
              >
                Add Information
              </Button>
            ) : !isEditing ? (
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
                  variant="success"
                  type="submit"
                  icon={<FiSave className="w-4 h-4" />}
                  disabled={!isDirty}
                >
                  Save Changes
                </Button>
                <Button
                  variant="danger"
                  onClick={handleCancel}
                  icon={<FiX className="w-4 h-4" />}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <FormField
              label="PEN Number"
              name="penNumber"
              value={formData.penNumber}
              onChange={handleChange}
              error={errors.penNumber}
              disabled={!isEditing}
              required
              placeholder="Enter your PEN number"
            />
            <FormField
              label="KTU ID"
              name="ktuId"
              value={formData.ktuId}
              onChange={handleChange}
              error={errors.ktuId}
              disabled={!isEditing}
              required
              placeholder="Enter your KTU ID"
            />
            <FormField
              label="PAN Card Number"
              name="panCardNumber"
              value={formData.panCardNumber}
              onChange={handleChange}
              error={errors.panCardNumber}
              disabled={!isEditing}
              required
              placeholder="ABCDE1234F"
            />

            <FormField
              label="Aadhar Number"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              error={errors.aadharNumber}
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
