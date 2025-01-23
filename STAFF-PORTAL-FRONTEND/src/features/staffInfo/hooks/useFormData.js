import { useState, useEffect } from "react";

export function useFormData(service, id, formName) {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    error: null,
    isEditing: false,
  });

  useEffect(() => {
    console.log(` use${formName} effect triggered with id:`, id);
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      console.log(` Fetching ${formName} for user:`, id);
      setState((prev) => ({ ...prev, isLoading: true }));
      const result = await service.findByUserId(id);
      console.log(` Received ${formName}:`, result);
      
      if (result.success) {
        setState((prev) => ({
          ...prev,
          data: result.data,
          isLoading: false,
          error: null,
        }));
      } else {
        throw new Error(result.error || `Failed to fetch ${formName}`);
      }
    } catch (error) {
      console.error(` Error in fetch${formName}:`, error);
      setState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    }
  };

  const handleEdit = () => {
    console.log(" Entering edit mode");
    setState((prev) => ({ ...prev, isEditing: true }));
  };

  const handleSave = async (updatedData) => {
    console.log(` Saving ${formName}:`, updatedData);
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const result = await service.upsert(id, updatedData);
      console.log(" Save result:", result);
      
      if (result.success) {
        setState((prev) => ({
          ...prev,
          data: result.data,
          isLoading: false,
          error: null,
          isEditing: false,
        }));
        return { success: true };
      } else {
        throw new Error(result.error || `Failed to save ${formName}`);
      }
    } catch (error) {
      console.error(` Error saving ${formName}:`, error);
      setState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
      return { success: false, error: error.message };
    }
  };

  const handleCancel = () => {
    console.log(" Canceling edit mode");
    setState((prev) => ({ ...prev, isEditing: false }));
  };

  return {
    ...state,
    handleEdit,
    handleSave,
    handleCancel,
    refresh: fetchData,
  };
}
