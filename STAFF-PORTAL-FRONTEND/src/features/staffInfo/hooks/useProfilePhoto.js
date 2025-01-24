import { useState, useEffect, useCallback } from "react";
import { profilePhotoService } from "../api/profilePhoto.service";

export function useProfilePhoto(userId) {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    error: null,
    photoUrl: null,
  });

  const fetchPhoto = useCallback(async () => {
    if (!userId) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const result = await profilePhotoService.findByUserId(userId);
      
      if (result.success) {
        const photoUrl = profilePhotoService.getPhotoUrl(result.data?.filePath);
        setState({
          data: result.data,
          photoUrl,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(result.error || "Failed to fetch profile photo");
      }
    } catch (error) {
      console.error("Error in fetchPhoto:", error);
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    }
  }, [userId]);

  const uploadPhoto = async (file) => {
    if (!userId || !file) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const result = await profilePhotoService.uploadPhoto(userId, file);
      
      if (result.success) {
        const photoUrl = profilePhotoService.getPhotoUrl(result.data?.filePath);
        setState({
          data: result.data,
          photoUrl,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        throw new Error(result.error || "Failed to upload profile photo");
      }
    } catch (error) {
      console.error("Error in uploadPhoto:", error);
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchPhoto();
  }, [fetchPhoto]);

  return {
    ...state,
    uploadPhoto,
    refresh: fetchPhoto,
  };
}
