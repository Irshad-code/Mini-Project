import { useState } from "react";
import FormField from "../../../../components/ui/FormField";
import Button from "../../../../components/ui/Button";
import Select from "../../../../components/ui/Select";

const departments = [
  { value: "cse", label: "Computer Science and Engineering" },
  { value: "ece", label: "Electronics and Communication Engineering" },
  { value: "eee", label: "Electrical and Electronics Engineering" },
  { value: "me", label: "Mechanical Engineering" },
  { value: "ce", label: "Civil Engineering" },
  { value: "other", label: "Other" },
];

const designations = [
  { value: "professor", label: "Professor" },
  { value: "associate_professor", label: "Associate Professor" },
  { value: "assistant_professor", label: "Assistant Professor" },
  { value: "hod", label: "Head of Department" },
  { value: "other", label: "Other" },
];

const initialFormData = {
  department: "",
  designation: "",
  joiningDate: "",
  employeeId: "",
  reportingTo: "",
  otherDepartment: "",
  otherDesignation: "",
};

export default function DepartmentInfo() {
  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
          Department Information
        </h3>
        {!isEditing && (
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            options={departments}
            disabled={!isEditing}
            required
          />

          {formData.department === "other" && (
            <FormField
              label="Other Department"
              name="otherDepartment"
              value={formData.otherDepartment}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          )}

          <Select
            label="Designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            options={designations}
            disabled={!isEditing}
            required
          />

          {formData.designation === "other" && (
            <FormField
              label="Other Designation"
              name="otherDesignation"
              value={formData.otherDesignation}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          )}

          <FormField
            label="Employee ID"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />

          <FormField
            label="Joining Date"
            name="joiningDate"
            type="date"
            value={formData.joiningDate}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />

          <FormField
            label="Reporting To"
            name="reportingTo"
            value={formData.reportingTo}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Name of supervisor/reporting authority"
            required
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
