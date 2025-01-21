import { useState, useEffect } from "react";
import FormField from "../../../../components/ui/FormField";
import Toast from "../../../../components/ui/Toast";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import Button from "../../../../components/ui/Button";

export default function ContactDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [errors, setErrors] = useState({});

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

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContactDetails();
  }, []);

  const fetchContactDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/contact-details`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const result = await response.json();
      if (response.ok) {
        setData(result.data);
        setFormData(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Error fetching contact details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(data);
    setErrors({});
    setIsEditing(false);
    setIsDirty(false);
  };

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

    // Clear error when user starts typing
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

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/contact-details`,
        {
          method: data ? "PUT" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setData(result.data);
        setIsEditing(false);
        setIsDirty(false);
        setToastMessage("Contact details saved successfully!");
        setToastType("success");
        setShowToast(true);
        return { success: true };
      } else {
        setToastMessage(result.message || "Failed to save contact details");
        setToastType("error");
        setShowToast(true);
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error("Error saving contact details:", error);
      setToastMessage("An error occurred while saving");
      setToastType("error");
      setShowToast(true);
      return { success: false, error: "An error occurred while saving" };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await handleSave();
      if (!result.success) {
        setErrors((prev) => ({
          ...prev,
          submit: result.error,
        }));
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
              Contact Details
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
              <h4 className="text-lg font-medium mb-4">Address Information</h4>
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
        </form>
      )}
    </div>
  );
}
