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
    <div className="mb-4 p-3 sm:p-4 border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-secondary)] shadow-sm">
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
        <Grid item xs={12}>
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
        <Grid item xs={12} className="flex justify-end space-x-2 mt-2">
          <Button
            variant="secondary"
            onClick={isEditing ? handleCancelEdit : handleCancelAdd}
            icon={<FiX className="w-3 h-3 sm:w-4 sm:h-4" />}
            size="sm"
            className="min-w-[80px] sm:min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={isEditing ? () => handleSaveEdit(id) : handleSaveNew}
            icon={<FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />}
            size="sm"
            className="min-w-[80px] sm:min-w-[100px]"
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
      className="mb-4 p-3 sm:p-4 border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-secondary)] shadow-sm hover:shadow-md transition-all duration-200"
    >
      {editingId === responsibility._id ? (
        renderResponsibilityForm(newResponsibility, true, responsibility._id)
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-base sm:text-lg font-medium text-[var(--color-text-primary)] truncate">
              {responsibility.title}
            </h4>
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-1 line-clamp-2 sm:line-clamp-none">
              {responsibility.description}
            </p>
          </div>
          <div className="flex justify-end space-x-2 mt-2 sm:mt-0">
            <Button
              variant="secondary"
              onClick={() => handleEdit(responsibility)}
              icon={<FiEdit2 className="w-3 h-3 sm:w-4 sm:h-4" />}
              size="sm"
              className="min-w-[80px] sm:min-w-[100px]"
            >
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(responsibility._id)}
              icon={<FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />}
              size="sm"
              className="min-w-[80px] sm:min-w-[100px]"
            >
              Delete
            </Button>
          </div>
        </div>
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
          <div className="flex justify-center mt-4 sm:mt-6">
            <Button
              variant="primary"
              onClick={handleAddNew}
              icon={<FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />}
              className="w-full sm:w-auto"
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
      <div className="flex flex-col items-center justify-center space-y-4 py-6 sm:py-8">
        <div className="text-center px-4">
          <h3 className="text-base sm:text-lg font-medium text-[var(--color-text-primary)] mb-2">
            No Responsibilities Added
          </h3>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mb-4">
            Add your roles and responsibilities one by one.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleAddNew}
          icon={<FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />}
          className="w-full sm:w-auto mx-4 sm:mx-0"
        >
          Add First Responsibility
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-primary-500)] mb-4 sm:mb-6 px-1">
        Roles & Responsibilities
      </h2>
      {renderContent()}
    </div>
  );
}
