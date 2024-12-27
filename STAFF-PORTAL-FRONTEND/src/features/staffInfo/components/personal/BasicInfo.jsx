import { useState, useEffect } from "react";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import { useEmployee } from "../../hooks/useEmployee";
import FormField from "../../../../components/ui/FormField";
import Button from "../../../../components/ui/Button";

export default function BasicInfo() {
  const { employee, isEditing, handleEdit, handleSave, handleCancel } =
    useEmployee();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    college: "",
    department: "",
    ...employee, // Spread employee data if it exists
  });
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!isEditing && employee) {
      setFormData(employee);
      setErrors({});
      setIsDirty(false);
    }
  }, [isEditing, employee]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Name must be at least 2 characters long";
    }

    if (!formData?.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = "Must be at least 18 years old";
      }
    }

    if (!formData?.college?.trim()) {
      newErrors.college = "College name is required";
    }

    if (!formData?.department?.trim()) {
      newErrors.department = "Department is required";
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        <div className="space-y-6">
          <FormField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.fullName}
            required
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            disabled={true}
            helperText="Email cannot be changed"
          />

          <FormField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.dateOfBirth}
            required
          />
        </div>

        <div className="space-y-6">
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
          />

          <FormField
            label="College"
            name="college"
            value={formData.college}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.college}
            required
          />

          <FormField
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.department}
            required
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
