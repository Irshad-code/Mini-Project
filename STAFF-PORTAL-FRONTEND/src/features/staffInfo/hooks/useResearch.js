import { useState } from 'react';

// Initial state setup for basic info and items
const initialBasicInfo = {
  researchArea: '',
  isPhDGuide: false,
  currentPhDStudents: 0,
  completedPhDStudents: 0,
  specialization: '',
  researchInterests: [],
};

const initialState = {
  basicInfo: initialBasicInfo,
  journals: [],
  conferences: [],
  fdps: [],
  visitingPrograms: [],
  projects: [],
  selectedItem: { type: null, item: null },
  isEditing: false,
};

// Main hook function
export function useResearch() {
  const [state, setState] = useState(initialState);

  // Function to update the basic research info
  const updateBasicInfo = (info) => {
    setState((prev) => ({
      ...prev,
      basicInfo: info,
      isEditing: false,
    }));
  };

  // General function to add different items (journals, conferences, etc.)
  const addItem = (type, item) => {
    const newItem = { ...item, id: crypto.randomUUID() };
    const key = getStateKeyFromType(type);

    setState((prev) => ({
      ...prev,
      [key]: [...prev[key], newItem],
      selectedItem: { type: null, item: null },
      isEditing: false,
    }));
  };

  // Function to update an existing item
  const updateItem = (type, item) => {
    if (!type) return;

    const key = getStateKeyFromType(type);

    setState((prev) => ({
      ...prev,
      [key]: prev[key].map((i) => (i.id === item.id ? item : i)),
      selectedItem: { type: null, item: null },
      isEditing: false,
    }));
  };

  // Function to remove an item
  const removeItem = (type, id) => {
    if (!type) return;

    const key = getStateKeyFromType(type);

    setState((prev) => ({
      ...prev,
      [key]: prev[key].filter((i) => i.id !== id),
      selectedItem: { type: null, item: null },
    }));
  };

  // Function to select an item for editing
  const selectItem = (type, item) => {
    setState((prev) => ({
      ...prev,
      selectedItem: { type, item },
      isEditing: true,
    }));
  };

  // Function to cancel edit
  const cancelEdit = () => {
    setState((prev) => ({
      ...prev,
      selectedItem: { type: null, item: null },
      isEditing: false,
    }));
  };

  // Return all necessary states and functions
  return {
    state,
    updateBasicInfo,
    addItem,
    updateItem,
    removeItem,
    selectItem,
    cancelEdit,
  };
}

// Helper function to map item type to the state key
function getStateKeyFromType(type) {
  switch (type) {
    case 'journal':
      return 'journals';
    case 'conference':
      return 'conferences';
    case 'fdp':
      return 'fdps';
    case 'visiting':
      return 'visitingPrograms';
    case 'project':
      return 'projects';
    default:
      return '';
  }
}
