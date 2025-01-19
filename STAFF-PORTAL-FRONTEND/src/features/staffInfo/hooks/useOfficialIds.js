import { useState, useEffect } from 'react';
import { officialIdsService } from '../../../services/api/officialIds.service';

export function useOfficialIds(id) {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    error: null,
    isEditing: false,
  });

  useEffect(() => {
    if (id) {
      fetchOfficialIds();
    }
  }, [id]);

  const fetchOfficialIds = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const data = await officialIdsService.findByUserId(id);
      setState(prev => ({
        ...prev,
        data,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Error in fetchOfficialIds:", error);
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    }
  };

  const handleEdit = () => {
    setState(prev => ({ ...prev, isEditing: true }));
  };

  const handleSave = async (updatedData) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await officialIdsService.upsert(id, updatedData);
      setState(prev => ({
        ...prev,
        data: response.record,
        isLoading: false,
        isEditing: false,
        error: null,
      }));
      return { success: true };
    } catch (error) {
      console.error("Error in handleSave:", error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to save official IDs',
        isLoading: false,
      }));
      return { success: false, error: error.message };
    }
  };

  const handleCancel = () => {
    setState(prev => ({ ...prev, isEditing: false }));
  };

  return {
    ...state,
    handleEdit,
    handleSave,
    handleCancel,
    refresh: fetchOfficialIds,
  };
}
