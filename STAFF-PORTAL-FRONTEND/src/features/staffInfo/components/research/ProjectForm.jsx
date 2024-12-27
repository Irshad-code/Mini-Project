import { useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import FormField from "../../../../components/ui/FormField";
import Button from "../../../../components/ui/Button";
import FileUpload from "../../../../components/ui/FileUpload";
import { useFileUpload } from "../../../../hooks/useFileUpload";

export default function ProjectForm({ project, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    industry: project?.industry || "",
    status: project?.status || "ongoing",
    amount: project?.amount?.toString() || "0",
    startDate: project?.startDate || "",
    endDate: project?.endDate || "",
    description: project?.description || "",
  });

  const { uploadedFiles, setUploadedFiles, getDocumentsFromFiles } =
    useFileUpload(project?.documents);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseInt(formData.amount, 10),
      documents: getDocumentsFromFiles(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Project Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <FormField
        label="Industry"
        name="industry"
        value={formData.industry}
        onChange={handleChange}
        required
      />

      <FormField
        label="Status"
        name="status"
        type="select"
        value={formData.status}
        onChange={handleChange}
        options={[
          { value: "ongoing", label: "Ongoing" },
          { value: "completed", label: "Completed" },
          { value: "proposed", label: "Proposed" },
        ]}
        required
      />

      <FormField
        label="Amount (₹)"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Start Date"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required
        />

        <FormField
          label="End Date"
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
        />
      </div>

      <FormField
        label="Description"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={handleChange}
        required
      />

      <FileUpload
        files={uploadedFiles}
        onFilesChange={setUploadedFiles}
        maxFiles={5}
        accept=".pdf"
        maxSize={10}
      />

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
          {project ? "Update" : "Add"} Project
        </Button>
      </div>
    </form>
  );
}
