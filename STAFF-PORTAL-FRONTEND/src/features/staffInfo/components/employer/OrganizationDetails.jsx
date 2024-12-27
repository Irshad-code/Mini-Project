import { useState } from "react";
import FormField from "../../../../components/ui/FormField";
import Button from "../../../../components/ui/Button";
import Checkbox from "../../../../components/ui/Checkbox";
import Select from "../../../../components/ui/Select";

const organizationTypes = [
  { value: "engineering", label: "Engineering College" },
  { value: "polytechnic", label: "Polytechnic College" },
  { value: "technical", label: "Technical High School" },
  { value: "other", label: "Other" },
];

const authorities = [
  { value: "dte", label: "Directorate of Technical Education (DTE)" },
  { value: "dme", label: "Directorate of Medical Education (DME)" },
  { value: "other", label: "Other" },
];

const initialFormData = {
  organizationName: "",
  organizationType: "",
  isGovernment: false,
  authority: "",
  registrationNumber: "",
  establishmentYear: "",
  website: "",
};

export default function OrganizationDetails() {
  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log("Form submitted:", formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Organization Details
        </h3>
        {!isEditing && (
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Organization Name"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />

          <Select
            label="Organization Type"
            name="organizationType"
            value={formData.organizationType}
            onChange={handleChange}
            options={organizationTypes}
            disabled={!isEditing}
            required
          />

          <div className="flex items-center space-x-4">
            <Checkbox
              label="Government Institution"
              name="isGovernment"
              checked={formData.isGovernment}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <Select
            label="Under Authority"
            name="authority"
            value={formData.authority}
            onChange={handleChange}
            options={authorities}
            disabled={!isEditing}
            required
          />

          <FormField
            label="Registration Number"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />

          <FormField
            label="Year of Establishment"
            name="establishmentYear"
            type="number"
            value={formData.establishmentYear}
            onChange={handleChange}
            disabled={!isEditing}
            min="1800"
            max={new Date().getFullYear()}
            required
          />

          <FormField
            label="Website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="https://"
          />
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setFormData(initialFormData);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
