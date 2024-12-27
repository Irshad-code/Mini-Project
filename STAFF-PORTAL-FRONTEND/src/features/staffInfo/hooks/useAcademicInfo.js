import { useState } from 'react';

const initialState = {
  qualifications: [],
  selectedQualification: null,
  isEditing: false,
};

export function useAcademicInfo() {
  const [state, setState] = useState(initialState);

  const addQualification = (qualification) => {
    const newQualification = {
      ...qualification,
      id: crypto.randomUUID(),
    };

    setState((prev) => ({
      ...prev,
      qualifications: [...prev.qualifications, newQualification],
      selectedQualification: null,
      isEditing: false,
    }));
  };

  const updateQualification = (qualification) => {
    setState((prev) => ({
      ...prev,
      qualifications: prev.qualifications.map((q) =>
        q.id === qualification.id ? qualification : q
      ),
      selectedQualification: null,
      isEditing: false,
    }));
  };

  const removeQualification = (id) => {
    setState((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((q) => q.id !== id),
      selectedQualification: null,
    }));
  };

  const selectQualification = (qualification) => {
    setState((prev) => ({
      ...prev,
      selectedQualification: qualification,
      isEditing: true,
    }));
  };

  const cancelEdit = () => {
    setState((prev) => ({
      ...prev,
      selectedQualification: null,
      isEditing: false,
    }));
  };

  return {
    state,
    addQualification,
    updateQualification,
    removeQualification,
    selectQualification,
    cancelEdit,
  };
}
