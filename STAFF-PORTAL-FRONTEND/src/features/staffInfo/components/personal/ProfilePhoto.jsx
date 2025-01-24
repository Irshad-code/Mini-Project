import { useState } from "react";
import { useProfilePhoto } from "../../hooks/useProfilePhoto";
import { useUser } from "../../../../contexts/UserContext";
import { FiUpload, FiImage } from "react-icons/fi";
import Button from "../../../../components/ui/Button";

export default function ProfilePhoto() {
  const { user } = useUser();
  const { photoUrl, isLoading, error, uploadPhoto } = useProfilePhoto(user?.userId);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);

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
      const result = await uploadPhoto(selectedFile);
      if (result.success) {
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadError(null);
      } else {
        setUploadError(result.error || 'Failed to upload photo');
      }
    } catch (error) {
      setUploadError(error.message || 'Failed to upload photo');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Current Photo Display */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Profile Photo</h3>
        <div className="flex justify-center">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profile"
              className="w-48 h-48 rounded-full object-cover border-4 border-gray-200"
            />
          ) : (
            <div className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
              <FiImage className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Upload Section */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload New Photo</h3>
        
        {/* Error Display */}
        {uploadError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{uploadError}</p>
          </div>
        )}

        {/* File Upload Section */}
        <div className="flex flex-col items-center space-y-4">
          {/* Preview */}
          {previewUrl && (
            <div className="mb-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-full border-2 border-gray-200"
              />
            </div>
          )}

          {/* Upload Button */}
          <div className="flex flex-col items-center space-y-4">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
              <span className="flex items-center space-x-2">
                <FiUpload className="w-5 h-5" />
                <span>Choose Photo</span>
              </span>
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isLoading}
              />
            </label>
            
            {selectedFile && (
              <div className="text-sm text-gray-500">
                Selected: {selectedFile.name}
              </div>
            )}

            {selectedFile && (
              <Button
                onClick={handleUpload}
                disabled={isLoading}
                className="mt-4"
                variant="primary"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <span>Upload Photo</span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
