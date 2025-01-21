import { useState, useEffect } from "react";
import { contactDetailsService } from "../components/personal/api/contactDetails.service";

export function useContactDetails(id) {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    error: null,
    isEditing: false,
  });

  useEffect(() => {
    console.log(" useContactDetails effect triggered with id:", id);
    if (id) {
      fetchContactDetails();
    }
  }, [id]);

  const fetchContactDetails = async () => {
    try {
      console.log(" Fetching contact details for user:", id);
      setState((prev) => ({ ...prev, isLoading: true }));
      const data = await contactDetailsService.findByUserId(id);
      console.log(" Received contact details:", data);
      setState((prev) => ({
        ...prev,
        data: data,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error(" Error in fetchContactDetails:", error);
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
    console.log(" Saving contact details:", updatedData);
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await contactDetailsService.upsert(id, updatedData);
      console.log(" Save successful:", response);
      setState((prev) => ({
        ...prev,
        data: response,
        isLoading: false,
        isEditing: false,
        error: null,
      }));
      return { success: true };
    } catch (error) {
      console.error(" Save failed:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  };

  const handleCancel = () => {
    console.log(" Canceling edit");
    setState((prev) => ({ ...prev, isEditing: false }));
  };

  return {
    ...state,
    handleEdit,
    handleSave,
    handleCancel,
  };
}
