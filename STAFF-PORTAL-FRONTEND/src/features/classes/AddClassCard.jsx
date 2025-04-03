import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const AddClassCard = ({
  newClasses,
  updateNewClass,
  onAdd_classes,
  setActiveForm,
  FormType,
}) => {
  return (
    <Card className="p-6">
      <form onSubmit={onAdd_classes} className="space-y-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2">Subject Name</th>
                <th className="px-4 py-2">Subject Code</th>
                <th className="px-4 py-2">Semester</th>
                <th className="px-4 py-2">Branch</th>
                <th className="px-4 py-2">Students</th>
                <th className="px-4 py-2">Schedule</th>
                <th className="px-4 py-2">Syllabus</th>
                <th className="px-4 py-2">Course Outcome</th>
              </tr>
            </thead>
            <tbody>
              {newClasses.map((classData, index) => (
                <tr key={index}>
                  {[
                    "subject",
                    "code",
                    "semester",
                    "branch",
                    "students",
                    "schedule",
                    "syllabus",
                    "courseOutcome",
                  ].map((field) => (
                    <td key={field} className="px-2 py-1">
                      <input
                        type={
                          field === "students"
                            ? "number"
                            : field === "schedule"
                            ? "date"
                            : "text"
                        }
                        value={classData[field]}
                        onChange={(e) =>
                          updateNewClass(index, field, e.target.value)
                        }
                        className="w-full p-1 border rounded"
                        required
                        {...(field === "students" && { min: 1 })}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setActiveForm(FormType.NONE)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add Classes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AddClassCard;
