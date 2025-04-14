import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useState } from "react";
import axios from "axios";

const EditingClassCard = ({ editingClass, setEditingClass, setActiveForm, FormType, fetchClasses }) => {
  // Extract fromTime and toTime from schedule string
  const extractTime = (label) => {
    
    const match = editingClass?.schedule?.match(new RegExp(`${label}: (\\d{1,2}:\\d{2} [APM]{2})`));
    if (!match) return "";
    const [time, meridian] = match[1].split(" ");
    const [hour, minute] = time.split(":").map(Number);
    const hour24 = meridian === "PM" && hour !== 12 ? hour + 12 : meridian === "AM" && hour === 12 ? 0 : hour;
    return `${hour24.toString().padStart(2, "0")}:${minute}`;
  };

  const [formData, setFormData] = useState({
    ...editingClass,
    type: editingClass?.type || "ordinary", // Default fallback
    fromTime: extractTime("From"),
    toTime: extractTime("To"),
  });

  const classId = editingClass.userclassesId;

const handleChange = (e) => {

  const { name, value } = e.target;



  if (name === "type") {

    setFormData((prev) => ({

      ...prev,

      type: value,

      branch: value.toLowerCase() === "ordinary" ? prev.branch : "",

    }));

  } else {

    setFormData((prev) => ({

      ...prev,

      [name]: value,

    }));

  }

};



  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const hourInt = parseInt(hour, 10);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    const formattedHour = hourInt % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      subject,
      code,
      semester,
      branch,
      type,
      currentClass,
      fromTime,
      toTime,
    } = formData;

    const formattedSchedule = `From: ${formatTime(fromTime)} To: ${formatTime(toTime)}`;

    const dataToSend = {
      subject,
      code,
      semester,
      branch,
      type,
      currentClass,
      schedule: formattedSchedule,
    };

    try {
      const response = await axios.put(`http://localhost:3000/api/usermyclasses/update/${classId}`, dataToSend);
      console.log(response);
      await fetchClasses();
      setActiveForm(FormType.NONE);
      setEditingClass(null);
    } catch (error) {
      console.error("Error updating class:", error);
    }
  };

  
  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
       <div className="grid grid-cols-2 gap-4">
  {["subject", "code", "semester", "branch", "type", "fromTime", "toTime"].map((field, index) => (
    <div key={index}>
      <label className="block text-sm font-medium mb-1">
        {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
      </label>
      {field === "type" ? (
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="ordinary">Ordinary</option>
          <option value="honour">Honour</option>
          <option value="minor">Minor</option>
        </select>
      ) : field === "branch" ? (
        <input
          type="text"
          name="branch"
          value={formData.branch || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required={formData.type === "ordinary"} // Conditionally required
        />
      ) : (
        <input
          type={field === "fromTime" || field === "toTime" ? "time" : "text"}
          name={field}
          value={formData[field] || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      )}
    </div>
  ))}
</div>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setActiveForm(FormType.NONE);
              setEditingClass(null);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EditingClassCard;
