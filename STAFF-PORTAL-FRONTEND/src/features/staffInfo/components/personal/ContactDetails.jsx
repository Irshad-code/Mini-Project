import { useState } from "react";
import FormField from "../../../../components/ui/FormField";
import Button from "../../../../components/ui/Button";

const initialFormData = {
  email: "",
  phone: "",
  currentAddress: "",
  permanentAddress: "",
};

export default function ContactDetails() {
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />

        <FormField
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
        />

        <div className="md:col-span-2">
          <FormField
            label="Current Address"
            name="currentAddress"
            type="textarea"
            value={formData.currentAddress}
            onChange={handleChange}
            placeholder="Enter your current address"
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <FormField
            label="Permanent Address"
            name="permanentAddress"
            type="textarea"
            value={formData.permanentAddress}
            onChange={handleChange}
            placeholder="Enter your permanent address"
            rows={3}
          />
        </div>
      </div>

      <div>
        <Button type="submit" variant="primary">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
