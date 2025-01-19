import { useState, useEffect } from 'react';
import { basicInfoService } from '../../../services/api/basicInfo.service';

export function useBasicInfo(id) {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    error: null,
    isEditing: false,
  });

  useEffect(() => {
    console.log(" useBasicInfo effect triggered with id:", id);
    if (id) {
      fetchBasicInfo();
    }
  }, [id]);

  const fetchBasicInfo = async () => {
    try {
      console.log(" Fetching basic info for user:", id);
      setState(prev => ({ ...prev, isLoading: true }));
      const data = await basicInfoService.findByUserId(id);
      console.log(" Received basic info:", data);
      setState(prev => ({
        ...prev,
        data, // data will be null if not found, which is fine
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error(" Error in fetchBasicInfo:", error);
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    }
  };

  const handleEdit = () => {
    console.log(" Entering edit mode");
    setState(prev => ({ ...prev, isEditing: true }));
  };

  const handleSave = async (updatedData) => {
    console.log(" Saving basic info:", updatedData);
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await basicInfoService.upsert(id, updatedData);
      console.log(" Save successful:", response);
      setState(prev => ({
        ...prev,
        data: response.record,
        isLoading: false,
        isEditing: false,
        error: null,
      }));
      return { success: true };
    } catch (error) {
      console.error(" Error in handleSave:", error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to save basic information',
        isLoading: false,
      }));
      return { success: false, error: error.message };
    }
  };

  const handleCancel = () => {
    console.log(" Canceling edit mode");
    setState(prev => ({ ...prev, isEditing: false }));
  };

  return {
    ...state,
    handleEdit,
    handleSave,
    handleCancel,
    refresh: fetchBasicInfo,
  };
}
