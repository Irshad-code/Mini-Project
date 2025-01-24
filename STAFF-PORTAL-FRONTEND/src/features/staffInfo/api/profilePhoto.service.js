import { BaseService } from "./base.service";
import { getFileUploadAuthHeader } from "../../../utils/auth";

class ProfilePhotoService extends BaseService {
  constructor() {
    super("userprofilephoto");
  }

  async uploadPhoto(userId, file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Use fetch with auth headers but without credentials
      const response = await fetch(
        this.client.buildUrl(`/upload?id=${userId}`),
        {
          method: "POST",
          headers: getFileUploadAuthHeader(),
          mode: "cors",
          body: formData,
        }
      );

      // Log response details for debugging
      console.log("Upload Response Status:", response.status);
      console.log(
        "Upload Response Headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message;
        } catch {
          // If can't parse JSON, create descriptive error based on status
          switch (response.status) {
            case 400:
              errorMessage = "Invalid request. Please try again.";
              break;
            case 401:
              errorMessage = "Authentication required. Please log in again.";
              break;
            case 403:
              errorMessage = "You don't have permission to upload photos.";
              break;
            case 413:
              errorMessage =
                "File is too large. Please choose a smaller photo.";
              break;
            case 415:
              errorMessage =
                "File type not supported. Please choose a valid image file.";
              break;
            case 500:
              errorMessage = "Server error. Please try again later.";
              break;
            default:
              errorMessage = `Upload failed (${response.status}). Please try again.`;
          }
        }
        console.error("Upload Error:", {
          status: response.status,
          message: errorMessage,
          headers: Object.fromEntries(response.headers.entries()),
        });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        error: null,
      };
    } catch (error) {
      console.error("Error in ProfilePhotoService.uploadPhoto:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      return {
        success: false,
        error:
          error.message || "Failed to upload profile photo. Please try again.",
      };
    }
  }

  getPhotoUrl(filePath) {
    if (!filePath) return null;
    // Remove 'uploads/' from the start since we're serving from /uploads directly
    const cleanPath = filePath.replace(/^uploads\//, "");
    return `${import.meta.env.VITE_FILE_UPLOAD_URL}/uploads/${cleanPath}`;
  }
}

export const profilePhotoService = new ProfilePhotoService();
