import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Button from "../../../../components/ui/Button";
import FormField from "../../../../components/ui/FormField";
import Select from "../../../../components/ui/Select";

const degreeOptions = [
  { value: "phd", label: "Ph.D" },
  { value: "mtech", label: "M.Tech" },
  { value: "msc", label: "M.Sc" },
  { value: "btech", label: "B.Tech" },
  { value: "bsc", label: "B.Sc" },
];

const emptyEducation = {
  degree: "",
  specialization: "",
  university: "",
  yearOfPassing: "",
  grade: "",
};

export default function AcademicDetailsEdit({ data, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    education: data?.education || [{ ...emptyEducation }],
  });

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [name]: value } : edu
      ),
    }));
  };

  const handleSelectChange = (index, name) => (value) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [name]: value } : edu
      ),
    }));
  };

  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { ...emptyEducation }],
    }));
  };

  const handleRemoveEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-8">
        {formData.education.map((edu, index) => (
          <div key={index} className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium text-[var(--color-text-primary)]">
                Education {index + 1}
              </h4>
              {formData.education.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => handleRemoveEducation(index)}
                  icon={<FiTrash2 className="w-4 h-4" />}
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Degree"
                value={edu.degree}
                onChange={handleSelectChange(index, "degree")}
                options={degreeOptions}
                required
              />
              <FormField
                label="Specialization"
                name="specialization"
                value={edu.specialization}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
              <FormField
                label="University"
                name="university"
                value={edu.university}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
              <FormField
                label="Year of Passing"
                name="yearOfPassing"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={edu.yearOfPassing}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
              <FormField
                label="Grade/CGPA"
                name="grade"
                value={edu.grade}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="secondary"
        onClick={handleAddEducation}
        icon={<FiPlus className="w-4 h-4" />}
      >
        Add Education
      </Button>

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
