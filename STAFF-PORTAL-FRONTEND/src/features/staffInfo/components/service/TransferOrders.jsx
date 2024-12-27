import { useState } from "react";
import { FiPlus, FiFile, FiTrash2, FiDownload } from "react-icons/fi";
import Button from "../../../../components/ui/Button";
import FileUpload from "../../../../components/ui/FileUpload";
import FormField from "../../../../components/ui/FormField";

const initialTransferData = {
  fromInstitution: "",
  toInstitution: "",
  date: "",
  transferFiles: [],
  relievingFiles: [],
  joiningFiles: [],
};

export default function TransferOrders() {
  const [transfers, setTransfers] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [currentTransfer, setCurrentTransfer] = useState(initialTransferData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTransfer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilesChange = (type) => (newFiles) => {
    setCurrentTransfer((prev) => ({
      ...prev,
      [type]: newFiles,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !currentTransfer.transferFiles.length ||
      !currentTransfer.relievingFiles.length ||
      !currentTransfer.joiningFiles.length
    ) {
      alert("Please upload all required documents");
      return;
    }
    setTransfers((prev) => [...prev, { ...currentTransfer, id: Date.now() }]);
    setCurrentTransfer(initialTransferData);
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    setTransfers((prev) => prev.filter((transfer) => transfer.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Transfer Orders
          </h3>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            Manage your transfer history and related documents
          </p>
        </div>
        {!isAdding && (
          <Button
            variant="primary"
            onClick={() => setIsAdding(true)}
            icon={<FiPlus className="w-4 h-4" />}
          >
            Add Transfer
          </Button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--color-bg-tertiary)] p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="From Institution"
              name="fromInstitution"
              value={currentTransfer.fromInstitution}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="To Institution"
              name="toInstitution"
              value={currentTransfer.toInstitution}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Transfer Date"
              name="date"
              type="date"
              value={currentTransfer.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Transfer Order
              </h4>
              <FileUpload
                files={currentTransfer.transferFiles}
                onFilesChange={handleFilesChange("transferFiles")}
                maxFiles={1}
                accept="application/pdf"
                maxSize={5}
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Relieving Order
              </h4>
              <FileUpload
                files={currentTransfer.relievingFiles}
                onFilesChange={handleFilesChange("relievingFiles")}
                maxFiles={1}
                accept="application/pdf"
                maxSize={5}
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Joining Order
              </h4>
              <FileUpload
                files={currentTransfer.joiningFiles}
                onFilesChange={handleFilesChange("joiningFiles")}
                maxFiles={1}
                accept="application/pdf"
                maxSize={5}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setCurrentTransfer(initialTransferData);
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Transfer
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {transfers.map((transfer) => (
          <div
            key={transfer.id}
            className="bg-[var(--color-bg-tertiary)] p-4 rounded-lg space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-[var(--color-text-primary)]">
                  {transfer.fromInstitution} → {transfer.toInstitution}
                </h4>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {new Date(transfer.date).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="danger"
                onClick={() => handleDelete(transfer.id)}
                icon={<FiTrash2 className="w-4 h-4" />}
              >
                Delete
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { type: "transferFiles", label: "Transfer Order" },
                { type: "relievingFiles", label: "Relieving Order" },
                { type: "joiningFiles", label: "Joining Order" },
              ].map(({ type, label }) => (
                <div
                  key={type}
                  className="flex items-center justify-between p-3 bg-[var(--color-bg-secondary)] rounded"
                >
                  <div className="flex items-center space-x-2">
                    <FiFile className="w-5 h-5 text-[var(--color-primary-500)]" />
                    <span className="text-sm">{label}</span>
                  </div>
                  {transfer[type].length > 0 && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        window.open(transfer[type][0].url, "_blank");
                      }}
                      icon={<FiDownload className="w-4 h-4" />}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
