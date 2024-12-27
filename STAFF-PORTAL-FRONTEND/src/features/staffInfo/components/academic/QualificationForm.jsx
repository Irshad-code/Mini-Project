import { useState } from "react";
import { FiUpload, FiSave, FiX } from "react-icons/fi";
import FormField from "../../../../components/ui/FormField";
import Button from "../../../../components/ui/Button";

export default function QualificationForm({
  qualification,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    name: qualification?.name || "",
    university: qualification?.university || "",
    year: qualification?.year || "",
    certificateUrl: qualification?.certificateUrl || "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Qualification name is required";
    }
    if (!formData.university.trim()) {
      newErrors.university = "University name is required";
    }
    if (!formData.year.trim()) {
      newErrors.year = "Year is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server here
      // For now, we'll just store the file name
      setFormData((prev) => ({
        ...prev,
        certificateUrl: file.name,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Qualification Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <FormField
          label="University"
          name="university"
          value={formData.university}
          onChange={handleChange}
          error={errors.university}
          required
        />

        <FormField
          label="Year"
          name="year"
          type="number"
          value={formData.year}
          onChange={handleChange}
          error={errors.year}
          required
        />

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Certificate PDF
          </label>
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex items-center space-x-2 px-4 py-2 border border-[var(--color-border-primary)] rounded-md hover:bg-[var(--color-bg-secondary)] transition-colors">
                <FiUpload className="w-4 h-4" />
                <span>Upload PDF</span>
              </div>
            </label>
            {formData.certificateUrl && (
              <span className="text-sm text-[var(--color-text-secondary)]">
                {formData.certificateUrl}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-[var(--color-border-primary)]">
        <Button
          variant="secondary"
          onClick={onCancel}
          icon={<FiX className="w-4 h-4" />}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon={<FiSave className="w-4 h-4" />}
        >
          {qualification ? "Update" : "Add"} Qualification
        </Button>
      </div>
    </form>
  );
}
