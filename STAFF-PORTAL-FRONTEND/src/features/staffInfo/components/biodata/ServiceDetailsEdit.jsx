import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Button from "../../../../components/ui/Button";
import FormField from "../../../../components/ui/FormField";
import Select from "../../../../components/ui/Select";

const emptyAppointment = {
  position: "",
  institution: "",
  startDate: "",
  endDate: "",
  responsibilities: "",
};

export default function ServiceDetailsEdit({ data, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    currentPosition: data?.currentPosition || "",
    department: data?.department || "",
    experience: data?.experience || "",
    appointments: data?.appointments || [{ ...emptyAppointment }],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAppointmentChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      appointments: prev.appointments.map((app, i) =>
        i === index ? { ...app, [name]: value } : app
      ),
    }));
  };

  const handleAddAppointment = () => {
    setFormData((prev) => ({
      ...prev,
      appointments: [...prev.appointments, { ...emptyAppointment }],
    }));
  };

  const handleRemoveAppointment = (index) => {
    setFormData((prev) => ({
      ...prev,
      appointments: prev.appointments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Current Details */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Current Position
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Current Position"
            name="currentPosition"
            value={formData.currentPosition}
            onChange={handleInputChange}
            required
          />
          <FormField
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            required
          />
          <FormField
            label="Total Experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Previous Appointments */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Previous Appointments
          </h3>
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddAppointment}
            icon={<FiPlus className="w-4 h-4" />}
          >
            Add Appointment
          </Button>
        </div>

        <div className="space-y-8">
          {formData.appointments.map((app, index) => (
            <div key={index} className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-[var(--color-text-primary)]">
                  Appointment {index + 1}
                </h4>
                {formData.appointments.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleRemoveAppointment(index)}
                    icon={<FiTrash2 className="w-4 h-4" />}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Position"
                  name="position"
                  value={app.position}
                  onChange={(e) => handleAppointmentChange(index, e)}
                  required
                />
                <FormField
                  label="Institution"
                  name="institution"
                  value={app.institution}
                  onChange={(e) => handleAppointmentChange(index, e)}
                  required
                />
                <FormField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={app.startDate}
                  onChange={(e) => handleAppointmentChange(index, e)}
                  required
                />
                <FormField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={app.endDate}
                  onChange={(e) => handleAppointmentChange(index, e)}
                  required
                />
                <div className="md:col-span-2">
                  <FormField
                    label="Key Responsibilities"
                    name="responsibilities"
                    value={app.responsibilities}
                    onChange={(e) => handleAppointmentChange(index, e)}
                    multiline
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
