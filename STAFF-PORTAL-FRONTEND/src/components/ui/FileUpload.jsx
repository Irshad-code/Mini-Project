import { useState, useRef } from 'react';
import { FiUpload, FiX, FiFile } from 'react-icons/fi';
import Button from './Button';

export default function FileUpload({
  files,
  onFilesChange,
  maxFiles = 5,
  accept = '.pdf',
  maxSize = 10, // 10MB default
}) {
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setError('');

    if (files.length + selectedFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files`);
      return;
    }

    const invalidFiles = selectedFiles.filter(
      (file) => !file.type.includes('pdf')
    );
    if (invalidFiles.length > 0) {
      setError('Only PDF files are allowed');
      return;
    }

    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > maxSize * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      setError(`Files must be smaller than ${maxSize}MB`);
      return;
    }

    const newFiles = selectedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    onFilesChange([...files, ...newFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id) => {
    const updatedFiles = files.filter((file) => file.id !== id);
    onFilesChange(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
          Upload Documents
        </label>
        <span className="text-sm text-[var(--color-text-secondary)]">
          {files.length}/{maxFiles} files
        </span>
      </div>

      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-[var(--color-bg-secondary)] border-[var(--color-border-primary)]">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FiUpload className="w-8 h-8 mb-3 text-[var(--color-text-secondary)]" />
            <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
              <span className="font-medium">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              PDF files up to {maxSize}MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={accept}
            multiple
            onChange={handleFileChange}
            disabled={files.length >= maxFiles}
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-[var(--color-bg-secondary)] rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FiFile className="w-5 h-5 text-[var(--color-text-secondary)]" />
                <span className="text-sm text-[var(--color-text-primary)]">
                  {file.name}
                </span>
              </div>
              <Button
                variant="ghost"
                onClick={() => removeFile(file.id)}
                icon={<FiX className="w-4 h-4" />}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
