import { useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import FormField from "../../../../components/ui/FormField";
import Button from "../../../../components/ui/Button";
import FileUpload from "../../../../components/ui/FileUpload";
import { useFileUpload } from "../../../../hooks/useFileUpload";

export default function FDPForm({ fdp, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: fdp?.title || "",
    organizer: fdp?.organizer || "",
    startDate: fdp?.startDate || "",
    endDate: fdp?.endDate || "",
    type: fdp?.type || "attended",
  });

  const { uploadedFiles, setUploadedFiles, getDocumentsFromFiles } =
    useFileUpload(fdp?.documents);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      documents: getDocumentsFromFiles(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <FormField
        label="Organizer"
        name="organizer"
        value={formData.organizer}
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
          required
        />
      </div>

      <FormField
        label="Type"
        name="type"
        type="select"
        value={formData.type}
        onChange={handleChange}
        options={[
          { value: "attended", label: "Attended" },
          { value: "organized", label: "Organized" },
        ]}
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
          {fdp ? "Update" : "Add"} FDP
        </Button>
      </div>
    </form>
  );
}
