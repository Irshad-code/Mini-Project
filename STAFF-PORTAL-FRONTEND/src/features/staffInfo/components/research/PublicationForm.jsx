import { useState } from "react";
import { FiSave, FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import FormField from "../../../../components/ui/FormField";
import Button from "../../../../components/ui/Button";
import FileUpload from "../../../../components/ui/FileUpload";

export default function PublicationForm({
  type,
  publication,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    title: publication?.title || "",
    authors: publication?.authors || [""],
    publicationName: publication?.publicationName || "",
    year: publication?.year || "",
    doi: publication?.doi || "",
    url: publication?.url || "",
    citations: publication?.citations?.toString() || "0",
    documents: publication?.documents || [],
  });

  const [uploadedFiles, setUploadedFiles] = useState(
    formData.documents.map((doc) => ({
      id: doc.id,
      name: doc.name,
      url: doc.url,
      file: new File([], doc.name), // placeholder file object
    }))
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthorChange = (index, value) => {
    const newAuthors = [...formData.authors];
    newAuthors[index] = value;
    setFormData((prev) => ({ ...prev, authors: newAuthors }));
  };

  const addAuthor = () => {
    setFormData((prev) => ({
      ...prev,
      authors: [...prev.authors, ""],
    }));
  };

  const removeAuthor = (index) => {
    setFormData((prev) => ({
      ...prev,
      authors: prev.authors.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const documents = uploadedFiles.map((file) => ({
      id: file.id,
      name: file.name,
      url: file.url,
    }));

    onSubmit({
      ...formData,
      citations: parseInt(formData.citations, 10),
      documents,
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

      <div className="space-y-4">
        <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
          Authors
        </label>
        {formData.authors.map((author, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={author}
              onChange={(e) => handleAuthorChange(index, e.target.value)}
              className="flex-1 rounded-md border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
              placeholder={`Author ${index + 1}`}
              required
            />
            {formData.authors.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => removeAuthor(index)}
                icon={<FiTrash2 className="w-4 h-4" />}
              />
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          onClick={addAuthor}
          icon={<FiPlus className="w-4 h-4" />}
        >
          Add Author
        </Button>
      </div>

      <FormField
        label={type === "journal" ? "Journal Name" : "Conference Name"}
        name="publicationName"
        value={formData.publicationName}
        onChange={handleChange}
        required
      />

      <FormField
        label="Year"
        name="year"
        type="number"
        value={formData.year}
        onChange={handleChange}
        required
      />

      <FormField
        label="DOI"
        name="doi"
        value={formData.doi}
        onChange={handleChange}
      />

      <FormField
        label="URL"
        name="url"
        type="url"
        value={formData.url}
        onChange={handleChange}
      />

      <FormField
        label="Citations"
        name="citations"
        type="number"
        value={formData.citations}
        onChange={handleChange}
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
          {publication ? "Update" : "Add"} Publication
        </Button>
      </div>
    </form>
  );
}
