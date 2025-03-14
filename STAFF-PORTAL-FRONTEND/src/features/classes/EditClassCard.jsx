import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useState } from "react";

const EditingClassCard = ({ editingClass, setEditingClass, setActiveForm, FormType }) => {
  const [formData, setFormData] = useState(editingClass || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {["subject", "code", "semester", "branch", "students", "schedule", "syllabus", "courseOutcome"].map(
            (field, index) => (
              <div key={index}>
                <label className="block text-sm font-medium mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")} {/* Formats label */}
                </label>
                <input
                  type={field === "students" ? "number" : "text"}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            )
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setActiveForm(FormType.NONE);
              setEditingClass(null);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EditingClassCard;
