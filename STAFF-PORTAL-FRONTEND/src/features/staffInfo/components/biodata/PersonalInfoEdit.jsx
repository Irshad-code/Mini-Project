import { useState } from "react";
import Button from "../../../../components/ui/Button";
import FormField from "../../../../components/ui/FormField";
import Select from "../../../../components/ui/Select";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const maritalStatusOptions = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
];

export default function PersonalInfoEdit({ data, onSave, onCancel }) {
  const [formData, setFormData] = useState(data || {});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Full Name"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          required
        />
        <FormField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth || ""}
          onChange={handleInputChange}
          required
        />
        <Select
          label="Gender"
          value={formData.gender || ""}
          onChange={handleSelectChange("gender")}
          options={genderOptions}
          required
        />
        <FormField
          label="Nationality"
          name="nationality"
          value={formData.nationality || ""}
          onChange={handleInputChange}
          required
        />
        <Select
          label="Marital Status"
          value={formData.maritalStatus || ""}
          onChange={handleSelectChange("maritalStatus")}
          options={maritalStatusOptions}
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
