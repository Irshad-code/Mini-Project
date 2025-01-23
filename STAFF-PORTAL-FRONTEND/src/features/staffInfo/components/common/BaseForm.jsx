import { useState, useEffect } from "react";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import FormField from "../../../../components/ui/FormField";
import Button from "../../../../components/ui/Button";
import Toast from "../../../../components/ui/Toast";

export function useBaseForm(initialData, useFormHook, validateForm) {
  const {
    data,
    isLoading,
    error,
    isEditing,
    handleEdit,
    handleSave,
    handleCancel,
  } = useFormHook;

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    if (data) {
      setFormData(data);
      setIsDirty(false);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleNestedChange = (e, parent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value,
      },
    }));
    setIsDirty(true);
    if (errors[`${parent}.${name}`]) {
      setErrors((prev) => ({
        ...prev,
        [`${parent}.${name}`]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const result = await handleSave(formData);
      if (result.success) {
        setToastMessage("Information updated successfully!");
        setToastType("success");
      } else {
        setToastMessage(result.error || "Failed to save information");
        setToastType("error");
      }
      setShowToast(true);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    isDirty,
    showToast,
    setShowToast,
    toastMessage,
    toastType,
    handleChange,
    handleNestedChange,
    handleSubmit,
    isLoading,
    error,
    isEditing,
    handleEdit,
    handleCancel,
  };
}

export function BaseFormLayout({ 
  title,
  children,
  isEditing,
  isDirty,
  handleEdit,
  handleSubmit,
  handleCancel,
  showToast,
  toastMessage,
  toastType,
  setShowToast,
  isLoading,
  error,
  data,
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!data && !isEditing) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {title} Found
          </h3>
          <p className="text-gray-500 mb-4">
            Click below to add your {title.toLowerCase()}.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleEdit}
          icon={<FiEdit2 className="w-4 h-4" />}
        >
          Add {title}
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Toast positioned absolutely relative to viewport */}
      {showToast && (
        <div className="fixed inset-x-0 top-4 flex items-center justify-center z-50">
          <Toast
            show={true}
            type={toastType}
            message={toastMessage}
            onClose={() => setShowToast(false)}
          />
        </div>
      )}

      <div className="relative">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
              {title}
            </h3>
            {!isEditing && (
              <Button
                variant="ghost"
                onClick={handleEdit}
                icon={<FiEdit2 className="w-4 h-4" />}
              >
                Edit
              </Button>
            )}
          </div>

          <div className="flex-1">
            {children}
          </div>

          {/* Action buttons at bottom */}
          {isEditing && (
            <div className="sticky bottom-0 bg-[var(--color-bg-primary)] border-t border-[var(--color-border-primary)] shadow-sm py-4 px-6 mt-8">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  icon={<FiX className="w-4 h-4" />}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  icon={<FiSave className="w-4 h-4" />}
                  disabled={!isDirty}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
