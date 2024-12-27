import { useState } from "react";
import Button from "../../../../components/ui/Button";
import FormField from "../../../../components/ui/FormField";

export default function ContactDetailsEdit({ data, onSave, onCancel }) {
  const [formData, setFormData] = useState(data || {});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email || ""}
          onChange={handleInputChange}
          required
        />
        <FormField
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone || ""}
          onChange={handleInputChange}
          required
        />
        <div className="md:col-span-2">
          <FormField
            label="Address"
            name="address"
            value={formData.address || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <FormField
          label="City"
          name="city"
          value={formData.city || ""}
          onChange={handleInputChange}
          required
        />
        <FormField
          label="State"
          name="state"
          value={formData.state || ""}
          onChange={handleInputChange}
          required
        />
        <FormField
          label="PIN Code"
          name="pincode"
          value={formData.pincode || ""}
          onChange={handleInputChange}
          required
        />
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
