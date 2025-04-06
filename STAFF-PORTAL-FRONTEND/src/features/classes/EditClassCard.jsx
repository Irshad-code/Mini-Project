import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useState } from "react";
import axios from "axios";

const EditingClassCard = ({ editingClass, setEditingClass, setActiveForm, FormType,fetchClasses }) => {
  const [formData, setFormData] = useState(editingClass || {});
  const classId = editingClass.userclassesId;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleSubmit(e) {
    const formatTime = (time) => {
      const [hour, minute] = time.split(":");
      const hourInt = parseInt(hour, 10);
      const ampm = hourInt >= 12 ? "PM" : "AM";
      const formattedHour = hourInt % 12 || 12; // Convert 0 to 12 for 12 AM
      return `${formattedHour}:${minute} ${ampm}`;
    };
    e.preventDefault();
    const { subject, code, semester, branch, students, schedule, syllabus, courseOutcome, currentClass ,fromTime,toTime} = formData;
    console.log(formatTime(fromTime));

    const formattedShedule = `${schedule} From: ${formatTime(fromTime)} To: ${formatTime(toTime)}`;
    
    const dataToSend = { subject: subject, code: code, semester: semester, branch: branch, students: students, schedule: formattedShedule, syllabus: syllabus, courseOutcome: courseOutcome, currentClass: currentClass };

    try {
      const Response = await axios.put(`http://localhost:3000/api/usermyclasses/update/${classId}`, dataToSend);
      console.log(Response);
      //refetching the class
      await fetchClasses();
      // Close the form after successful submission
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
          {[
            "subject",
            "code",
            "semester",
            "branch",
            "students",
            "schedule",
            "fromTime",
            "toTime",
            "syllabus",
            "courseOutcome",
          ].map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-1">
                {field.charAt(0).toUpperCase() +
                  field.slice(1).replace(/([A-Z])/g, " $1")}{" "}
                {/* Formats label */}
              </label>
              <input
                type={
                  field === "students"
                    ? "number"
                    : field === "schedule"
                    ? "date"
                    : field === "fromTime" || field === "toTime"
                    ? "time"
                    : "text"
                }
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
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
