import { useState, useEffect } from "react";
import { useProfilePhoto } from "../../hooks/useProfilePhoto";
import { useUser } from "../../../../contexts/UserContext";
import { usePhoto } from "../../../../contexts/PhotoContext";
import { FiUpload, FiImage, FiCamera } from "react-icons/fi";
import Button from "../../../../components/ui/Button";

export default function ProfilePhoto() {
  const { user } = useUser();
  const { photoUrl, isLoading, error, uploadPhoto, refresh } = useProfilePhoto(user?.userId);
  const { refreshPhoto, lastUpdate } = usePhoto();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Add timestamp to photo URL to prevent caching
  const photoUrlWithTimestamp = photoUrl ? `${photoUrl}?t=${lastUpdate}` : null;

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file');
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setUploadError(null);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const result = await uploadPhoto(selectedFile);
      if (result.success) {
        // Clear the selected file and preview
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadError(null);
        // Refresh both local and global photo state
        await refresh();
        refreshPhoto();
      } else {
        setUploadError(result.error || 'Failed to upload photo');
      }
    } catch (error) {
      setUploadError(error.message || 'Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  // If there's an error from the hook, show it
  useEffect(() => {
    if (error) {
      setUploadError(error);
    }
  }, [error]);

  if (isLoading && !isUploading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-500)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Current Photo Display */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-4">Profile Photo</h3>
        <div className="flex justify-center">
          {photoUrlWithTimestamp ? (
            <div className="relative group">
              <img
                src={photoUrlWithTimestamp}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-[var(--color-border-primary)]"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <FiCamera className="w-8 h-8 text-white" />
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
              </label>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="mb-4 bg-[var(--color-bg-secondary)] rounded-full p-8">
                  <FiImage className="w-16 h-16 text-[var(--color-text-secondary)]" />
                </div>
                <p className="text-[var(--color-text-secondary)] mb-4">No profile photo uploaded yet</p>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-500)]">
                  <FiUpload className="w-5 h-5 mr-2" />
                  Upload Photo
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {uploadError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{uploadError}</p>
        </div>
      )}

      {/* Preview and Upload Section */}
      {selectedFile && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-4">Preview</h3>
          <div className="flex flex-col items-center space-y-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-full border-2 border-[var(--color-border-primary)]"
            />
            
            <div className="text-sm text-[var(--color-text-secondary)]">
              Selected: {selectedFile.name}
            </div>

            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="mt-4"
              variant="primary"
            >
              {isUploading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <span>Upload Photo</span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
