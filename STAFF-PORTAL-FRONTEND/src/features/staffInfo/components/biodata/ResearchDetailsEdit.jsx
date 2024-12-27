import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Button from "../../../../components/ui/Button";
import FormField from "../../../../components/ui/FormField";

const emptyPublication = {
  title: "",
  journal: "",
  year: "",
  impact: "",
  doi: "",
};

const emptyProject = {
  title: "",
  duration: "",
  funding: "",
  amount: "",
  status: "",
};

export default function ResearchDetailsEdit({ data, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    publications: data?.publications || [{ ...emptyPublication }],
    projects: data?.projects || [{ ...emptyProject }],
  });

  const handleInputChange = (type, index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      ),
    }));
  };

  const handleAdd = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        type === "publications" ? { ...emptyPublication } : { ...emptyProject },
      ],
    }));
  };

  const handleRemove = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Publications Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Publications
          </h3>
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleAdd("publications")}
            icon={<FiPlus className="w-4 h-4" />}
          >
            Add Publication
          </Button>
        </div>

        <div className="space-y-8">
          {formData.publications.map((pub, index) => (
            <div key={index} className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-[var(--color-text-primary)]">
                  Publication {index + 1}
                </h4>
                {formData.publications.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleRemove("publications", index)}
                    icon={<FiTrash2 className="w-4 h-4" />}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <FormField
                    label="Title"
                    name="title"
                    value={pub.title}
                    onChange={(e) => handleInputChange("publications", index, e)}
                    required
                  />
                </div>
                <FormField
                  label="Journal/Conference"
                  name="journal"
                  value={pub.journal}
                  onChange={(e) => handleInputChange("publications", index, e)}
                  required
                />
                <FormField
                  label="Year"
                  name="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={pub.year}
                  onChange={(e) => handleInputChange("publications", index, e)}
                  required
                />
                <FormField
                  label="Impact Factor"
                  name="impact"
                  value={pub.impact}
                  onChange={(e) => handleInputChange("publications", index, e)}
                />
                <FormField
                  label="DOI"
                  name="doi"
                  value={pub.doi}
                  onChange={(e) => handleInputChange("publications", index, e)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Projects
          </h3>
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleAdd("projects")}
            icon={<FiPlus className="w-4 h-4" />}
          >
            Add Project
          </Button>
        </div>

        <div className="space-y-8">
          {formData.projects.map((proj, index) => (
            <div key={index} className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-[var(--color-text-primary)]">
                  Project {index + 1}
                </h4>
                {formData.projects.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleRemove("projects", index)}
                    icon={<FiTrash2 className="w-4 h-4" />}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <FormField
                    label="Title"
                    name="title"
                    value={proj.title}
                    onChange={(e) => handleInputChange("projects", index, e)}
                    required
                  />
                </div>
                <FormField
                  label="Duration"
                  name="duration"
                  value={proj.duration}
                  onChange={(e) => handleInputChange("projects", index, e)}
                  required
                />
                <FormField
                  label="Funding Agency"
                  name="funding"
                  value={proj.funding}
                  onChange={(e) => handleInputChange("projects", index, e)}
                  required
                />
                <FormField
                  label="Amount (₹)"
                  name="amount"
                  type="number"
                  value={proj.amount}
                  onChange={(e) => handleInputChange("projects", index, e)}
                  required
                />
                <FormField
                  label="Status"
                  name="status"
                  value={proj.status}
                  onChange={(e) => handleInputChange("projects", index, e)}
                  required
                />
              </div>
            </div>
          ))}
        </div>
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
