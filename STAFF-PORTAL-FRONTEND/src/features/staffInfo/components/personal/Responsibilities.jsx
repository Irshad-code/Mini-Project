import { useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiX, FiCheck } from "react-icons/fi";
import FormField from "../../../../components/ui/FormField";
import Button from "../../../../components/ui/Button";
import { Grid } from "@mui/material";
import { useUser } from "../../../../contexts/UserContext";
import { useResponsibilities } from "../../hooks/useResponsibilities";
import { useBaseForm, BaseFormLayout } from "../common/BaseForm";

export default function Responsibilities() {
  const { user } = useUser();
  const responsibilitiesHook = useResponsibilities(user?.userId);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newResponsibility, setNewResponsibility] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  const validateResponsibility = (responsibility) => {
    const errors = {};
    if (!responsibility.title?.trim()) {
      errors.title = "Title is required";
    }
    if (!responsibility.description?.trim()) {
      errors.description = "Description is required";
    }
    return errors;
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewResponsibility({ title: "", description: "" });
    setErrors({});
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setNewResponsibility({ title: "", description: "" });
    setErrors({});
  };

  const handleSaveNew = async () => {
    const validationErrors = validateResponsibility(newResponsibility);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const currentResponsibilities =
      responsibilitiesHook.data?.responsibilities || [];
    const updatedResponsibilities = [
      ...currentResponsibilities,
      { ...newResponsibility },
    ];

    const response = await responsibilitiesHook.updateData({
      responsibilities: updatedResponsibilities,
    });

    if (response.success) {
      setIsAddingNew(false);
      setNewResponsibility({ title: "", description: "" });
      setErrors({});
    }
  };

  const handleEdit = (responsibility) => {
    setEditingId(responsibility._id);
    setNewResponsibility({
      title: responsibility.title,
      description: responsibility.description,
    });
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewResponsibility({ title: "", description: "" });
    setErrors({});
  };

  const handleSaveEdit = async (id) => {
    const validationErrors = validateResponsibility(newResponsibility);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const currentResponsibilities =
      responsibilitiesHook.data?.responsibilities || [];
    const updatedResponsibilities = currentResponsibilities.map((r) =>
      r._id === id ? { ...r, ...newResponsibility } : r
    );

    const response = await responsibilitiesHook.updateData({
      responsibilities: updatedResponsibilities,
    });

    if (response.success) {
      setEditingId(null);
      setNewResponsibility({ title: "", description: "" });
      setErrors({});
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this responsibility?")
    ) {
      return;
    }

    const currentResponsibilities =
      responsibilitiesHook.data?.responsibilities || [];
    const updatedResponsibilities = currentResponsibilities.filter(
      (r) => r._id !== id
    );

    await responsibilitiesHook.updateData({
      responsibilities: updatedResponsibilities,
    });
  };

  const renderResponsibilityForm = (
    responsibility,
    isEditing = false,
    id = null
  ) => (
    <div className="mb-4 p-4 border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-secondary)] shadow-sm">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormField
            label="Title"
            value={responsibility.title}
            onChange={(e) =>
              isEditing
                ? setNewResponsibility({
                    ...newResponsibility,
                    title: e.target.value,
                  })
                : setNewResponsibility({
                    ...newResponsibility,
                    title: e.target.value,
                  })
            }
            error={errors.title}
            placeholder="E.g., Dept. placement Cordinator"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormField
            label="Description"
            value={responsibility.description}
            onChange={(e) =>
              isEditing
                ? setNewResponsibility({
                    ...newResponsibility,
                    description: e.target.value,
                  })
                : setNewResponsibility({
                    ...newResponsibility,
                    description: e.target.value,
                  })
            }
            error={errors.description}
            placeholder="E.g., Manages the department placement activities"
            fullWidth
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12} className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={isEditing ? handleCancelEdit : handleCancelAdd}
            icon={<FiX className="w-4 h-4" />}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={isEditing ? () => handleSaveEdit(id) : handleSaveNew}
            icon={<FiCheck className="w-4 h-4" />}
            size="sm"
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </div>
  );

  const renderResponsibilityItem = (responsibility) => (
    <div
      key={responsibility._id}
      className="mb-4 p-4 border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-secondary)] shadow-sm hover:shadow-md transition-all duration-200"
    >
      {editingId === responsibility._id ? (
        renderResponsibilityForm(newResponsibility, true, responsibility._id)
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-medium text-[var(--color-text-primary)]">
                {responsibility.title}
              </h4>
              <p className="text-[var(--color-text-secondary)] mt-1">
                {responsibility.description}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => handleEdit(responsibility)}
                icon={<FiEdit2 className="w-4 h-4" />}
                size="sm"
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(responsibility._id)}
                icon={<FiTrash2 className="w-4 h-4" />}
                size="sm"
              >
                Delete
              </Button>
            </div>
          </Grid>
        </Grid>
      )}
    </div>
  );

  const renderContent = () => {
    const responsibilities = responsibilitiesHook.data?.responsibilities || [];

    return (
      <div className="space-y-4">
        {responsibilities.map(renderResponsibilityItem)}

        {isAddingNew ? (
          renderResponsibilityForm(newResponsibility)
        ) : (
          <div className="flex justify-center mt-6">
            <Button
              variant="primary"
              onClick={handleAddNew}
              icon={<FiPlus className="w-4 h-4" />}
            >
              Add Responsibility
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (!responsibilitiesHook.data && !isAddingNew) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="text-center">
          <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
            No Responsibilities Added
          </h3>
          <p className="text-[var(--color-text-secondary)] mb-4">
            Add your roles and responsibilities one by one.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleAddNew}
          icon={<FiPlus className="w-4 h-4" />}
        >
          Add First Responsibility
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--color-primary-500)] mb-6">
        Roles & Responsibilities
      </h2>
      {renderContent()}
    </div>
  );
}
