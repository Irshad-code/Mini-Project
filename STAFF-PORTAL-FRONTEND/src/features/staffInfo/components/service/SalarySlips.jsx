import { useState } from "react";
import { FiPlus, FiFile, FiTrash2, FiDownload } from "react-icons/fi";
import Button from "../../../../components/ui/Button";
import FileUpload from "../../../../components/ui/FileUpload";
import FormField from "../../../../components/ui/FormField";

const initialSlipData = {
  name: "",
  date: "",
  files: [],
};

export default function SalarySlips() {
  const [slips, setSlips] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [currentSlip, setCurrentSlip] = useState(initialSlipData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSlip((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilesChange = (newFiles) => {
    setCurrentSlip((prev) => ({
      ...prev,
      files: newFiles,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentSlip.files.length) {
      alert("Please upload the salary slip");
      return;
    }
    setSlips((prev) => [...prev, { ...currentSlip, id: Date.now() }]);
    setCurrentSlip(initialSlipData);
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    setSlips((prev) => prev.filter((slip) => slip.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Salary Slips
          </h3>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Manage your AG salary slip documents
          </p>
        </div>
        {!isAdding && (
          <Button
            variant="primary"
            onClick={() => setIsAdding(true)}
            icon={<FiPlus className="w-4 h-4" />}
          >
            Add Salary Slip
          </Button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--color-bg-tertiary)] p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Description"
              name="name"
              value={currentSlip.name}
              onChange={handleInputChange}
              placeholder="e.g., January 2024 Salary"
              required
            />
            <FormField
              label="Date"
              name="date"
              type="date"
              value={currentSlip.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <FileUpload
            files={currentSlip.files}
            onFilesChange={handleFilesChange}
            maxFiles={1}
            accept="application/pdf"
            maxSize={5}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setCurrentSlip(initialSlipData);
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Salary Slip
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slips.map((slip) => (
          <div
            key={slip.id}
            className="bg-[var(--color-bg-tertiary)] p-4 rounded-lg space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-[var(--color-text-primary)]">
                  {slip.name}
                </h4>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {new Date(slip.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                {slip.files.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      window.open(slip.files[0].url, "_blank");
                    }}
                    icon={<FiDownload className="w-4 h-4" />}
                  />
                )}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(slip.id)}
                  icon={<FiTrash2 className="w-4 h-4" />}
                />
              </div>
            </div>

            {slip.files.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)]">
                <FiFile className="w-4 h-4" />
                <span>{slip.files[0].name}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
