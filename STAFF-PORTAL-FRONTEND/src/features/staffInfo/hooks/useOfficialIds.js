import { useState, useEffect } from "react";
import { officialIdsService } from "../components/personal/api/officialIds.service";

export function useOfficialIds(id) {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    error: null,
    isEditing: false,
  });

  useEffect(() => {
    console.log(" useOfficialIds effect triggered with id:", id);
    if (id) {
      fetchOfficialIds();
    }
  }, [id]);

  const fetchOfficialIds = async () => {
    try {
      console.log(" Fetching official IDs for user:", id);
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const data = await officialIdsService.findByUserId(id);
      console.log(" Received official IDs:", data);
      setState((prev) => ({
        ...prev,
        data: data,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error(" Error in fetchOfficialIds:", error);
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to fetch official IDs",
        isLoading: false,
      }));
    }
  };

  const handleEdit = () => {
    console.log(" Entering edit mode");
    setState((prev) => ({ ...prev, isEditing: true }));
  };

  const handleSave = async (updatedData) => {
    console.log(" Saving official IDs:", updatedData);
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await officialIdsService.upsert(id, updatedData);
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
      const errorMessage = error.message || "Failed to save official IDs";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const handleCancel = () => {
    console.log(" Canceling edit");
    setState((prev) => ({ ...prev, isEditing: false, error: null }));
  };

  return {
    ...state,
    handleEdit,
    handleSave,
    handleCancel,
    refresh: fetchOfficialIds,
  };
}
