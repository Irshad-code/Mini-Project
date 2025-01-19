import { useState, useEffect } from 'react';
import { basicInfoService } from '../../../services/api/basicInfo.service';

export function useEmployee(id = '1') {
  const [state, setState] = useState({
    employee: null,
    isLoading: true,
    error: null,
    isEditing: false,
  });

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const data = await basicInfoService.findById(id);
      setState((prev) => ({
        ...prev,
        employee: data,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: 'Failed to fetch employee data',
        isLoading: false,
      }));
    }
  };

  const handleEdit = () => {
    setState((prev) => ({ ...prev, isEditing: true }));
  };

  const handleSave = async (updatedEmployee) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      let data;
      if (!state.employee) {
        // If no employee exists, create new
        data = await basicInfoService.create(updatedEmployee);
      } else {
        // Otherwise update existing
        data = await basicInfoService.updateById(id, updatedEmployee);
      }
      setState((prev) => ({
        ...prev,
        employee: data,
        isLoading: false,
        isEditing: false,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: 'Failed to update employee data',
        isLoading: false,
      }));
    }
  };

  const handleCancel = () => {
    setState((prev) => ({ ...prev, isEditing: false }));
  };

  return {
    ...state,
    handleEdit,
    handleSave,
    handleCancel,
  };
}
