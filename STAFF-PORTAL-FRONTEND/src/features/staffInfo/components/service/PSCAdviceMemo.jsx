import { useState } from "react";
import { FiUpload, FiFile, FiTrash2 } from "react-icons/fi";
import Button from "../../../../components/ui/Button";
import FileUpload from "../../../../components/ui/FileUpload";

export default function PSCAdviceMemo() {
  const [files, setFiles] = useState([]);

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
          PSC Advice Memo
        </h3>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          Upload your PSC advice memo document (PDF format only)
        </p>
      </div>

      <FileUpload
        files={files}
        onFilesChange={handleFilesChange}
        maxFiles={1}
        accept="application/pdf"
        maxSize={5}
      />
    </div>
  );
}
