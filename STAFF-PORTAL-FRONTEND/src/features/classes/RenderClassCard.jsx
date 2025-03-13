import { FiUsers, FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const RenderClassCard = ({
  classItem,
  type,
  setEditingClass,
  setActiveForm,
  setMyClass,
  FormType,
  onDelete_class
}) => {
  const navigate = useNavigate();

  return (
    <Card key={classItem.id} className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
              {classItem.subject}
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              {classItem.code} • {classItem.semester} {classItem.branch}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-[var(--color-text-secondary)]">
            <FiUsers className="w-4 h-4" />
            <span>{classItem.students} students</span>
          </div>
        </div>

        {type === "current" ? (
          <div className="space-y-2">
            <p className="text-[var(--color-text-secondary)] flex items-center space-x-2">
              <FiCalendar className="w-4 h-4" />
              <span>{classItem.schedule}</span>
              <Button
                onClick={() => {
                  setEditingClass(classItem);
                  setActiveForm(FormType.EDIT_CLASS);
                }}
                className="bg-blue-500"
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  console.log("id= ", classItem.userclassesId);
                  onDelete_class(classItem.userclassesId);
                }}
                className="bg-black"
              >
                Delete
              </Button>
              <Button
                onClick={() => {
                  setActiveForm(FormType.UPLOAD_STUDENTS);
                  setMyClass(classItem);
                  console.log(classItem);
                }}
                className="bg-blue-500"
              >
                Upload Students
              </Button>
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary" className="w-full">
                Course Files
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate(`/attendance/${classItem.userclassesId}`)}
              >
                Attendance
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate(`/internalmarks/${classItem.userclassesId}`)}
              >
                Internal Marks
              </Button>
              <Button variant="secondary" className="w-full">
                Series Marks
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between text-[var(--color-text-secondary)]">
              <span>Year: {classItem.year}</span>
              <span>Result: {classItem.result}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary" className="w-full">
                View Report
              </Button>
              <Button variant="secondary" className="w-full">
                Course Files
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RenderClassCard;
