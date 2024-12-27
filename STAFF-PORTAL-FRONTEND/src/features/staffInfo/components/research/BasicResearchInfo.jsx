import { useState } from "react";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import FormField from "../../../../components/ui/FormField";
import Button from "../../../../components/ui/Button";
import Checkbox from "../../../../components/ui/Checkbox";

export default function BasicResearchInfoForm({ info, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(info);
  const [newInterest, setNewInterest] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      isPhDGuide: checked,
    }));
  };

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      setFormData((prev) => ({
        ...prev,
        researchInterests: [...prev.researchInterests, newInterest.trim()],
      }));
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (index) => {
    setFormData((prev) => ({
      ...prev,
      researchInterests: prev.researchInterests.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end">
        {!isEditing ? (
          <Button
            variant="ghost"
            onClick={() => setIsEditing(true)}
            icon={<FiEdit2 className="w-4 h-4" />}
          >
            Edit Information
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Research Area"
          name="researchArea"
          value={formData.researchArea}
          onChange={handleChange}
          disabled={!isEditing}
          required
        />

        <FormField
          label="Specialization"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          disabled={!isEditing}
          required
        />

        <div className="md:col-span-2">
          <Checkbox
            label="PhD Guide"
            checked={formData.isPhDGuide}
            onChange={handleCheckboxChange}
            disabled={!isEditing}
            description="Are you currently serving as a PhD guide?"
          />
        </div>

        <FormField
          label="Current PhD Students"
          name="currentPhDStudents"
          type="number"
          value={formData.currentPhDStudents.toString()}
          onChange={handleChange}
          disabled={!isEditing || !formData.isPhDGuide}
        />

        <FormField
          label="Completed PhD Students"
          name="completedPhDStudents"
          type="number"
          value={formData.completedPhDStudents.toString()}
          onChange={handleChange}
          disabled={!isEditing || !formData.isPhDGuide}
        />
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-3 pt-6 border-t border-[var(--color-border-primary)]">
          <Button
            variant="secondary"
            onClick={() => setIsEditing(false)}
            icon={<FiX className="w-4 h-4" />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={<FiSave className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      )}
    </form>
  );
}
